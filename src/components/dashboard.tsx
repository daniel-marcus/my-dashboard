"use client"

import { useData } from "@/lib/data"
import { useOptions } from "@/lib/options"
import { useSharedRange } from "@/components/chart/chart-sync"
import { useViewSettings, type SettingsProps } from "./settings"
import { Header } from "./header"
import { View } from "./view"
import { RefreshIcon } from "./icons"
import { RANGES } from "@/lib/constants"

type DashboardProps = SettingsProps

export function Dashboard(props: DashboardProps) {
  const [data, updateData, deleteEntry, isLoading] = useData()
  const [currRange, RangesBar] = useOptions(RANGES)
  useSharedRange(data, currRange)
  const views = useViewSettings(props.settings)
  return (
    <main className="pb-16 mx-auto sm:max-w-[1100px]">
      <Header {...props} />
      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
        {views.map((view, i) => (
          <View key={i} view={view} data={data} deleteEntry={deleteEntry} />
        ))}
      </div>
      <div className="fixed bottom-4 left-0 z-10 w-full">
        <RangesBar>
          <RefreshBtn onClick={updateData} isLoading={isLoading} />
        </RangesBar>
      </div>
    </main>
  )
}

type RefresbBtnProps = { onClick: () => void; isLoading: boolean }
const RefreshBtn = ({ isLoading, ...rest }: RefresbBtnProps) => (
  <button className={`btn-round ${isLoading ? "animate-spin" : ""}`} {...rest}>
    <RefreshIcon />
  </button>
)
