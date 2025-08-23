import { useState } from "react"
import { useSettings } from "@/lib/settings"
import { TextInput } from "../inputs"
import { getColor } from "@/lib/colors"
import type { ViewDef } from "@/lib/types"

export function ViewSettings({ view }: { view: ViewDef }) {
  const [, setSettings] = useSettings()
  const onChange = (key: string, newVal: string) => {
    setSettings((s) => ({
      ...s,
      views: s.views.map((v) =>
        v.key === view.key ? { ...v, [key]: newVal } : v
      ),
    }))
  }
  return (
    <div className="mb-1 flex flex-col items-start gap-2">
      <TextInput
        value={view.unit}
        onChange={(newVal) => onChange("unit", newVal)}
      />
      <KeyEditor view={view} />
    </div>
  )
}

type ChangeFunc<T> = (old: T) => T

function KeyEditor({ view }: { view: ViewDef }) {
  const [, setSettings] = useSettings()
  const updView = (change: ChangeFunc<ViewDef>) => {
    setSettings((s) => ({
      ...s,
      views: s.views.map((v) => (v.key === view.key ? change(v) : v)),
    }))
  }
  const [newKey, setNewKey] = useState("")
  const delProp = (key: string) => {
    const change = (v: ViewDef) => ({
      ...v,
      props: v.props.filter((p) => p.key !== key),
    })
    updView(change)
  }
  const addKey = (key: string, color?: string) => {
    const change = (v: ViewDef) => ({
      ...v,
      props: [...v.props, { key, color }],
    })
    updView(change)
  }
  return (
    <div className="flex justify-start gap-2">
      {view.props.map((p, i) => (
        <button
          key={i}
          className="text-white px-2"
          style={{ backgroundColor: p.color ?? getColor(i) }}
          onClick={() => delProp(p.key)}
        >
          {p.key}
        </button>
      ))}
      <TextInput value={newKey} onChange={setNewKey} />
      <button onClick={() => addKey(newKey, getColor(view.props.length))}>
        add
      </button>
    </div>
  )
}
