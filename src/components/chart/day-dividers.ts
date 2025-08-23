import { useEffect, useMemo } from "react"
import { LineSeries, type UTCTimestamp } from "lightweight-charts"
import { VertLine } from "./vertical-line"
import { timeToLocal } from "./timezones"
import type { DataEntry } from "@/lib/types"
import type { ChartApi } from "./types"

export function useDayDividers(data: DataEntry[], chart: ChartApi) {
  const dividerSeries = useMemo(() => chart?.addSeries(LineSeries), [chart])
  useEffect(() => {
    if (!chart || !dividerSeries || !data.length) return

    const xMin = data.at(0)!.ts
    const xMax = data.at(-1)!.ts
    const xMinDate = new Date(xMin).setHours(0, 0, 0, 0)
    const xMaxDate = new Date(xMax)

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
  }, [data, chart, dividerSeries])
}
