import { useLightweightChart } from "./useLightweightChart"
import { useChartData } from "./useChartData"
import { useDayDividers } from "./useDayDividers"
import { useChartSync } from "./useChartSync"
import { useClick } from "./useClick"
import type { DataEntry, ViewDef } from "@/lib/types"
import type { Selected } from "@/components/View/useSelected"

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
