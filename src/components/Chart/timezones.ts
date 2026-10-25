import { TickMarkType, type Time, type TickMarkFormatter } from "lightweight-charts"

// The chart works on real UTC timestamps; only the labels are rendered in local time.
// (Shifting the data itself to local time breaks on DST changes: the repeated hour in
// autumn makes time go backwards, which lightweight-charts rejects.)
// https://tradingview.github.io/lightweight-charts/docs/time-zones
const toDate = (time: Time) => new Date((time as number) * 1000)

export function timeFormatter(time: Time) {
  return toDate(time).toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const tickMarkFormatter: TickMarkFormatter = (time, tickMarkType, locale) => {
  const d = toDate(time)
  switch (tickMarkType) {
    case TickMarkType.Year:
      return d.toLocaleDateString(locale, { year: "numeric" })
    case TickMarkType.Month:
      return d.toLocaleDateString(locale, { month: "short" })
    case TickMarkType.DayOfMonth:
      return d.toLocaleDateString(locale, { day: "numeric" })
    case TickMarkType.Time:
      return d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
    case TickMarkType.TimeWithSeconds:
      return d.toLocaleTimeString(locale)
  }
}
