// Small runtime checks shared by the motion system. Client-only.

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

export const isDesktop = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches

/** Motion is off when the user asked for less motion or the init watchdog fired. */
export const motionDisabled = () =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('anim-off')
