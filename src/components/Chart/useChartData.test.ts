import { renderHook } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { useChartData } from "./useChartData"
import type { DataEntry, ViewDef } from "@/lib/types"
import type { ChartApi } from "./types"

const data: DataEntry[] = [{ ts: 0, temp: 1, temp_ext: 2 }]

const view: ViewDef = {
  key: "temp",
  unit: "°C",
  props: [
    { key: "temp", color: "hsl(342, 70%, 50%)" },
    { key: "temp_ext", color: "hsl(162, 70%, 50%)", hidden: true },
  ],
}

const makeFakeChart = () => {
  const removeSeries = vi.fn()
  const addSeries = vi.fn(() => ({ applyOptions: vi.fn(), setData: vi.fn() }))
  const chart = { addSeries, removeSeries } as unknown as ChartApi
  return { chart, addSeries, removeSeries }
}

describe("useChartData", () => {
  it("keeps every prop's series, marking hidden ones not visible", () => {
    const { result } = renderHook(() => useChartData(data, view, null, false))
    expect(result.current.map((d) => d.id)).toEqual(["temp", "temp_ext"])
    expect(result.current.find((d) => d.id === "temp")?.visible).toBe(true)
    expect(result.current.find((d) => d.id === "temp_ext")?.visible).toBe(false)
  })

  it("removes the series for a prop that's no longer in the view", () => {
    const { chart, addSeries, removeSeries } = makeFakeChart()
    const { rerender } = renderHook(({ view }) => useChartData(data, view, chart, true), {
      initialProps: { view },
    })
    expect(addSeries).toHaveBeenCalledTimes(2)

    const shrunkView: ViewDef = { ...view, props: [view.props[0]] }
    rerender({ view: shrunkView })

    expect(removeSeries).toHaveBeenCalledTimes(1)
  })

  it("keeps times strictly ascending across the autumn DST switch", () => {
    process.env.TZ = "Europe/Berlin"
    // 2026-10-25 00:58–01:01 UTC: local 02:58 CEST, 02:59 CEST, 02:00 CET, 02:01 CET
    const dstData: DataEntry[] = [1792889880, 1792889940, 1792890000, 1792890060].map((ts) => ({
      ts,
      temp: 20,
    }))
    const { result } = renderHook(() => useChartData(dstData, view, null, false))
    const times = result.current[0].data.map((d) => d.time)
    expect(times).toEqual([1792889880, 1792889940, 1792890000, 1792890060])
  })
})
