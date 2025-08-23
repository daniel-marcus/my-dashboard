import { useEffect } from "react"
import type { MouseEventHandler, Time } from "lightweight-charts"
import type { ChartApi } from "./types"
import type { ChartProps } from "./chart"

export function useClick(
  chart: ChartApi,
  setSelected: ChartProps["setSelected"],
  key: string | undefined
) {
  useEffect(() => {
    if (!chart) return
    const handler: MouseEventHandler<Time> = (params) => {
      const [series, data] = params.seriesData.entries().next().value!
      const ts = data.customValues?.ts as number | undefined
      if (!ts || !key) return
      const newSelected = { ts, key }
      setSelected((s) => {
        if (s?.ts === ts) {
          chart.clearCrosshairPosition()
          return undefined
        } else {
          if (params.time) chart.setCrosshairPosition(0, params.time, series)
          return newSelected
        }
      })
    }
    chart.subscribeClick(handler)
    return () => {
      chart.unsubscribeClick(handler)
    }
  }, [chart, setSelected, key])
}
