import { z } from "zod"

export const OptionSchema = z.object({
  key: z.string(),
  default: z.boolean().optional(),
})

const PropSchema = z.object({
  key: z.string(),
  color: z.string().optional(),
})

export const ViewDefSchema = OptionSchema.extend({
  props: z.array(PropSchema),
  label: z.string().optional(),
  unit: z.string(),
  trendVals: z.number().optional(),
})
