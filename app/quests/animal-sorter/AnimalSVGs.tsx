"use client";

export function CatSVG({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <style>{`@keyframes tail{0%,100%{d:path("M85 75 Q95 65 90 55")}50%{d:path("M85 75 Q100 70 95 55")}}`}</style>
      {/* Body */}
      <ellipse cx="55" cy="75" rx="28" ry="20" fill="#f97316" />
      {/* Head */}
      <circle cx="35" cy="50" r="18" fill="#f97316" />
      {/* Ears */}
      <polygon points="22,38 18,20 32,32" fill="#f97316" />
      <polygon points="42,32 52,20 48,38" fill="#f97316" />
      <polygon points="24,36 21,25 31,33" fill="#fbbf24" />
      <polygon points="43,33 49,25 46,36" fill="#fbbf24" />
      {/* Eyes */}
      <ellipse cx="29" cy="48" rx="3" ry="4" fill="#1e293b" />
      <ellipse cx="41" cy="48" r="3" ry="4" fill="#1e293b" />
      {/* Nose */}
      <polygon points="35,53 33,56 37,56" fill="#ec4899" />
      {/* Whiskers */}
      <line x1="10" y1="52" x2="28" y2="54" stroke="#1e293b" strokeWidth="1" />
      <line x1="10" y1="56" x2="28" y2="56" stroke="#1e293b" strokeWidth="1" />
      <line x1="42" y1="54" x2="60" y2="52" stroke="#1e293b" strokeWidth="1" />
      <line x1="42" y1="56" x2="60" y2="56" stroke="#1e293b" strokeWidth="1" />
      {/* Legs */}
      <rect x="35" y="88" width="8" height="14" rx="4" fill="#ea580c" />
      <rect x="55" y="88" width="8" height="14" rx="4" fill="#ea580c" />
      <rect x="68" y="88" width="8" height="14" rx="4" fill="#ea580c" />
      {/* Tail */}
      <path d="M85 75 Q95 65 90 55" stroke="#f97316" strokeWidth="5" strokeLinecap="round" fill="none" style={{ animation: "tail 2s ease-in-out infinite" }} />
    </svg>
  );
}

export function DogSVG({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <style>{`@keyframes wag{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(15deg)}}`}</style>
      {/* Body */}
      <ellipse cx="60" cy="72" rx="30" ry="22" fill="#92400e" />
      {/* Head */}
      <circle cx="35" cy="48" r="20" fill="#b45309" />
      {/* Ears */}
      <ellipse cx="18" cy="40" rx="8" ry="16" fill="#78350f" transform="rotate(-15 18 40)" />
      <ellipse cx="50" cy="38" rx="8" ry="16" fill="#78350f" transform="rotate(15 50 38)" />
      {/* Eyes */}
      <circle cx="29" cy="45" r="3.5" fill="#1e293b" />
      <circle cx="41" cy="45" r="3.5" fill="#1e293b" />
      <circle cx="30" cy="44" r="1.2" fill="white" />
      <circle cx="42" cy="44" r="1.2" fill="white" />
      {/* Nose */}
      <ellipse cx="35" cy="54" rx="4" ry="3" fill="#1e293b" />
      {/* Mouth */}
      <path d="M35 57 Q32 62 28 60" stroke="#1e293b" strokeWidth="1.5" fill="none" />
      <path d="M35 57 Q38 62 42 60" stroke="#1e293b" strokeWidth="1.5" fill="none" />
      {/* Tongue */}
      <ellipse cx="35" cy="62" rx="3" ry="4" fill="#f87171" />
      {/* Legs */}
      <rect x="38" y="88" width="9" height="16" rx="4" fill="#78350f" />
      <rect x="55" y="88" width="9" height="16" rx="4" fill="#78350f" />
      <rect x="72" y="88" width="9" height="16" rx="4" fill="#78350f" />
      {/* Tail */}
      <g style={{ transformOrigin: "88px 60px", animation: "wag 0.5s ease-in-out infinite" }}>
        <path d="M88 68 Q95 55 92 42" stroke="#92400e" strokeWidth="6" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

export function BirdSVG({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <style>{`@keyframes flap{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-20deg)}}`}</style>
      {/* Body */}
      <ellipse cx="60" cy="70" rx="22" ry="18" fill="#22c55e" />
      {/* Head */}
      <circle cx="60" cy="42" r="16" fill="#16a34a" />
      {/* Eye */}
      <circle cx="66" cy="40" r="3" fill="#1e293b" />
      <circle cx="67" cy="39" r="1" fill="white" />
      {/* Beak */}
      <polygon points="76,42 86,45 76,48" fill="#f59e0b" />
      {/* Wing left */}
      <g style={{ transformOrigin: "42px 65px", animation: "flap 1s ease-in-out infinite" }}>
        <ellipse cx="35" cy="65" rx="18" ry="10" fill="#15803d" transform="rotate(-20 35 65)" />
      </g>
      {/* Wing right */}
      <g style={{ transformOrigin: "78px 65px", animation: "flap 1s ease-in-out infinite" }}>
        <ellipse cx="85" cy="65" rx="18" ry="10" fill="#15803d" transform="rotate(20 85 65)" />
      </g>
      {/* Tail */}
      <polygon points="45,85 35,100 55,100" fill="#15803d" />
      {/* Feet */}
      <line x1="52" y1="88" x2="48" y2="102" stroke="#f59e0b" strokeWidth="2.5" />
      <line x1="68" y1="88" x2="72" y2="102" stroke="#f59e0b" strokeWidth="2.5" />
      <line x1="45" y1="102" x2="52" y2="102" stroke="#f59e0b" strokeWidth="2.5" />
      <line x1="69" y1="102" x2="76" y2="102" stroke="#f59e0b" strokeWidth="2.5" />
    </svg>
  );
}

export function FishSVG({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <style>{`@keyframes swim{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}`}</style>
      <g style={{ animation: "swim 1.5s ease-in-out infinite" }}>
        {/* Body */}
        <ellipse cx="55" cy="60" rx="30" ry="18" fill="#06b6d4" />
        {/* Tail */}
        <polygon points="85,60 105,42 105,78" fill="#0891b2" />
        {/* Eye */}
        <circle cx="38" cy="55" r="5" fill="white" />
        <circle cx="39" cy="55" r="3" fill="#1e293b" />
        {/* Mouth */}
        <ellipse cx="25" cy="62" rx="3" ry="2" fill="#0e7490" />
        {/* Dorsal fin */}
        <path d="M50 42 Q60 25 70 42" fill="#0891b2" />
        {/* Bottom fin */}
        <path d="M55 78 Q60 90 68 78" fill="#0891b2" />
        {/* Scales */}
        <path d="M45 55 Q50 50 55 55" stroke="#0e7490" strokeWidth="1" fill="none" />
        <path d="M55 55 Q60 50 65 55" stroke="#0e7490" strokeWidth="1" fill="none" />
        <path d="M50 63 Q55 58 60 63" stroke="#0e7490" strokeWidth="1" fill="none" />
        {/* Bubbles */}
        <circle cx="18" cy="48" r="2.5" fill="none" stroke="#67e8f9" strokeWidth="1" opacity="0.6" />
        <circle cx="14" cy="40" r="1.5" fill="none" stroke="#67e8f9" strokeWidth="1" opacity="0.4" />
      </g>
    </svg>
  );
}

export function RabbitSVG({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <style>{`@keyframes twitch{0%,90%,100%{transform:rotate(0)}93%{transform:rotate(5deg)}96%{transform:rotate(-5deg)}}`}</style>
      {/* Body */}
      <ellipse cx="60" cy="78" rx="24" ry="20" fill="#d8b4fe" />
      {/* Head */}
      <circle cx="60" cy="50" r="18" fill="#c084fc" />
      {/* Ears */}
      <ellipse cx="48" cy="22" rx="6" ry="20" fill="#c084fc" />
      <ellipse cx="72" cy="22" rx="6" ry="20" fill="#c084fc" />
      <ellipse cx="48" cy="22" rx="3.5" ry="15" fill="#f9a8d4" />
      <ellipse cx="72" cy="22" rx="3.5" ry="15" fill="#f9a8d4" />
      {/* Eyes */}
      <circle cx="52" cy="48" r="3.5" fill="#1e293b" />
      <circle cx="68" cy="48" r="3.5" fill="#1e293b" />
      <circle cx="53" cy="47" r="1.2" fill="white" />
      <circle cx="69" cy="47" r="1.2" fill="white" />
      {/* Nose */}
      <g style={{ transformOrigin: "60px 56px", animation: "twitch 2s ease-in-out infinite" }}>
        <ellipse cx="60" cy="56" rx="3" ry="2.5" fill="#ec4899" />
      </g>
      {/* Mouth */}
      <path d="M60 58 Q57 63 54 61" stroke="#1e293b" strokeWidth="1.2" fill="none" />
      <path d="M60 58 Q63 63 66 61" stroke="#1e293b" strokeWidth="1.2" fill="none" />
      {/* Cheeks */}
      <circle cx="45" cy="55" r="4" fill="#f9a8d4" opacity="0.4" />
      <circle cx="75" cy="55" r="4" fill="#f9a8d4" opacity="0.4" />
      {/* Feet */}
      <ellipse cx="48" cy="100" rx="8" ry="5" fill="#a855f7" />
      <ellipse cx="72" cy="100" rx="8" ry="5" fill="#a855f7" />
      {/* Tail */}
      <circle cx="60" cy="98" r="5" fill="white" />
    </svg>
  );
}
