import type { ViewDef, RangeDef, SettingsObj } from "./types"

export const VIEWS: ViewDef[] = [
  {
    key: "co2",
    props: [{ key: "co2" }],
    unit: "ppm",
    default: true,
  },
  {
    key: "temp",
    props: [{ key: "temp" }],
    unit: "°C",
  },
  {
    key: "ext+temp",
    props: [{ key: "temp_ext", color: "hsl(162, 70%, 50%)" }, { key: "temp" }],
    unit: "°C",
  },
  {
    key: "hum",
    props: [{ key: "hum" }],
    unit: "%",
  },
]

const HOUR = 60 * 60 * 1000

export const RANGES: RangeDef[] = [
  { key: "all" },
  { key: "48h", rangeMs: 48 * HOUR },
  { key: "24h", rangeMs: 24 * HOUR },
  { key: "12h", rangeMs: 12 * HOUR },
  { key: "6h", rangeMs: 6 * HOUR },
  { key: "3h", rangeMs: 3 * HOUR, default: true },
  { key: "1h", rangeMs: HOUR },
]

export const DEFAULT_SETTINGS: SettingsObj = {
  title: "My Dashboard",
  views: JSON.stringify(VIEWS),
}
