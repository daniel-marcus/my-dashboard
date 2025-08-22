import { useState } from "react"
import { TextArea, TextInput } from "./inputs"
import type { Setting, SettingsObj } from "@/lib/types"
import { SaveIcon, XIcon } from "./icons"

const ALL_SETTINGS: Setting[] = [
  { key: "title", comp: TextInput },
  { key: "views", comp: TextArea },
]

export interface SettingsProps {
  settings: SettingsObj
  setSettings: React.Dispatch<React.SetStateAction<SettingsObj>>
}

export const Settings = ({ settings, setSettings }: SettingsProps) => {
  const [settingsLoc, setSettingsLoc] = useState(settings)
  const hasChanged = settingsLoc !== settings
  return (
    <div className="flex flex-col gap-2">
      {ALL_SETTINGS.map((s) => {
        const key = s.key as keyof SettingsObj
        const Comp = s.comp
        return (
          <Comp
            key={s.key}
            value={settingsLoc[key]}
            onChange={(newV) => setSettingsLoc((s) => ({ ...s, [key]: newV }))}
          />
        )
      })}
      <div className="flex items-center justify-end gap-2 py-2">
        <button
          className="btn-round"
          onClick={() => setSettingsLoc(settings)}
          disabled={!hasChanged}
        >
          <XIcon />
        </button>
        <button
          className="btn-round"
          onClick={() => setSettings(settingsLoc)}
          disabled={!hasChanged}
        >
          <SaveIcon />
        </button>
      </div>
    </div>
  )
}
