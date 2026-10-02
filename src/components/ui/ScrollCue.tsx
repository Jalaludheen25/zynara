export function ScrollCue({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="mono-label">Scroll</span>
      <span className="relative block h-10 w-px overflow-hidden bg-white/15">
        <span className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-transparent to-cyan [animation:scroll-cue_2.4s_var(--ease-quart)_infinite]" />
      </span>
    </span>
  )
}
