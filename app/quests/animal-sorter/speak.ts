"use client";

let cachedVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

function loadVoices(): SpeechSynthesisVoice[] {
  const voices = speechSynthesis.getVoices();
  voicesLoaded = voices.length > 0;
  return voices;
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;
  const voices = loadVoices();
  // Prefer high-quality English voices in this order
  const prefs = ["Google US English", "Google UK English Female", "Samantha", "Karen", "Moira", "Fiona", "Tessa", "Microsoft Zira", "Microsoft Jenny"];
  for (const p of prefs) {
    const v = voices.find((v) => v.name.includes(p));
    if (v) { cachedVoice = v; return v; }
  }
  // Fallback: any English voice that's NOT "compact" or low quality
  cachedVoice = voices.find((v) => v.lang.startsWith("en") && !v.name.includes("compact")) ??
    voices.find((v) => v.lang.startsWith("en")) ?? voices[0] ?? null;
  return cachedVoice;
}

if (typeof window !== "undefined") {
  loadVoices();
  speechSynthesis.onvoiceschanged = () => { cachedVoice = null; loadVoices(); };
}

export function speak(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") { resolve(); return; }
    speechSynthesis.cancel();
    const clean = text.replace(/[✅❌👏🤔🎉✨🏷️🤖💥⚠️🦸🔋⚡🛻🐾]/g, "").replace(/\s+/g, " ").trim();
    if (!clean) { resolve(); return; }
    const u = new SpeechSynthesisUtterance(clean);
    u.rate = 0.85;
    u.pitch = 1.15;
    u.volume = 1;
    const v = pickVoice();
    if (v) u.voice = v;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    speechSynthesis.speak(u);
  });
}
