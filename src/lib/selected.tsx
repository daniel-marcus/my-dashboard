import { useState } from "react"
import { TrashIcon, XIcon } from "@/components/icons"
import type { DataEntry } from "./types"
import type { DeleteFunc } from "./data"

export type Selected = { ts: DataEntry["ts"]; key: keyof DataEntry }

export function useSelected(deleteEntry: DeleteFunc) {
  const [selected, setSelected] = useState<Selected | undefined>()
  const handleDelete = async () => {
    const success = await deleteEntry(selected!)
    if (success) setSelected(undefined)
  }
  const comp = !!selected && (
    <div className="flex items-center justify-center gap-2 absolute top-2 right-2 z-2 bubble pr-2!">
      Selected: <strong>{new Date(selected.ts).toLocaleString()}</strong>
      <button className="btn-round" onClick={() => setSelected(undefined)}>
        <XIcon />
      </button>
      <button className="btn-round" onClick={handleDelete}>
        <TrashIcon />
      </button>
    </div>
  )
  return [comp, setSelected] as const
}
