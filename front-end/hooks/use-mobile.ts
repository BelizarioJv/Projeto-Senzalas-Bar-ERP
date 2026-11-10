import * as React from "react"

const MOBILE_BREAKPOINT = 768

const mediaQuery = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

export function useIsMobile() {
  const isMobile = React.useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(mediaQuery)
      query.addEventListener("change", onChange)
      return () => query.removeEventListener("change", onChange)
    },
    () => window.matchMedia(mediaQuery).matches,
    () => false,
  )

  return isMobile
}
