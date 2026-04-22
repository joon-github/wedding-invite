"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    kakao?: {
      maps: {
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (
          container: HTMLElement,
          options: { center: unknown; level: number },
        ) => unknown;
        Marker: new (options: { position: unknown }) => {
          setMap: (map: unknown) => void;
        };
        load: (callback: () => void) => void;
      };
    };
  }
}

type KakaoMapProps = {
  title: string;
  address: string;
  lat: number;
  lng: number;
  naverUrl: string;
  kakaoUrl: string;
};

export function KakaoMap({
  title,
  address,
  lat,
  lng,
  naverUrl,
  kakaoUrl,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

  useEffect(() => {
    if (!appKey || !mapRef.current) {
      return;
    }

    const scriptId = "kakao-map-sdk";

    function renderMap() {
      if (!window.kakao || !mapRef.current) {
        return;
      }

      window.kakao.maps.load(() => {
        const center = new window.kakao!.maps.LatLng(lat, lng);
        const map = new window.kakao!.maps.Map(mapRef.current!, {
          center,
          level: 3,
        });
        const marker = new window.kakao!.maps.Marker({ position: center });

        marker.setMap(map);
        setReady(true);
      });
    }

    if (document.getElementById(scriptId)) {
      renderMap();
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.async = true;
    script.onload = renderMap;
    document.head.appendChild(script);
  }, [appKey, lat, lng]);

  if (!appKey) {
    return (
      <div className="grid aspect-[16/11] place-items-center border border-black/20 bg-[#e7e1d6] px-5 text-center">
        <div>
          <p className="text-lg font-black">{title}</p>
          <p className="mt-2 text-sm leading-6">{address}</p>
          <p className="mt-4 text-xs leading-5 text-black/55">
            카카오 지도 API 키를 넣으면 이 영역에 실제 지도가 표시됩니다.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <a
              href={naverUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center justify-center rounded-full bg-black px-3 text-xs font-semibold text-white"
            >
              네이버지도
            </a>
            <a
              href={kakaoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center justify-center rounded-full bg-[#fee500] px-3 text-xs font-semibold text-black"
            >
              카카오맵
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/11] overflow-hidden border border-black/20 bg-[#e7e1d6]">
      <div ref={mapRef} className="h-full w-full" aria-label={`${title} 지도`} />
      {!ready ? (
        <div className="absolute inset-0 grid place-items-center bg-[#e7e1d6] text-sm font-semibold text-black/65">
          지도를 불러오는 중
        </div>
      ) : null}
    </div>
  );
}
