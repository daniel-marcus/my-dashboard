import { getColor } from "./colors"
import type { RawViewDef, RangeDef, SettingsObj, ResolutionDef } from "./types"

export const VIEWS: RawViewDef[] = [
  {
    props: [{ key: "co2" }],
    unit: "ppm",
  },
  {
    props: [{ key: "temp" }, { key: "temp_ext" }],
    unit: "°C",
  },
  {
    props: [{ key: "hum" }, { key: "hum_ext" }],
    unit: "%",
  },
  {
    props: [{ key: "press", color: getColor(1) }],
    unit: "hPa",
  },
]

const HOUR = 60 * 60

export const RANGES: RangeDef[] = [
  { key: "all" },
  { key: "48h", rangeMs: 48 * HOUR },
  { key: "24h", rangeMs: 24 * HOUR },
  { key: "12h", rangeMs: 12 * HOUR },
  { key: "6h", rangeMs: 6 * HOUR },
  { key: "3h", rangeMs: 3 * HOUR, default: true },
  { key: "1h", rangeMs: HOUR },
]

export const RESOLUTIONS: ResolutionDef[] = [
  { key: "day" },
  { key: "hour" },
  { key: "minute", default: true },
]

export const DEFAULT_SETTINGS: SettingsObj = {
  title: "My Dashboard",
  views: VIEWS,
}
