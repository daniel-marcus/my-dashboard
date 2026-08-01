import { z } from "zod"
import { getColor } from "./colors"

export const OptionSchema = z.object({
  key: z.string(),
  default: z.boolean().optional(),
})

const PropSchema = z.object({
  key: z.string(),
  color: z.string().optional(),
  hidden: z.boolean().optional(),
})

export const ViewDefSchema = OptionSchema.extend({
  props: z.array(PropSchema),
  label: z.string().optional(),
  unit: z.string(),
}).transform((view) => ({
  ...view,
  props: view.props.map((p, i) => ({ ...p, color: p.color ?? getColor(i) })),
}))
