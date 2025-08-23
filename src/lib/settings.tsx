import { createContext, useContext } from "react"
import { useLocalStorage } from "./local-storage"
import { DEFAULT_SETTINGS } from "./constants"
import type { SettingsObj } from "./types"

export const SettingsContext = createContext<
  [SettingsObj, React.Dispatch<React.SetStateAction<SettingsObj>>]
>([DEFAULT_SETTINGS, () => {}])

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useLocalStorage<SettingsObj>(DEFAULT_SETTINGS)
  return (
    <SettingsContext.Provider value={[settings, setSettings]}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
