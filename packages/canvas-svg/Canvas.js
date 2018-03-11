import React from 'react'
import PropTypes from 'prop-types'

import FilterDropShadow from './FilterDropShadow'
import Grid from './Grid'
import Connection from './Connection'

const snapTo = (grid, value) => {
  const rem = value % grid
  if (rem < grid / 2) {
    return value - rem
  } else {
    return value - rem + grid
  }
}

const snapRectToGrid = rect => ({
  ...rect,
  x: snapTo(20, rect.x),
  y: snapTo(20, rect.y),
  width: snapTo(20, rect.width),
  height: snapTo(20, rect.height)
})

const resolveConnection = (connection, shapes, getConnectorPosition) => {
  const fromShape = shapes.find(s => s.id === connection.from.id)
  const toShape = shapes.find(s => s.id === connection.to.id)

  const fromCoords = getConnectorPosition(
    snapRectToGrid(fromShape),
    connection.from.connector
  )
  const toCoords = getConnectorPosition(
    snapRectToGrid(toShape),
    connection.to.connector
  )

  return {
    ...connection,
    fromCoords,
    toCoords
  }
}

const calculateDrawingShadow = ({from, to}, isDrawingSquare) => {
  const x = from.x < to.x ? from.x : to.x
  const y = from.y < to.y ? from.y : to.y

  const width = Math.abs(to.x - from.x)
  const height = Math.abs(to.y - from.y)

  const squareEdgeLength = width > height ? width : height

  return snapRectToGrid({
    x,
    y,
    width: isDrawingSquare ? squareEdgeLength : width,
    height: isDrawingSquare ? squareEdgeLength : height
  })
}

const calculateViewBox = (shapes, padding = 30) => {
  let minX = null
  let minY = null
  let maxX = null
  let maxY = null

  shapes.forEach(s => {
    if (s.width === 0) return

    if (minX === null || s.x < minX) minX = s.x
    if (minY === null || s.y < minY) minY = s.y
    if (maxX === null || s.x + s.width > maxX) maxX = s.x + s.width
    if (maxY === null || s.y + (s.height || s.width) > maxY)
      maxY = s.y + (s.height || s.width)
  })

  minX -= padding
  minY -= padding
  maxX += padding
  maxY += padding

  const x = minX
  const y = minY
  const width = maxX - minX
  const height = maxY - minY

  return `${x} ${y} ${width} ${height}`
}

class Canvas extends React.Component {
  constructor(props) {
    super(props)

    this.onDraw = this.onDraw.bind(this)
    this.onStartDrawing = this.onStartDrawing.bind(this)
    this.onStopDrawing = this.onStopDrawing.bind(this)

    this.state = {
      drawing: null
    }
  }

  componentDidMount() {
    if (this.props.printCallback) {
      this.props.printCallback(
        () => (this.svgRef ? this.svgRef.outerHTML : null)
      )
    }
  }

  onStartDrawing(x, y) {
    if (this.props.isDrawable) {
      this.setState({
        drawing: {
          from: {x, y},
          to: {x, y}
        }
      })
    }
  }

  onDraw(dx, dy) {
    if (this.props.isDrawable) {
      this.setState(state => ({
        drawing: {
          ...state.drawing,
          to: {
            x: state.drawing.to.x + dx,
            y: state.drawing.to.y + dy
          }
        }
      }))
    }
  }

  onStopDrawing() {
    if (this.props.isDrawable) {
      this.props.onAddShape(
        calculateDrawingShadow(this.state.drawing, this.props.isDrawableSquare)
      )
    }
    this.setState({drawing: null})
  }

  render() {
    const drawingShadow = this.state.drawing
      ? calculateDrawingShadow(this.state.drawing, this.props.isDrawableSquare)
      : null

    const viewBox = this.props.printMode
      ? calculateViewBox(this.props.shapes)
      : undefined
    const dimensions = this.props.printMode ? undefined : '100%'

    return (
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          overflow: 'hidden'
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={dimensions}
          height={dimensions}
          ref={ref => (this.svgRef = ref)}
          viewBox={viewBox}
        >
          <defs>
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#aaa"
                strokeWidth="0.5"
              />
            </pattern>
            <style type="text/css">
              @import url(https://fonts.googleapis.com/css?family=Roboto);
            </style>
          </defs>
          <FilterDropShadow id="dropshadow" />

          {this.props.printMode ? null : (
            <Grid
              onClearSelection={this.props.onClearSelection}
              onStartDrawing={this.onStartDrawing}
              onStopDrawing={this.onStopDrawing}
              onDraw={this.onDraw}
            />
          )}

          {this.props.shapes.map(r => (
            <this.props.shape
              {...snapRectToGrid(r)}
              color={this.props.theme.colors[r.color]}
              key={r.id}
              id={r.id}
              filter="dropshadow"
              onMoveShape={this.props.onMoveShape}
              moveConnector={this.props.onMoveConnector}
              dropConnector={this.props.onDropConnector}
              onResize={this.props.onResize}
              onSelect={this.props.onSelect}
              isSelected={this.props.selected.some(sel => sel === r.id)}
              currentDropTarget={
                this.props.currentDropTarget &&
                this.props.currentDropTarget.id === r.id
                  ? this.props.currentDropTarget.connector
                  : null
              }
              isConnecting={!!this.props.connecting}
              isConnectingMe={
                this.props.connecting &&
                this.props.connecting.origin.id === r.id
              }
              connecting={
                this.props.connecting &&
                this.props.connecting.origin.id === r.id
                  ? this.props.connecting
                  : null
              }
            />
          ))}

          {this.state.drawing ? (
            <rect
              {...drawingShadow}
              rx={2}
              ry={2}
              fill="none"
              stroke="#999"
              strokeWidth="3"
            />
          ) : null}

          {this.props.connections
            .map(c => resolveConnection(c, this.props.shapes))
            .map(c => <Connection {...c} />)}
        </svg>
      </div>
    )
  }
}

Canvas.propTypes = {
  getConnectorPosition: PropTypes.func.isRequired,
  printMode: PropTypes.bool,
  selected: PropTypes.arrayOf(PropTypes.string),
  shape: PropTypes.func.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.arrayOf(PropTypes.object)
  })
}
Canvas.defaultProps = {
  printMode: false,
  selected: []
}

export default Canvas
