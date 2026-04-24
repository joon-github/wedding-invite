"use client";

import { useEffect } from "react";
import { EnvelopeIntro, useEnvelopeIntro } from "./envelope-intro";

export function EnvelopeGate() {
  const { guestName, show, dismiss } = useEnvelopeIntro();

  useEffect(() => {
    if (!show) {
      document.getElementById("envelope-curtain")?.remove();
    }
  }, [show]);

  if (!show || !guestName) return null;

  return <EnvelopeIntro guestName={guestName} onComplete={dismiss} />;
}
