import { Trend } from "@/components/Trend"
import type { DataEntry, ViewDef } from "@/lib/types"

interface ViewHeaderProps {
  view: ViewDef
  data: DataEntry[]
  toggleKey: (key: string) => void
}

export const ViewHeader = ({ view, data, toggleKey }: ViewHeaderProps) => {
  const latest = data.at(-1)
  const currPropKey = view.props[0].key
  const value = latest?.[currPropKey]
  const rounded = typeof value === "number" ? round(value) : ""
  return (
    <div className="flex items-start justify-between gap-2 mb-4 px-4 sm:px-0">
      <div className="flex flex-col text-gray-400">
        {view.props.map((p) => (
          <button
            key={p.key}
            className={`flex items-center gap-2 uppercase ${p.hidden ? "opacity-50" : ""}`}
            onClick={() => toggleKey(p.key)}
          >
            <div className="rounded-full size-2" style={{ backgroundColor: p.color }} />
            <div>{p.key}</div>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Trend data={data} view={view} /> {rounded} {view.unit}
      </div>
    </div>
  )
}

const round = (val: number, digits = 1) => Math.round(val * 10 ** digits) / 10 ** digits
