"use client"

import { useMemo } from "react"
import { TrendDownIcon, TrendStableIcon, TrendUpIcon } from "@/components/Icons"
import type { DataEntry, ViewDef } from "@/lib/types"

const TREND_VALS = 10
const TREND_THRESHOLD = 0.01

interface TrendProps {
  data: DataEntry[]
  view: ViewDef
}

export const Trend = ({ data, view }: TrendProps) => {
  const trend = useMemo(() => {
    const firstPropKey = view.props[0]?.key
    if (!firstPropKey) return 0
    const latestVals = data
      .filter((d) => typeof d[firstPropKey] === "number")
      .slice(-TREND_VALS) // use last x values for trend
      .map((d, i) => ({ x: i, y: d[firstPropKey]! }))
    return linearRegression(latestVals)
  }, [data, view])
  const Icon =
    Math.abs(trend) < TREND_THRESHOLD ? TrendStableIcon : trend > 0 ? TrendUpIcon : TrendDownIcon
  return <Icon />
}

type XYData = { x: number; y: number }

function linearRegression(data: XYData[]): number {
  const [xSum, ySum] = data.reduce((acc, { x, y }) => [acc[0] + x, acc[1] + y], [0, 0])
  const xMean = xSum / data.length
  const yMean = ySum / data.length
  const [ssXY, ssXX] = data.reduce(
    (acc, { x, y }) => [acc[0] + (x - xMean) * (y - yMean), acc[1] + (x - xMean) ** 2],
    [0, 0],
  )
  const beta = ssXY / ssXX
  return beta
}
