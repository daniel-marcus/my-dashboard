import { useState, useEffect } from "react"

export function useIsDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => !!getMediaQuery()?.matches)

  useEffect(() => {
    const mediaQuery = getMediaQuery()
    if (!mediaQuery) return
    const onChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
    mediaQuery.addEventListener("change", onChange)
    return () => mediaQuery.removeEventListener("change", onChange)
  }, [])

  return isDarkMode
}

const getMediaQuery = () =>
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : undefined
