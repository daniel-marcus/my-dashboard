import { useEffect, useRef, useState } from "react"
import { createChart, ColorType } from "lightweight-charts"
import { useIsDarkMode } from "@/lib/is-dark-mode"
import type { ChartOptions, DeepPartial } from "lightweight-charts"
import type { ChartApi } from "./types"

export function useLightweightChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [chart, setChart] = useState<ChartApi>(null)

  useEffect(() => {
    if (!containerRef.current) throw new Error("Container Ref not found")

    const newChart = createChart(containerRef.current, {
      ...getStyleOptions(),
      localization: {
        priceFormatter: (v: number) =>
          v % 1 === 0 ? v.toString() : v.toFixed(1),
      },
      autoSize: true,
      handleScroll: {
        vertTouchDrag: false,
      },
      handleScale: {
        axisPressedMouseMove: { price: false },
      },
      kineticScroll: { mouse: true },
    })
    setChart(newChart)

    return () => {
      newChart.remove()
    }
  }, [])

  const isDarkMode = useIsDarkMode()
  useEffect(() => {
    chart?.applyOptions(getStyleOptions())
  }, [chart, isDarkMode])

  return [containerRef, chart] as const
}

function getStyleOptions(): DeepPartial<ChartOptions> {
  const legendColor = cssvar("--legend-color")
  const gridColor = cssvar("--grid-color")
  return {
    layout: {
      background: { type: ColorType.Solid, color: "transparent" },
      textColor: legendColor,
      attributionLogo: false,
    },
    grid: {
      horzLines: { color: gridColor },
      vertLines: { color: gridColor, visible: false },
    },
    rightPriceScale: {
      borderColor: gridColor,
      ticksVisible: true,
      entireTextOnly: true,
    },
    timeScale: {
      borderColor: gridColor,
      ticksVisible: true,
      timeVisible: true,
      secondsVisible: false,
      minBarSpacing: 0,
      fixLeftEdge: true,
      fixRightEdge: true,
    },
  }
}

const cssvar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name)
