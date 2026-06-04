import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Trend } from "@/components/Trend"
import type { DataEntry, ViewDef } from "@/lib/types"

const view: ViewDef = {
  key: "temp",
  unit: "°C",
  props: [{ key: "value" }],
}

const makeData = (values: number[]): DataEntry[] => values.map((v, i) => ({ ts: i, value: v }))

const getFirstPath = (container: HTMLElement) => container.querySelector("path")?.getAttribute("d")

// First path of each icon is unique enough to identify it
const UP_PATH = "M16 7h6v6"
const DOWN_PATH = "M16 17h6v-6"
const STABLE_PATH = "M18 8L22 12L18 16"

describe("Trend", () => {
  it("renders TrendUpIcon for rising data", () => {
    const { container } = render(
      <Trend data={makeData([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])} currView={view} />,
    )
    expect(getFirstPath(container)).toBe(UP_PATH)
  })

  it("renders TrendDownIcon for falling data", () => {
    const { container } = render(
      <Trend data={makeData([10, 9, 8, 7, 6, 5, 4, 3, 2, 1])} currView={view} />,
    )
    expect(getFirstPath(container)).toBe(DOWN_PATH)
  })

  it("renders TrendStableIcon for flat data", () => {
    const { container } = render(
      <Trend data={makeData([5, 5, 5, 5, 5, 5, 5, 5, 5, 5])} currView={view} />,
    )
    expect(getFirstPath(container)).toBe(STABLE_PATH)
  })

  it("uses only the last 10 values for trend calculation", () => {
    // first 5 values fall sharply, last 10 rise — trend should be up
    const data = makeData([100, 50, 10, 5, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    const { container } = render(<Trend data={data} currView={view} />)
    expect(getFirstPath(container)).toBe(UP_PATH)
  })
})
