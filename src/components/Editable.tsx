import { useEditMode } from "@/lib/useEditMode"

interface EditableProps {
  children: string
  onChange: (newVal: string) => void
}

export const Editable = ({ children: value, onChange }: EditableProps) => {
  const [active] = useEditMode()
  if (!active) return value
  return (
    <span
      className="-mx-1 -my-0.5 px-1 py-0.5 rounded-md bg-amber-200/40 cursor-text hover:bg-gray-50 focus:bg-gray-50 dark:hover:bg-gray-900 dark:focus:bg-gray-900"
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.textContent ?? "")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === "Escape") {
          e.preventDefault()
          e.currentTarget.blur()
        }
      }}
    >
      {value}
    </span>
  )
}
