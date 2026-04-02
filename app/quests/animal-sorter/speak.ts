"use client";

let voice: SpeechSynthesisVoice | null = null;

function getVoice() {
  if (voice) return voice;
  const voices = speechSynthesis.getVoices();
  voice = voices.find((v) => v.name.includes("Samantha")) ??
    voices.find((v) => v.lang.startsWith("en") && v.name.includes("Female")) ??
    voices.find((v) => v.lang.startsWith("en")) ??
    voices[0] ?? null;
  return voice;
}

// preload voices
if (typeof window !== "undefined") {
  speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = () => { voice = null; getVoice(); };
}

export function speak(text: string, rate = 0.9) {
  if (typeof window === "undefined") return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = rate;
  u.pitch = 1.3;
  const v = getVoice();
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}
