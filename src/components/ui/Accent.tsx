import type { ReactNode } from 'react'

/**
 * Styles one phrase of a content string (e.g. the serif italic accent in
 * display headings) without altering the copy itself.
 */
export function withAccent(
  text: string,
  phrase: string,
  className = 'serif-accent text-gradient pr-[0.06em]',
): ReactNode {
  const index = text.indexOf(phrase)
  if (index < 0) return text
  return (
    <>
      {text.slice(0, index)}
      <span className={className}>{phrase}</span>
      {text.slice(index + phrase.length)}
    </>
  )
}
