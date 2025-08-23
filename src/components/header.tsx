"use client"

import { useState } from "react"
import { useSettings } from "@/lib/settings"
import { SettingsIcon } from "./icons"
import { Settings } from "./settings"
import { useEditMode } from "@/lib/edit-mode"

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
