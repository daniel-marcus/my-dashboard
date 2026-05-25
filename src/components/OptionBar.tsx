import type { Option } from "@/lib/types"

interface OptionBarProps {
  options: Option[]
  currKey: string
  setCurrKey: (k: string) => void
  children?: React.ReactNode
}

export const OptionBar = (props: OptionBarProps) => {
  const { options, currKey, setCurrKey, children } = props
  return (
    <div className="flex items-center justify-center">
      <div
        className={`bubble flex items-center justify-center gap-2 ${
          !!children ? "pr-2!" : ""
        }`}
      >
        <div className="flex items-center justify-center gap-1">
          {options.map((o, i) => (
            <button
              key={i}
              className={`p-2 rounded-md hover:bg-gray-200/50 dark:hover:bg-gray-800/50 ${
                currKey === o.key ? "font-bold" : ""
              }`}
              onClick={() => setCurrKey(o.key)}
            >
              {o.key}
            </button>
          ))}
        </div>
        {children}
      </div>
    </div>
  )
}
