"use client";

import { useEffect, useRef } from "react";

const BGM_SRC = "/audio/bgm-5min.mp3";
const BGM_VOLUME = 0.45;

export function BgmAutoplay() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = BGM_VOLUME;

    const play = () => {
      audio.play().catch(() => {
        // Mobile browsers usually require a user gesture before playing audio.
      });
    };
    const removeGestureListeners = () => {
      window.removeEventListener("click", playAndCleanup);
      window.removeEventListener("pointerdown", playAndCleanup);
      window.removeEventListener("touchstart", playAndCleanup);
    };
    const playAndCleanup = () => {
      play();
      removeGestureListeners();
    };

    play();
    window.addEventListener("click", playAndCleanup, { once: true });
    window.addEventListener("pointerdown", playAndCleanup, { once: true });
    window.addEventListener("touchstart", playAndCleanup, { once: true });

    return removeGestureListeners;
  }, []);

  return (
    <audio
      ref={audioRef}
      src={BGM_SRC}
      loop
      preload="metadata"
      aria-hidden="true"
    />
  );
}
