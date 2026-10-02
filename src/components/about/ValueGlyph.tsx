/** Abstract line glyphs, one per value. Purely decorative. */
export function ValueGlyph({ index }: { index: number }) {
  const id = `vg-${index}`
  const stroke = `url(#${id})`

  return (
    <svg viewBox="0 0 120 120" fill="none" className="size-24 lg:size-28" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="120" x2="120" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5a3bff" />
          <stop offset="1" stopColor="#22d0fc" />
        </linearGradient>
      </defs>

      {index === 0 && (
        // Human-first: the person at the centre of every decision
        <g>
          <circle cx="60" cy="60" r="52" stroke="rgb(255 255 255 / 0.12)" />
          <circle cx="60" cy="60" r="36" stroke="rgb(255 255 255 / 0.18)" />
          <circle cx="60" cy="60" r="20" stroke={stroke} strokeWidth="1.5" />
          <circle cx="60" cy="60" r="5" fill="#7edfff" />
          <circle
            cx="60"
            cy="60"
            r="20"
            stroke="#7edfff"
            strokeOpacity="0.6"
            className="origin-center [animation:pulse-ring_3.2s_ease-out_infinite] [transform-box:fill-box]"
          />
        </g>
      )}

      {index === 1 && (
        // Region-aware: a compass rose and bearing ring
        <g>
          <circle cx="60" cy="60" r="50" stroke="rgb(255 255 255 / 0.14)" strokeDasharray="2 6" className="origin-center [animation:spin-slow_40s_linear_infinite] [transform-box:fill-box]" />
          <circle cx="60" cy="60" r="34" stroke={stroke} strokeWidth="1.5" />
          <path d="M60 14v18M60 88v18M14 60h18M88 60h18" stroke="rgb(255 255 255 / 0.3)" strokeLinecap="round" />
          <path d="M60 36 66 60 60 84 54 60Z" fill={stroke} fillOpacity="0.85" />
          <circle cx="60" cy="60" r="3" fill="#080d1b" />
        </g>
      )}

      {index === 2 && (
        // Clear by default: noisy lines resolving into order
        <g strokeLinecap="round" strokeWidth="1.5">
          <path d="M18 34h84" stroke={stroke} />
          <path d="M18 50h62" stroke="rgb(255 255 255 / 0.4)" />
          <path d="M18 66h76" stroke="rgb(255 255 255 / 0.25)" />
          <path d="M18 82h44" stroke="rgb(255 255 255 / 0.15)" />
          <circle cx="102" cy="82" r="6" stroke={stroke} />
          <path d="m99 82 2.2 2.2L105 80" stroke="#7edfff" />
        </g>
      )}

      {index === 3 && (
        // Responsible from day one: nested layers of protection
        <g>
          <rect x="14" y="14" width="92" height="92" rx="24" stroke="rgb(255 255 255 / 0.12)" />
          <rect x="28" y="28" width="64" height="64" rx="18" stroke="rgb(255 255 255 / 0.2)" />
          <rect x="42" y="42" width="36" height="36" rx="11" stroke={stroke} strokeWidth="1.5" />
          <rect x="54" y="54" width="12" height="12" rx="4" fill="#7edfff" className="origin-center [animation:float-y_4s_ease-in-out_infinite] [transform-box:fill-box]" />
        </g>
      )}
    </svg>
  )
}
