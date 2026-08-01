"use client"

import { useSettings } from "@/lib/useSettings"
import { SettingsIcon } from "./Icons"
import { Editable } from "./Editable"
import { useEditMode } from "@/lib/useEditMode"
import { DEFAULT_SETTINGS } from "@/lib/constants"

export const Header = () => {
  const [{ title }, setSettings] = useSettings()
  const [editMode, setEditMode] = useEditMode()
  const toggleEditMode = () => setEditMode((o) => !o)
  return (
    <div className="pt-8 pb-6 head-px flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <h1 className="text-4xl font-light">
          <Editable onChange={(newTitle) => setSettings((s) => ({ ...s, title: newTitle }))}>
            {title}
          </Editable>
        </h1>
        <div className="flex gap-4">
          {editMode && <button onClick={() => setSettings(DEFAULT_SETTINGS)}>Reset</button>}
          <button className="btn-round" onClick={toggleEditMode}>
            <SettingsIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
