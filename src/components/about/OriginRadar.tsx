import { company } from '@/content/site'
import { LocalTime } from '@/components/ui/LocalTime'

/** A quiet "you are here" radar centred on Dubai. Decorative except the labels. */
export function OriginRadar({ className = '' }: { className?: string }) {
  return (
    <div className={`relative mx-auto aspect-square w-full max-w-[540px] ${className}`}>
      <svg viewBox="0 0 400 400" fill="none" className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <radialGradient id="radar-core" cx="0.5" cy="0.5" r="0.5">
            <stop stopColor="#22d0fc" stopOpacity="0.35" />
            <stop offset="1" stopColor="#22d0fc" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="radar-ring" x1="0" y1="400" x2="400" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5a3bff" />
            <stop offset="1" stopColor="#22d0fc" />
          </linearGradient>
        </defs>
        {[190, 150, 110, 70].map((r, i) => (
          <circle key={r} cx="200" cy="200" r={r} stroke={i === 2 ? 'url(#radar-ring)' : 'rgb(255 255 255 / 0.1)'} />
        ))}
        <path d="M200 0v400M0 200h400" stroke="rgb(255 255 255 / 0.07)" />
        <circle cx="200" cy="200" r="190" stroke="rgb(255 255 255 / 0.18)" strokeDasharray="1 9" />
        <circle cx="200" cy="200" r="60" fill="url(#radar-core)" />
        {/* bearing ticks */}
        {Array.from({ length: 72 }, (_, i) => {
          const a = (i / 72) * Math.PI * 2
          const r1 = i % 6 === 0 ? 176 : 182
          return (
            <line
              key={i}
              x1={200 + Math.cos(a) * r1}
              y1={200 + Math.sin(a) * r1}
              x2={200 + Math.cos(a) * 190}
              y2={200 + Math.sin(a) * 190}
              stroke="rgb(255 255 255 / 0.22)"
            />
          )
        })}
      </svg>

      {/* Sweep */}
      <div
        aria-hidden="true"
        className="absolute inset-[2.5%] rounded-full [animation:spin-slow_7s_linear_infinite]"
        style={{ background: 'conic-gradient(from 0deg, rgb(34 195 255 / 0.32), transparent 22%)' }}
      />

      {/* Dubai */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span aria-hidden="true" className="absolute top-1/2 left-1/2 -mt-2 -ml-2 size-4 rounded-full bg-cyan/50 [animation:pulse-ring_2.4s_ease-out_infinite]" />
        <span aria-hidden="true" className="relative block size-3 rounded-full bg-white shadow-[0_0_24px_4px_rgb(34_195_255_/_0.8)]" />
      </div>
      <div className="absolute top-[56%] left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 text-center whitespace-nowrap">
        <span className="font-display text-lg font-medium tracking-[-0.03em] text-white">{company.location}</span>
        <span className="mono-label text-[0.62rem] text-slate">{company.coordinates}</span>
        <LocalTime className="mono-label text-[0.62rem] text-glow" />
      </div>
    </div>
  )
}
