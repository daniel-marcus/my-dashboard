import { useSelected } from "@/lib/selected"
import { Trend } from "@/components/trend"
import { Chart } from "@/components/chart/chart"
import type { DeleteFunc } from "@/lib/data"
import type { DataEntry, ViewDef } from "@/lib/types"

interface ViewProps {
  view: ViewDef
  data: DataEntry[]
  deleteEntry: DeleteFunc
}

export const View = ({ view, data, deleteEntry }: ViewProps) => {
  const [selectedInfo, setSelected] = useSelected(deleteEntry)
  return (
    <div className="shadow-xl rounded-2xl sm:head-px py-6 relative">
      <ViewHeader data={data} currView={view} />
      <div className="w-full h-[400px] sm:h-[290px] text-gray-400">
        <Chart data={data} currView={view} setSelected={setSelected} />
      </div>
      {selectedInfo}
    </div>
  )
}

interface ViewHeaderProps {
  currView: ViewDef
  data: DataEntry[]
}

const ViewHeader = ({ currView, data }: ViewHeaderProps) => {
  const latest = data.at(-1)
  const currPropKey = currView.props[0].key
  const { label = currPropKey } = currView
  return (
    <div className="flex items-start justify-between gap-2 mb-4 px-4 sm:px-0">
      <div className="uppercase text-gray-400">{label}</div>
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Trend data={data} currView={currView} /> {latest?.[currPropKey] ?? ""}{" "}
        {currView.unit}
      </div>
    </div>
  )
}
