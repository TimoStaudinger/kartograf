import './Canvas.css'
import React from 'react'
import FilterDropShadow from '../utils/FilterDropShadow'
import Grid from './Grid'
import Shape, {getConnectorPosition} from '../shapes/Shape'
import Connection from '../Connection'
import {DropTarget} from 'react-dnd'
import colors from '../../colors'

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

const resolveConnection = (connection, shapes) => {
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

const shapeDropTarget = {
  drop (props, monitor) {
    const position = monitor.getClientOffset()
    const shape = {
      x: position.x,
      y: position.y,
      type: monitor.getItem().type
    }
    props.onAddShape(shape)
    return shape
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

    return this.props.connectDropTarget(
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

          {this.props.data.shapes.map(r =>
            <Shape
              {...snapRectToGrid(r)}
              color={colors[r.color]}
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

          {this.props.data.connections.map(c => resolveConnection(c, this.props.data.shapes)).map(c =>
            <Connection {...c} />
          )}
        </svg>
      </div>
    )
  }
}

export default DropTarget('shape', shapeDropTarget, (connector, monitor) => ({
  connectDropTarget: connector.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(Canvas)
