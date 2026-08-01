import { useRef } from "react"
import { useViewEdit } from "./useViewEdit"
import { useEditMode } from "@/lib/useEditMode"
import { Trend } from "@/components/Trend"
import { Editable } from "../Editable"
import type { DataEntry, ViewDef } from "@/lib/types"

interface ViewHeaderProps {
  view: ViewDef
  data: DataEntry[]
  toggleKey: (key: string) => void
}

// TODO: this component needs refactoring

export const ViewHeader = ({ view, data, toggleKey }: ViewHeaderProps) => {
  const [editMode] = useEditMode()
  const latest = data.at(-1)
  const currPropKey = view.props[0]?.key
  const value = latest?.[currPropKey]
  const rounded = typeof value === "number" ? round(value) : ""
  const editHandlers = useViewEdit(view)
  const allDataKeys = Object.keys(data[0] ?? {}).filter((k) => k !== "ts")
  const usedKeys = new Set(view.props.map((p) => p.key))
  const unusedKeys = [...allDataKeys].filter((k) => !usedKeys.has(k)).sort()
  return (
    <div className="flex items-start justify-between gap-2 mb-4 px-4 sm:px-0">
      <div>
        {view.props.map((p) => (
          <div key={p.key} className="flex gap-8 w-full justify-between">
            <button
              className={`flex items-center gap-2 text-gray-400 uppercase ${p.hidden ? "opacity-50" : ""}`}
              onClick={() => toggleKey(p.key)}
            >
              <div className="rounded-full size-2" style={{ backgroundColor: p.color }} />
              <div>{p.key}</div>
            </button>
            {editMode && (
              <button className="text-gray-400" onClick={() => editHandlers.delProp(p.key)}>
                x
              </button>
            )}
          </div>
        ))}
        {editMode && <NewKeySelect unusedKeys={unusedKeys} onAdd={editHandlers.addKey} />}
      </div>
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Trend data={data} view={view} /> {rounded}{" "}
        <Editable onChange={editHandlers.changeUnit}>{view.unit}</Editable>
      </div>
    </div>
  )
}

const NewKeySelect = ({
  unusedKeys,
  onAdd,
}: {
  unusedKeys: string[]
  onAdd: (key: string) => void
}) => {
  const ref = useRef<HTMLSelectElement>(null)
  return (
    <div className="flex gap-8 w-full justify-between">
      <div className="flex items-center gap-2 text-gray-400 uppercase">
        <div>?</div>
        <select
          ref={ref}
          key={unusedKeys.join(",")}
          className="bg-transparent uppercase"
          defaultValue={unusedKeys[0]}
          disabled={unusedKeys.length === 0}
        >
          {unusedKeys.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>
      <button
        className="text-gray-400"
        disabled={unusedKeys.length === 0}
        onClick={() => {
          const key = ref.current?.value
          if (key) onAdd(key)
        }}
      >
        +
      </button>
    </div>
  )
}

const round = (val: number, digits = 1) => Math.round(val * 10 ** digits) / 10 ** digits
