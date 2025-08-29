import { Trend } from "../trend"
import type { DataEntry, ViewDef } from "@/lib/types"

interface ViewHeaderProps {
  currView: ViewDef
  data: DataEntry[]
}

export const ViewHeader = ({ currView, data }: ViewHeaderProps) => {
  const latest = data.at(-1)
  const currPropKey = currView.props[0].key
  const { label = currPropKey } = currView
  const value = latest?.[currPropKey]
  const rounded = typeof value === "number" ? round(value) : ""
  return (
    <div className="flex items-start justify-between gap-2 mb-4 px-4 sm:px-0">
      <div className="uppercase text-gray-400">{label}</div>
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Trend data={data} currView={currView} /> {rounded} {currView.unit}
      </div>
    </div>
  )
}

const round = (val: number, digits = 1) =>
  Math.round(val * 10 ** digits) / 10 ** digits
