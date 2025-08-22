import type { FC } from "react"

interface MarkerDef {
  axis: "x" | "y"
  value: number
}

type Prop = {
  key: string
  color?: string
}

export interface Option {
  key: string
  default?: boolean
}

export interface ViewDef extends Option {
  props: Prop[]
  label?: string
  unit: string
  filter?: (data: DataEntry) => boolean
  markers?: MarkerDef[]
  trendVals?: number
}

export interface RangeDef extends Option {
  rangeMs?: number
}

export interface DataEntry {
  ts: number
  [key: string]: number | null
}

export interface Series {
  id: string
  color: string
  data: {
    x: string
    y: number
    ts: number
  }[]
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
  views: string
}
