import { useEffect, useMemo, useRef } from "react"
import { ISeriesApi, LineSeries } from "lightweight-charts"
import { timeToLocal } from "./timezones"
import { chartSync } from "./chart-sync"
import { getColor } from "@/lib/colors"
import type { DataEntry, ViewDef } from "@/lib/types"
import type { ChartApi } from "./types"

export function useChartData(
  data: DataEntry[],
  currView: ViewDef,
  chart: ChartApi,
  active: boolean
) {
  const chartData = useMemo(
    () =>
      currView.props.map((p, i) => ({
        id: p.key,
        color: p.color ?? getColor(i),
        data: data
          .filter((d) => typeof d[p.key] === "number")
          .map((d) => ({
            time: timeToLocal(d.ts),
            value: d[p.key]!,
            customValues: { ts: d.ts }, // keep original timestamp for click/select logic
          })),
      })),
    [data, currView]
  )

  const seriesMapRef = useRef<Map<string, ISeriesApi<"Line">>>(new Map())
  useEffect(() => {
    if (!chart || !active) return
    const seriesMap = seriesMapRef.current
    chartData.forEach(({ id, color, data }) => {
      let series = seriesMap.get(id)
      if (!series) {
        series = chart!.addSeries(LineSeries, { color })
        seriesMap.set(id, series)
        chartSync.registerSeries(chart!, series)
      }
      series.setData(data)
    })
    return () => {
      seriesMap
        .entries()
        .filter(([key]) => !chartData.find(({ id }) => id === key))
        .forEach(([key, series]) => {
          chart.removeSeries(series)
          seriesMap.delete(key)
          chartSync.unregisterSeries(chart, series)
        })
    }
  }, [chart, chartData, active])

  return chartData
}
