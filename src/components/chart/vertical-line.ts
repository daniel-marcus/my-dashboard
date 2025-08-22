import { CanvasRenderingTarget2D } from "fancy-canvas"
import {
  Coordinate,
  IChartApi,
  ISeriesApi,
  ISeriesPrimitive,
  ISeriesPrimitiveAxisView,
  IPrimitivePaneRenderer,
  IPrimitivePaneView,
  SeriesOptionsMap,
  SeriesType,
  Time,
} from "lightweight-charts"

// source: https://github.com/tradingview/lightweight-charts/blob/master/plugin-examples/src/plugins/vertical-line/vertical-line.ts
// changes: color is optional, fallback to grid.vertLines.color

class VertLinePaneRenderer implements IPrimitivePaneRenderer {
  _x: Coordinate | null = null
  _options: VertLineOptions
  _chart: IChartApi
  constructor(
    x: Coordinate | null,
    options: VertLineOptions,
    chart: IChartApi
  ) {
    this._x = x
    this._options = options
    this._chart = chart
  }
  draw(target: CanvasRenderingTarget2D) {
    target.useBitmapCoordinateSpace((scope) => {
      if (this._x === null) return
      const ctx = scope.context
      const position = positionsLine(
        this._x,
        scope.horizontalPixelRatio,
        this._options.width
      )
      ctx.fillStyle =
        this._options.color ?? this._chart.options().grid.vertLines.color
      ctx.fillRect(
        position.position,
        0,
        position.length,
        scope.bitmapSize.height
      )
    })
  }
}

class VertLinePaneView implements IPrimitivePaneView {
  _source: VertLine
  _x: Coordinate | null = null
  _options: VertLineOptions

  constructor(source: VertLine, options: VertLineOptions) {
    this._source = source
    this._options = options
  }
  update() {
    const timeScale = this._source._chart.timeScale()
    this._x = timeScale.timeToCoordinate(this._source._time)
  }
  renderer() {
    return new VertLinePaneRenderer(this._x, this._options, this._source._chart)
  }
}

class VertLineTimeAxisView implements ISeriesPrimitiveAxisView {
  _source: VertLine
  _x: Coordinate | null = null
  _options: VertLineOptions

  constructor(source: VertLine, options: VertLineOptions) {
    this._source = source
    this._options = options
  }
  update() {
    const timeScale = this._source._chart.timeScale()
    this._x = timeScale.timeToCoordinate(this._source._time)
  }
  visible() {
    return this._options.showLabel
  }
  tickVisible() {
    return this._options.showLabel
  }
  coordinate() {
    return this._x ?? 0
  }
  text() {
    return this._options.labelText
  }
  textColor() {
    return this._options.labelTextColor
  }
  backColor() {
    return this._options.labelBackgroundColor
  }
}

export interface VertLineOptions {
  labelText: string
  width: number
  labelBackgroundColor: string
  labelTextColor: string
  showLabel: boolean
  color?: string // dm: made optional, fallback to grid.vertLines.color
}

const defaultOptions: VertLineOptions = {
  labelText: "",
  width: 3,
  labelBackgroundColor: "green",
  labelTextColor: "white",
  showLabel: false,
}

export class VertLine implements ISeriesPrimitive<Time> {
  _chart: IChartApi
  _series: ISeriesApi<keyof SeriesOptionsMap>
  _time: Time
  _paneViews: VertLinePaneView[]
  _timeAxisViews: VertLineTimeAxisView[]

  constructor(
    chart: IChartApi,
    series: ISeriesApi<SeriesType>,
    time: Time,
    options?: Partial<VertLineOptions>
  ) {
    const vertLineOptions: VertLineOptions = {
      ...defaultOptions,
      ...options,
    }
    this._chart = chart
    this._series = series
    this._time = time
    this._paneViews = [new VertLinePaneView(this, vertLineOptions)]
    this._timeAxisViews = [new VertLineTimeAxisView(this, vertLineOptions)]
  }
  updateAllViews() {
    this._paneViews.forEach((pw) => pw.update())
    this._timeAxisViews.forEach((tw) => tw.update())
  }
  timeAxisViews() {
    return this._timeAxisViews
  }
  paneViews() {
    return this._paneViews
  }
}

export interface BitmapPositionLength {
  /** coordinate for use with a bitmap rendering scope */
  position: number
  /** length for use with a bitmap rendering scope */
  length: number
}

function centreOffset(lineBitmapWidth: number): number {
  return Math.floor(lineBitmapWidth * 0.5)
}

/**
 * Calculates the bitmap position for an item with a desired length (height or width), and centred according to
 * an position coordinate defined in media sizing.
 * @param positionMedia - position coordinate for the bar (in media coordinates)
 * @param pixelRatio - pixel ratio. Either horizontal for x positions, or vertical for y positions
 * @param desiredWidthMedia - desired width (in media coordinates)
 * @returns Position of of the start point and length dimension.
 */
export function positionsLine(
  positionMedia: number,
  pixelRatio: number,
  desiredWidthMedia: number = 1,
  widthIsBitmap?: boolean
): BitmapPositionLength {
  const scaledPosition = Math.round(pixelRatio * positionMedia)
  const lineBitmapWidth = widthIsBitmap
    ? desiredWidthMedia
    : Math.round(desiredWidthMedia * pixelRatio)
  const offset = centreOffset(lineBitmapWidth)
  const position = scaledPosition - offset
  return { position, length: lineBitmapWidth }
}
