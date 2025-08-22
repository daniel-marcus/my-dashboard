import { useMemo, useState } from "react"
import { OptionBar } from "@/components/option-bar"
import type { Option } from "./types"

export function useOptions<T extends Option>(options: T[]) {
  const defaultOption = useMemo(
    () => options.find((o) => o.default) ?? options[0],
    [options]
  )
  const [currKey, setCurrKey] = useState(defaultOption.key)
  const currOption = useMemo(
    () => options.find((o) => o.key === currKey) ?? defaultOption,
    [options, defaultOption, currKey]
  )
  const Comp: React.FC<{ children?: React.ReactNode }> = (props) => (
    <OptionBar
      options={options}
      currKey={currKey}
      setCurrKey={setCurrKey}
      {...props}
    />
  )
  return [currOption, Comp] as const
}
