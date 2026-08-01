import { useSelected } from "./useSelected"
import { useVisibleView } from "./useVisibleView"
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
  const [visibleView, toggleKey] = useVisibleView(view)
  const [editMode] = useEditMode()
  return (
    <div className="shadow-xl rounded-2xl sm:head-px py-6 relative">
      <ViewHeader data={data} view={visibleView} toggleKey={toggleKey} />
      {editMode && <ViewSettings view={view} />}
      <div className="w-full h-100 sm:h-72.5 text-gray-400">
        <Chart data={data} view={visibleView} setSelected={setSelected} />
      </div>
      {selectedInfo}
    </div>
  )
}
