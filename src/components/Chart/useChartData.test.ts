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
})
