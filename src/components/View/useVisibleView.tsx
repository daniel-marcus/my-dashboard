import { useState, useCallback, useMemo } from "react"
import type { ViewDef } from "@/lib/types"

export function useVisibleView(view: ViewDef) {
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const toggleKey = useCallback((key: string) => {
    setHidden((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])
  const visibleView = useMemo(
    () => ({
      ...view,
      props: view.props.map((p) => ({ ...p, hidden: hidden.has(p.key) })),
    }),
    [view, hidden],
  )
  return [visibleView, toggleKey] as const
}
