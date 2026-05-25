import { useSelected } from "./useSelected"
import { useEditMode } from "@/lib/useEditMode"
import { ViewHeader } from "./ViewHeader"
import { ViewSettings } from "./ViewSettings"
import { Chart } from "@/components/Chart/Chart"
import type { DeleteFunc } from "@/lib/useData"
import type { DataEntry, ViewDef } from "@/lib/types"

interface ViewProps {
  view: ViewDef
  data: DataEntry[]
  deleteEntry: DeleteFunc
}

export const View = ({ view, data, deleteEntry }: ViewProps) => {
  const [selectedInfo, setSelected] = useSelected(deleteEntry)
  const [editMode] = useEditMode()
  return (
    <div className="shadow-xl rounded-2xl sm:head-px py-6 relative">
      <ViewHeader data={data} currView={view} />
      {editMode && <ViewSettings view={view} />}
      <div className="w-full h-100 sm:h-72.5 text-gray-400">
        <Chart data={data} currView={view} setSelected={setSelected} />
      </div>
      {selectedInfo}
    </div>
  )
}
