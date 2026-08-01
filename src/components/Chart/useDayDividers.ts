import { useEffect, useMemo, useRef } from "react"
import { LineSeries, type Time, type UTCTimestamp } from "lightweight-charts"
import { VertLine } from "./VertLine"
import { timeToLocal } from "./timezones"
import type { DataEntry } from "@/lib/types"
import type { ChartApi } from "./types"

// switch from day to month dividers once more than this many days are visible at once
const MONTH_DIVIDER_THRESHOLD_DAYS = 60

export function useDayDividers(data: DataEntry[], chart: ChartApi) {
  const dividerSeries = useMemo(() => chart?.addSeries(LineSeries), [chart])
  const dividers = useRef<{ divider: VertLine; isMonthStart: boolean }[]>([])

  useEffect(() => {
    if (!chart || !dividerSeries || !data.length) return

    const xMin = data.at(0)!.ts
    const xMax = data.at(-1)!.ts
    const xMinDate = new Date(xMin * 1000).setHours(0, 0, 0, 0)
    const xMaxDate = new Date(xMax * 1000)

    const whitespaceData: { time: UTCTimestamp; isMonthStart: boolean }[] = []
    for (let d = new Date(xMinDate); d <= xMaxDate; d.setDate(d.getDate() + 1)) {
      const time = timeToLocal(d.getTime() / 1000)
      whitespaceData.push({ time, isMonthStart: d.getDate() === 1 })
    }
    dividerSeries.setData(whitespaceData.map(({ time }) => ({ time })))

    dividers.current.forEach(({ divider }) => dividerSeries.detachPrimitive(divider))
    dividers.current = whitespaceData.map(({ time, isMonthStart }) => ({
      divider: new VertLine(chart, dividerSeries, time, { showLabel: false, width: 1 }),
      isMonthStart,
    }))

    let showMonthsOnly: boolean | undefined
    const applyForVisibleRange = (range: { from: Time; to: Time } | null) => {
      if (!range) return
      const visibleDays = (Number(range.to) - Number(range.from)) / 86400
      const shouldShowMonthsOnly = visibleDays > MONTH_DIVIDER_THRESHOLD_DAYS
      if (shouldShowMonthsOnly === showMonthsOnly) return
      showMonthsOnly = shouldShowMonthsOnly

      dividers.current.forEach(({ divider, isMonthStart }) => {
        if (isMonthStart || !shouldShowMonthsOnly) dividerSeries.attachPrimitive(divider)
        else dividerSeries.detachPrimitive(divider)
      })
    }

    applyForVisibleRange(chart.timeScale().getVisibleRange())
    chart.timeScale().subscribeVisibleTimeRangeChange(applyForVisibleRange)

    return () => {
      chart.timeScale().unsubscribeVisibleTimeRangeChange(applyForVisibleRange)
    }
  }, [data, chart, dividerSeries])
}
