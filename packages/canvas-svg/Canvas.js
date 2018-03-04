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

  const fromCoords = getConnectorPosition(snapRectToGrid(fromShape), connection.from.connector)
  const toCoords = getConnectorPosition(snapRectToGrid(toShape), connection.to.connector)

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

class Canvas extends React.Component {
  constructor (props) {
    super(props)

    this.onDraw = this.onDraw.bind(this)
    this.onStartDrawing = this.onStartDrawing.bind(this)
    this.onStopDrawing = this.onStopDrawing.bind(this)

    this.state = {
      drawing: null
    }
  }

  onStartDrawing (x, y) {
    if (this.props.isDrawable) {
      this.setState({
        drawing: {
          from: {x, y},
          to: {x, y}
        }
      })
    }
  }

  onDraw (dx, dy) {
    if (this.props.isDrawable) {
      this.setState(state => ({
        drawing: {
          ...state.drawing,
          to: {
            x: state.drawing.to.x + dx,
            y: state.drawing.to.y + dy,
          }
        }
      }))
    }
  }

  onStopDrawing () {
    if (this.props.isDrawable) {
      this.props.onAddShape(calculateDrawingShadow(this.state.drawing, this.props.isDrawableSquare))
    }
    this.setState({drawing: null})
  }

  render () {
    const drawingShadow = this.state.drawing ? calculateDrawingShadow(
      this.state.drawing,
      this.props.isDrawableSquare
    ) : null

    return (
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden'}}>
        <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
          <defs>
            <pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'>
              <path d='M 20 0 L 0 0 0 20' fill='none' stroke='#aaa' strokeWidth='0.5' />
            </pattern>
            <style type='text/css'>@import url(https://fonts.googleapis.com/css?family=Roboto);</style>
          </defs>
          <FilterDropShadow id='dropshadow' />

          <Grid
            onClearSelection={this.props.onClearSelection}
            onStartDrawing={this.onStartDrawing}
            onStopDrawing={this.onStopDrawing}
            onDraw={this.onDraw}
          />

          {this.props.shapes.map(r =>
            <this.props.shape
              {...snapRectToGrid(r)}
              color={this.props.theme.colors[r.color]}
              key={r.id}
              id={r.id}
              filter='dropshadow'
              onMoveShape={this.props.onMoveShape}
              moveConnector={this.props.onMoveConnector}
              dropConnector={this.props.onDropConnector}
              onResize={this.props.onResize}
              onSelect={this.props.onSelect}
              isSelected={this.props.selected.some(sel => sel === r.id)}
              currentDropTarget={this.props.currentDropTarget && this.props.currentDropTarget.id === r.id ? this.props.currentDropTarget.connector : null}
              isConnecting={!!this.props.connecting}
              isConnectingMe={this.props.connecting && this.props.connecting.origin.id === r.id}
              connecting={this.props.connecting && this.props.connecting.origin.id === r.id ? this.props.connecting : null}
            />
          )}

          {this.state.drawing ? (
            <rect
              {...drawingShadow}
              rx={2}
              ry={2}
              fill='none'
              stroke='#999'
              strokeWidth='3'
            />
          ) : null}

          {this.props.connections.map(c => resolveConnection(c, this.props.shapes)).map(c =>
            <Connection {...c} />
          )}
        </svg>
      </div>
    )
  }
}

Canvas.propTypes = {
  theme: PropTypes.shape({
    colors: PropTypes.object
  }),
  shape: PropTypes.element.isRequired,
  getConnectorPosition: PropTypes.func.isRequired
}

export default Canvas
