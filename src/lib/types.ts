import { z } from "zod"
import { OptionSchema, ViewDefSchema } from "./schema"
import type { FC } from "react"

export type Option = z.infer<typeof OptionSchema>

export type ViewDef = z.infer<typeof ViewDefSchema>

export interface RangeDef extends Option {
  rangeMs?: number
}

export interface DataEntry {
  ts: number // Unix timestamp in seconds
  [key: string]: number | null
}

export type SettingsComp<T> = FC<{
  value: T // TODO
  onChange: (newVal: T) => void
}>

export interface Setting<T = string> {
  key: string
  comp: SettingsComp<T>
}

export interface SettingsObj {
  title: string
  views: ViewDef[]
}
