"use client";

// Gentle looping background music using Web Audio API — no external files needed
let ctx: AudioContext | null = null;
let gainNode: GainNode | null = null;
let playing = false;
let timer: ReturnType<typeof setTimeout> | undefined;

const NOTES: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25,
};

// Simple lullaby-like melody, gentle and non-distracting
const MELODY = [
  { note: "C4", dur: 0.5 }, { note: "E4", dur: 0.5 }, { note: "G4", dur: 0.75 },
  { note: "E4", dur: 0.5 }, { note: "F4", dur: 0.5 }, { note: "A4", dur: 0.75 },
  { note: "G4", dur: 0.5 }, { note: "E4", dur: 0.5 }, { note: "D4", dur: 0.75 },
  { note: "C4", dur: 1.0 },
];

function playLoop() {
  if (!ctx || !gainNode || !playing) return;
  let t = ctx.currentTime + 0.1;
  for (const { note, dur } of MELODY) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = NOTES[note];
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.06, t + 0.05);
    g.gain.linearRampToValueAtTime(0.06, t + dur - 0.05);
    g.gain.linearRampToValueAtTime(0, t + dur);
    osc.connect(g).connect(gainNode);
    osc.start(t);
    osc.stop(t + dur);
    t += dur;
  }
  const loopDur = MELODY.reduce((s, m) => s + m.dur, 0);
  timer = setTimeout(playLoop, loopDur * 1000);
}

export function startMusic() {
  if (playing) return;
  if (typeof window === "undefined") return;
  ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  gainNode = ctx.createGain();
  gainNode.gain.value = 0.5;
  gainNode.connect(ctx.destination);
  playing = true;
  playLoop();
}

export function stopMusic() {
  playing = false;
  clearTimeout(timer);
  if (ctx) { ctx.close().catch(() => {}); ctx = null; }
  gainNode = null;
}

export function setMusicVolume(v: number) {
  if (gainNode) gainNode.gain.value = Math.max(0, Math.min(1, v));
}
