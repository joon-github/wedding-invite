"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./kakao-map.module.scss";

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
      <div className={styles.placeholder}>
        <div>
          <p className={styles.placeholderTitle}>{title}</p>
          <p className={styles.placeholderAddress}>{address}</p>
          <p className={styles.placeholderHint}>
            카카오 지도 API 키를 넣으면 이 영역에 실제 지도가 표시됩니다.
          </p>
          <div className={styles.placeholderActions}>
            <a
              href={naverUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.placeholderNaver}
            >
              네이버지도
            </a>
            <a
              href={kakaoUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.placeholderKakao}
            >
              카카오맵
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mapContainer}>
      <div ref={mapRef} className={styles.mapElement} aria-label={`${title} 지도`} />
      {!ready ? (
        <div className={styles.mapLoading}>
          지도를 불러오는 중
        </div>
      ) : null}
    </div>
  );
}
