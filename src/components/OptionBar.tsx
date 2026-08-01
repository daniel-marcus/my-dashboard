import type { Option } from "@/lib/types"

interface OptionBarProps {
  options: Option[]
  currKey: string
  setCurrKey: (k: string) => void
}

export const OptionBar = (props: OptionBarProps) => {
  const { options, currKey, setCurrKey } = props
  return (
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
  )
}

export const OptionBarWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center">
    <div className="bubble flex items-center justify-center gap-2 pr-2!">{children}</div>
  </div>
)
