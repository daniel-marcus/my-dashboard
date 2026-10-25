import { describe, it, expect, beforeAll } from "vitest"
import { TickMarkType, type UTCTimestamp } from "lightweight-charts"
import { tickMarkFormatter, timeFormatter } from "./timezones"

// 2026-10-25 00:59 UTC = 02:59 CEST, 01:00 UTC = 02:00 CET
const beforeSwitch = 1792889940 as UTCTimestamp
const afterSwitch = 1792890000 as UTCTimestamp

describe("timezones", () => {
  beforeAll(() => {
    process.env.TZ = "Europe/Berlin"
  })

  it("formats tick marks in local time on both sides of the DST switch", () => {
    expect(tickMarkFormatter(beforeSwitch, TickMarkType.Time, "de-DE")).toBe("02:59")
    expect(tickMarkFormatter(afterSwitch, TickMarkType.Time, "de-DE")).toBe("02:00")
  })

  it("formats date tick marks in local time", () => {
    // 2026-10-24 23:00 UTC is already Oct 25 locally
    const t = 1792882800 as UTCTimestamp
    expect(tickMarkFormatter(t, TickMarkType.DayOfMonth, "de-DE")).toBe("25")
    expect(tickMarkFormatter(t, TickMarkType.Month, "en-US")).toBe("Oct")
    expect(tickMarkFormatter(t, TickMarkType.Year, "en-US")).toBe("2026")
  })

  it("includes the local time in the crosshair label", () => {
    expect(timeFormatter(afterSwitch)).toMatch(/02:00/)
  })
})
