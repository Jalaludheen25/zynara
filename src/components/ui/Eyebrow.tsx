type Props = {
  children: string
  tone?: 'dark' | 'light' | 'plain'
  intro?: boolean
  delay?: number
  className?: string
}

const tones = { dark: 'text-glow', light: 'text-indigo', plain: 'text-white' }

/** Mono uppercase section label with the brand gradient rule. */
export function Eyebrow({ children, tone = 'dark', intro, delay, className = '' }: Props) {
  return (
    <p
      className={`eyebrow ${tones[tone]} ${className}`}
      data-reveal="fade"
      data-intro={intro ? '' : undefined}
      data-delay={delay}
    >
      {children}
    </p>
  )
}
