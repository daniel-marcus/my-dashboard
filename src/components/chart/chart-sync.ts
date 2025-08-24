import { useEffect } from "react"
import { timeToLocal } from "./timezones"
import type { IChartApi, IRange, ISeriesApi } from "lightweight-charts"
import type { TimeRangeChangeEventHandler, Time } from "lightweight-charts"
import type { MouseEventHandler, UTCTimestamp } from "lightweight-charts"
import type { ChartApi } from "./types"
import type { DataEntry, RangeDef } from "@/lib/types"

class ChartSyncer {
  private _charts: IChartApi[] = []
  private _serieses: Map<IChartApi, Set<ISeriesApi<"Line">>> = new Map()
  private _updatingCharts = new Set<IChartApi>() // mark programmatically updated charts to avoid feedback loops
  private _updTimeout?: NodeJS.Timeout
  registerChart(chart: IChartApi) {
    this._charts = [...this._charts, chart]
  }
  unregisterChart(chart: IChartApi) {
    this._charts = this._charts.filter((c) => c !== chart)
    this._serieses.delete(chart)
  }
  registerSeries(chart: IChartApi, series: ISeriesApi<"Line">) {
    const seriesSet = this._serieses.get(chart) ?? new Set<ISeriesApi<"Line">>()
    seriesSet.add(series)
    this._serieses.set(chart, seriesSet)
  }
  unregisterSeries(chart: IChartApi, series: ISeriesApi<"Line">) {
    this._serieses.get(chart)?.delete(series)
  }
  updateRange(newRange: IRange<Time>, sender?: IChartApi) {
    if (sender && this.isUpdating(sender)) return // ignore feedback events from programmatically updated charts
    clearTimeout(this._updTimeout)
    this._charts.forEach((chart) => {
      if (chart === sender) return
      this._updatingCharts.add(chart) // mark chart as being programmatically updated
      try {
        chart.timeScale().setVisibleRange(newRange)
      } catch {}
    })
    this._updTimeout = setTimeout(() => this._updatingCharts.clear(), 50)
  }
  isUpdating(chart: IChartApi) {
    return this._updatingCharts.has(chart)
  }
  updateCursor(time: Time | undefined, sender: IChartApi) {
    this._charts.forEach((chart) => {
      if (chart === sender) return
      if (!time) chart.clearCrosshairPosition()
      else {
        const series = this._serieses.get(chart)?.values().next().value
        if (!series) return
        try {
          chart.setCrosshairPosition(0, time, series)
        } catch {}
      }
    })
  }
}

export const chartSync = new ChartSyncer()

export function useChartSync(chart: ChartApi) {
  useEffect(() => {
    if (!chart) return

    const rangeHandler: TimeRangeChangeEventHandler<Time> = (newRange) => {
      if (newRange) chartSync.updateRange(newRange, chart)
      return newRange
    }
    const cursorHandler: MouseEventHandler<Time> = (params) => {
      chartSync.updateCursor(params.time, chart)
      return params
    }

    chartSync.registerChart(chart)
    chart.timeScale().subscribeVisibleTimeRangeChange(rangeHandler)
    chart.subscribeCrosshairMove(cursorHandler)

    return () => {
      chartSync.unregisterChart(chart)
      chart.timeScale().unsubscribeVisibleTimeRangeChange(rangeHandler)
      chart.unsubscribeCrosshairMove(cursorHandler)
    }
  }, [chart])
}

export function useSharedRange(data: DataEntry[], currRange: RangeDef) {
  useEffect(() => {
    if (!data.length) return
    const latest = data.at(-1)!
    const to = timeToLocal(latest.ts)
    const from = (
      typeof currRange.rangeMs === "number" ? to - currRange.rangeMs / 1000 : 0
    ) as UTCTimestamp
    chartSync.updateRange({ from, to })
  }, [data, currRange])
}
