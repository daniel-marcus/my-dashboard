import type { UTCTimestamp } from "lightweight-charts"

// https://tradingview.github.io/lightweight-charts/docs/time-zones
export function timeToLocal(originalTimeMs: number) {
  const d = new Date(originalTimeMs)
  return (Date.UTC(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds(),
    d.getMilliseconds()
  ) / 1000) as UTCTimestamp
}
