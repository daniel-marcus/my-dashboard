import type { IChartApi, UTCTimestamp } from "lightweight-charts"

export type ChartApi = IChartApi | null

export type ChartData = {
  id: string
  color: string
  data: {
    time: UTCTimestamp
    value: number
  }[]
}[]
