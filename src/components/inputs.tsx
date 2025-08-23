import type { SettingsComp } from "@/lib/types"

export const TextInput: SettingsComp<string> = ({ value, onChange }) => (
  <input
    className="input"
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
)

export const TextArea: SettingsComp<string> = ({ value, onChange }) => (
  <textarea
    className="input"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
)

export function formatJson(str: string) {
  try {
    return JSON.stringify(JSON.parse(str), undefined, 2)
  } catch {
    return str
  }
}
