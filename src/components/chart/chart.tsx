import { useLightweightChart } from "./lightweight-chart"
import { useChartData } from "./data"
import { useDayDividers } from "./day-dividers"
import { useChartSync } from "./chart-sync"
import { useClick } from "./click"
import type { DataEntry, ViewDef } from "@/lib/types"
import type { Selected } from "@/components/view/selected"

export interface ChartProps {
  data: DataEntry[]
  currView: ViewDef
  setSelected: React.Dispatch<React.SetStateAction<Selected | undefined>>
}

export const Chart = ({ data, currView, setSelected }: ChartProps) => {
  const [containerRef, chart] = useLightweightChart()
  useDayDividers(data, chart)
  useChartData(data, currView, chart, true)
  useChartSync(chart)
  useClick(chart, setSelected, currView.props[0]?.key)
  return <div className="h-full" ref={containerRef} />
}
