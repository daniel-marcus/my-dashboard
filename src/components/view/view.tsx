import { useSelected } from "@/lib/selected"
import { useEditMode } from "@/lib/edit-mode"
import { ViewHeader } from "./header"
import { ViewSettings } from "./settings"
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
  const [editMode] = useEditMode()
  return (
    <div className="shadow-xl rounded-2xl sm:head-px py-6 relative">
      <ViewHeader data={data} currView={view} />
      {editMode && <ViewSettings view={view} />}
      <div className="w-full h-[400px] sm:h-[290px] text-gray-400">
        <Chart data={data} currView={view} setSelected={setSelected} />
      </div>
      {selectedInfo}
    </div>
  )
}
