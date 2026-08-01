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
const DAY = 24 * HOUR
const MONTH = 30 * DAY

export const RANGES: RangeDef[] = [
  { key: "year", rangeMs: 12 * MONTH, resolution: "day" },
  { key: "month", rangeMs: MONTH, resolution: "hour" },
  { key: "week", rangeMs: 7 * DAY, resolution: "minute" },
  { key: "day", rangeMs: DAY, default: true, resolution: "minute" },
  { key: "hour", rangeMs: HOUR, resolution: "minute" },
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
