import { useLightweightChart } from "./lightweight-chart"
import { useChartData } from "./data"
import { useDayDividers } from "./day-dividers"
import { useChartSync } from "./chart-sync"
import type { DataEntry, ViewDef } from "@/lib/types"
import type { Selected } from "@/lib/selected"

export interface ChartProps {
  data: DataEntry[]
  currView: ViewDef
  setSelected: React.Dispatch<React.SetStateAction<Selected | undefined>>
}

export const Chart = ({ data, currView }: ChartProps) => {
  const [containerRef, chart] = useLightweightChart()
  const ready = useDayDividers(data, chart)
  useChartData(data, currView, chart, true)
  useChartSync(chart)
  return <div className="h-full" ref={containerRef} />
}
