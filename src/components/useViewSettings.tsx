import { useMemo } from "react"
import { toast } from "sonner"
import { z, ZodError } from "zod"
import { useSettings } from "@/lib/useSettings"
import { ViewDefSchema } from "@/lib/schema"
import type { ViewDef } from "@/lib/types"

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
        toast.error("Validation error: Please check JavaScript console for details")
      } else if (err instanceof Error) toast.error(err.message)
      return [] as ViewDef[]
    }
  }, [settings.views])
  return views
}
