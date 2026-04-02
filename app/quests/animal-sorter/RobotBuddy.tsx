"use client";

type Mood = "idle" | "happy" | "confused" | "celebrate" | "thinking";

export default function RobotBuddy({ mood = "idle", size = 100 }: { mood?: Mood; size?: number }) {
  const eyeL = mood === "confused" ? "6" : mood === "happy" || mood === "celebrate" ? "2" : "5";
  const eyeR = mood === "confused" ? "3" : mood === "happy" || mood === "celebrate" ? "2" : "5";
  const mouthD = mood === "happy" || mood === "celebrate"
    ? "M36 68 Q45 78 54 68"
    : mood === "confused"
    ? "M38 70 Q45 66 52 70"
    : "M38 68 Q45 72 52 68";
  const bodyColor = mood === "celebrate" ? "#fbbf24" : "#38bdf8";
  const antennaAnim = mood === "thinking" ? "antenna-think 0.6s ease-in-out infinite" : mood === "celebrate" ? "antenna-party 0.4s ease-in-out infinite" : "none";
  const bodyAnim = mood === "celebrate" ? "bounce 0.5s ease-in-out infinite" : mood === "happy" ? "wiggle 0.6s ease-in-out" : "none";

  return (
    <svg width={size} height={size} viewBox="0 0 90 95" fill="none">
      <style>{`
        @keyframes antenna-think{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
        @keyframes antenna-party{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(10deg)}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes wiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(-3deg)}75%{transform:rotate(3deg)}}
        @keyframes blink{0%,90%,100%{ry:${eyeL}}95%{ry:1}}
      `}</style>
      {/* Antenna */}
      <g style={{ transformOrigin: "45px 18px", animation: antennaAnim }}>
        <line x1="45" y1="18" x2="45" y2="6" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="45" cy="5" r="4" fill={mood === "celebrate" ? "#ef4444" : mood === "thinking" ? "#fbbf24" : "#38bdf8"}>
          {mood === "thinking" && <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />}
        </circle>
      </g>
      {/* Body */}
      <g style={{ transformOrigin: "45px 55px", animation: bodyAnim }}>
        {/* Head */}
        <rect x="15" y="18" width="60" height="50" rx="14" fill={bodyColor} />
        {/* Face plate */}
        <rect x="22" y="28" width="46" height="32" rx="8" fill="#0f172a" opacity="0.85" />
        {/* Eyes */}
        <ellipse cx="36" cy="44" rx="5" ry={eyeL} fill="#4ade80">
          {mood === "idle" && <animate attributeName="ry" values={`${eyeL};1;${eyeL}`} dur="3s" repeatCount="indefinite" begin="2s" />}
        </ellipse>
        <ellipse cx="54" cy="44" rx="5" ry={eyeR} fill="#4ade80">
          {mood === "idle" && <animate attributeName="ry" values={`${eyeR};1;${eyeR}`} dur="3s" repeatCount="indefinite" begin="2s" />}
        </ellipse>
        {/* Sparkle eyes when celebrating */}
        {mood === "celebrate" && <>
          <text x="32" y="48" fontSize="10" fill="#fbbf24">★</text>
          <text x="50" y="48" fontSize="10" fill="#fbbf24">★</text>
        </>}
        {/* Mouth */}
        <path d={mouthD} stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Confused question mark */}
        {mood === "confused" && <text x="62" y="30" fontSize="14" fill="#fbbf24">?</text>}
        {/* Cheek blush when happy */}
        {(mood === "happy" || mood === "celebrate") && <>
          <circle cx="26" cy="52" r="4" fill="#f87171" opacity="0.3" />
          <circle cx="64" cy="52" r="4" fill="#f87171" opacity="0.3" />
        </>}
        {/* Arms */}
        <rect x="5" y="38" width="10" height="6" rx="3" fill="#94a3b8" />
        <rect x="75" y="38" width="10" height="6" rx="3" fill="#94a3b8" />
        {/* Legs */}
        <rect x="28" y="68" width="8" height="12" rx="4" fill="#94a3b8" />
        <rect x="54" y="68" width="8" height="12" rx="4" fill="#94a3b8" />
        {/* Feet */}
        <ellipse cx="32" cy="82" rx="7" ry="4" fill="#64748b" />
        <ellipse cx="58" cy="82" rx="7" ry="4" fill="#64748b" />
      </g>
      {/* Celebrate sparkles */}
      {mood === "celebrate" && <>
        <text x="2" y="15" fontSize="12">✨</text>
        <text x="72" y="12" fontSize="12">✨</text>
        <text x="10" y="90" fontSize="10">🎉</text>
        <text x="68" y="90" fontSize="10">🎉</text>
      </>}
    </svg>
  );
}
