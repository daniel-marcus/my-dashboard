"use client"

import { useState } from "react"
import { SettingsIcon } from "./icons"
import { Settings, type SettingsProps } from "./settings"

type HeaderProps = SettingsProps

export const Header = (props: HeaderProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const toggleSettings = () => setSettingsOpen((o) => !o)
  return (
    <div className="pt-8 pb-6 head-px flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <h1 className="text-4xl font-light">{props.settings.title}</h1>
        <div>
          <button className="btn-round" onClick={toggleSettings}>
            <SettingsIcon />
          </button>
        </div>
      </div>
      {settingsOpen && <Settings {...props} />}
    </div>
  )
}
