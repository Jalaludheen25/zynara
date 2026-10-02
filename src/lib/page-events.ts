// Coordinates the page-transition curtain with on-page reveal animations.
// The curtain announces when a page is uncovered; reveals wait for that moment.

const ENTER_EVENT = 'zynara:page-enter'

let enteredKey: string | null = null

export function announcePageEnter(key: string) {
  enteredKey = key
  window.dispatchEvent(new CustomEvent(ENTER_EVENT, { detail: key }))
}

/** Runs `callback` once the page identified by `key` has been revealed. */
export function onPageEnter(key: string, callback: () => void) {
  if (enteredKey === key) {
    callback()
    return () => {}
  }
  const handler = (event: Event) => {
    if ((event as CustomEvent<string>).detail === key) callback()
  }
  window.addEventListener(ENTER_EVENT, handler)
  return () => window.removeEventListener(ENTER_EVENT, handler)
}
