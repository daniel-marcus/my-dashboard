import type { UTCTimestamp } from "lightweight-charts"

// https://tradingview.github.io/lightweight-charts/docs/time-zones
export function timeToLocal(originalUnixTs: number) {
  const d = new Date(originalUnixTs * 1000)
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
