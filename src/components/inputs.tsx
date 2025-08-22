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
    value={JSON.stringify(JSON.parse(value), undefined, 2)}
    onChange={(e) => onChange(e.target.value)}
  />
)
