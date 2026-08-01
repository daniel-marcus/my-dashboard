import { useEffect, useMemo, useRef } from "react"
import { ISeriesApi, LineSeries } from "lightweight-charts"
import { timeToLocal } from "./timezones"
import { chartSync } from "./useChartSync"
import type { DataEntry, ViewDef } from "@/lib/types"
import type { ChartApi } from "./types"

export function useChartData(data: DataEntry[], view: ViewDef, chart: ChartApi, active: boolean) {
  const chartData = useMemo(
    () =>
      view.props.map((p) => ({
        id: p.key,
        color: p.color,
        visible: !p.hidden,
        data: data
          .filter((d) => typeof d[p.key] === "number")
          .map((d) => ({
            time: timeToLocal(d.ts),
            value: d[p.key]!,
            customValues: { ts: d.ts }, // keep original timestamp for click/select logic
          })),
      })),
    [data, view],
  )

  const seriesMapRef = useRef<Map<string, ISeriesApi<"Line">>>(new Map())
  useEffect(() => {
    if (!chart || !active) return
    const seriesMap = seriesMapRef.current
    seriesMap.forEach((series, id) => {
      if (chartData.find((d) => d.id === id)) return
      chart.removeSeries(series)
      seriesMap.delete(id)
      chartSync.unregisterSeries(chart, series)
    })
    chartData.forEach(({ id, color, visible, data }) => {
      let series = seriesMap.get(id)
      if (!series) {
        series = chart.addSeries(LineSeries, { color })
        seriesMap.set(id, series)
        chartSync.registerSeries(chart, series)
      }
      series.applyOptions({ visible })
      series.setData(data)
    })
  }, [chart, chartData, active])

  return chartData
}
