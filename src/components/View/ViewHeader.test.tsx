import { render, screen, cleanup } from "@testing-library/react"
import { describe, it, expect, vi, afterEach } from "vitest"
import { ViewHeader } from "./ViewHeader"
import type { DataEntry, ViewDef } from "@/lib/types"

const view: ViewDef = {
  key: "temp",
  unit: "°C",
  props: [
    { key: "temp", color: "hsl(342, 70%, 50%)" },
    { key: "temp_ext", color: "hsl(162, 70%, 50%)", hidden: true },
  ],
}

const data: DataEntry[] = [{ ts: 0, temp: 1, temp_ext: 2 }]

describe("ViewHeader", () => {
  it("calls toggleKey with the clicked prop's key", () => {
    const toggleKey = vi.fn()
    render(<ViewHeader view={view} data={data} toggleKey={toggleKey} />)

    screen.getByText("temp").click()

    expect(toggleKey).toHaveBeenCalledExactlyOnceWith("temp")
  })

  it("dims the label of a hidden prop", () => {
    render(<ViewHeader view={view} data={data} toggleKey={vi.fn()} />)

    expect(screen.getByText("temp").closest("button")?.className).not.toMatch(/opacity-50/)
    expect(screen.getByText("temp_ext").closest("button")?.className).toMatch(/opacity-50/)
  })
})

afterEach(cleanup)
