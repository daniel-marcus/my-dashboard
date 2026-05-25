"use client"

import { useSettings } from "@/lib/useSettings"
import { SettingsIcon } from "./Icons"
import { Settings } from "./Settings"
import { useEditMode } from "@/lib/useEditMode"

export const Header = () => {
  const [{ title }] = useSettings()
  const [editMode, setEditMode] = useEditMode()
  const toggleEditMode = () => setEditMode((o) => !o)
  return (
    <div className="pt-8 pb-6 head-px flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <h1 className="text-4xl font-light">{title}</h1>
        <div>
          <button className="btn-round" onClick={toggleEditMode}>
            <SettingsIcon />
          </button>
        </div>
      </div>
      {editMode && <Settings />}
    </div>
  )
}
