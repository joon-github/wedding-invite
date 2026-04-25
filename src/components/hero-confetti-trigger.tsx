"use client";

import { useEffect, useRef } from "react";

type HeroConfettiTriggerProps = {
  targetId: string;
};

export function HeroConfettiTrigger({ targetId }: HeroConfettiTriggerProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    function triggerConfetti() {
      if (firedRef.current) {
        return;
      }

      const fireConfetti = (window as Window & {
        __fireConfetti?: () => void;
      }).__fireConfetti;

      if (!fireConfetti) {
        window.setTimeout(triggerConfetti, 150);
        return;
      }

      firedRef.current = true;
      window.setTimeout(() => {
        fireConfetti();
      }, 200);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        triggerConfetti();
      },
      {
        threshold: 0.6,
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [targetId]);

  return null;
}
