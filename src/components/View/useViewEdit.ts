import { useSettings } from "@/lib/useSettings"
import type { ViewDef, RawViewDef } from "@/lib/types"

type ChangeFunc<T> = (old: T) => T

export function useViewEdit(view: ViewDef) {
  const [, setSettings] = useSettings()
  const updView = (change: ChangeFunc<RawViewDef>) => {
    setSettings((s) => ({
      ...s,
      views: s.views.map((v) => (v.key === view.key ? change(v) : v)),
    }))
  }
  const delProp = (key: string) => {
    const change = (v: RawViewDef) => ({
      ...v,
      props: v.props.filter((p) => p.key !== key),
    })
    updView(change)
  }
  const addKey = (key: string) => {
    const change = (v: RawViewDef) => ({
      ...v,
      props: [...v.props, { key }],
    })
    updView(change)
  }
  const changeUnit = (newVal: string) => {
    const change = (v: RawViewDef) => ({
      ...v,
      unit: newVal,
    })
    updView(change)
  }
  return { delProp, addKey, changeUnit }
}
