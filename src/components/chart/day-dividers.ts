import { useEffect } from "react"
import { LineSeries, type UTCTimestamp } from "lightweight-charts"
import { VertLine } from "./vertical-line"
import { timeToLocal } from "./timezones"
import type { ChartData, ChartApi } from "./types"

export function useDayDividers(data: ChartData, chart: ChartApi) {
  useEffect(() => {
    if (!chart) return
    const series = data[0]
    const xMin = series.data[0]?.time
    const xMax = series.data.at(-1)?.time
    if (!xMin || !xMax) return
    const xMinDate = new Date(xMin * 1000).setHours(0, 0, 0, 0)
    const xMaxDate = new Date(xMax * 1000)

    const dividerSeries = chart.addSeries(LineSeries)

    const whitespaceData: { time: UTCTimestamp }[] = []

    for (
      let d = new Date(xMinDate);
      d <= xMaxDate;
      d.setDate(d.getDate() + 1)
    ) {
      const time = timeToLocal(d.getTime())
      whitespaceData.push({ time })
    }

    dividerSeries.setData(whitespaceData)

    whitespaceData.forEach(({ time }) => {
      const divider = new VertLine(chart, dividerSeries, time, {
        showLabel: false,
        width: 1,
      })
      dividerSeries.attachPrimitive(divider)
    })

    return () => {
      chart.removeSeries(dividerSeries)
    }
  }, [data, chart])
}
