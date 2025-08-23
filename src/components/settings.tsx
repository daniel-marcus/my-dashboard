import { useMemo } from "react"
import { toast } from "sonner"
import { z, ZodError } from "zod"
import { useSettings } from "@/lib/settings"
import { TextInput } from "./inputs"
import { ViewDefSchema } from "@/lib/schema"
import type { Setting, SettingsObj, ViewDef } from "@/lib/types"

const ALL_SETTINGS: Setting[] = [{ key: "title", comp: TextInput }]

export const Settings = () => {
  const [settings, setSettings] = useSettings()
  return (
    <div className="flex flex-col gap-2">
      {ALL_SETTINGS.map((s) => {
        const key = s.key as keyof SettingsObj
        const Comp = s.comp
        const value = settings[key]
        return (
          <Comp
            key={s.key}
            value={typeof value === "string" ? value : JSON.stringify(value)}
            onChange={(newV) => setSettings((s) => ({ ...s, [key]: newV }))}
          />
        )
      })}
    </div>
  )
}

export function useViewSettings() {
  // TODO: validate schema before saving
  const [settings] = useSettings()
  const views = useMemo(() => {
    try {
      const parsedViews = z.array(ViewDefSchema).parse(settings.views)
      return parsedViews
    } catch (err) {
      console.error(err)
      if (err instanceof ZodError) {
        toast.error(
          "Validation error: Please check JavaScript console for details"
        )
      } else if (err instanceof Error) toast.error(err.message)
      return [] as ViewDef[]
    }
  }, [settings.views])
  return views
}
