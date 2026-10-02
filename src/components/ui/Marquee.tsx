type Props = { items: readonly string[]; className?: string; duration?: number }

/** Infinite, CSS-only marquee (pauses on hover, stops for reduced motion). */
export function Marquee({ items, className = '', duration = 38 }: Props) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center">
          <span className="px-[0.35em]">{item}</span>
          <span className="px-[0.35em] opacity-40">·</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className={`marquee-wrap overflow-hidden ${className}`}>
      <div className="marquee" style={{ ['--marquee-duration' as string]: `${duration}s` }}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
