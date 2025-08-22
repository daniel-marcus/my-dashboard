import type { UTCTimestamp } from "lightweight-charts"

// https://tradingview.github.io/lightweight-charts/docs/time-zones
export function timeToLocal(originalTimeMs: number) {
  const d = new Date(originalTimeMs)
  const zonedTime = Date.UTC(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds(),
    d.getMilliseconds()
  )
  return Math.round(zonedTime / 1000) as UTCTimestamp
}
