"use client";

import { EnvelopeIntro, useEnvelopeIntro } from "./envelope-intro";

export function EnvelopeGate() {
  const { guestName, show, dismiss } = useEnvelopeIntro();

  if (!show || !guestName) return null;

  return <EnvelopeIntro guestName={guestName} onComplete={dismiss} />;
}
