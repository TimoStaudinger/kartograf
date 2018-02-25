import './Canvas.css'
import React from 'react'
import FilterDropShadow from './utils/FilterDropShadow'
import Shape, {getConnectorPosition} from '../shapes/Shape'
import Connection from './Connection'
import {DropTarget} from 'react-dnd'
import {DraggableCore} from 'react-draggable'
import colors from '../colors'

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
    this.setState({
      drawing: {
        from: {x, y},
        to: {x, y}
      }
    })
  }

  onDraw (dx, dy) {
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

  onStopDrawing () {
    this.props.onAddShape(
      this.state.drawing.from.x < this.state.drawing.to.x ? this.state.drawing.from.x : this.state.drawing.to.x,
      this.state.drawing.from.y < this.state.drawing.to.y ? this.state.drawing.from.y : this.state.drawing.to.y,
      Math.abs(this.state.drawing.to.x - this.state.drawing.from.x),
      Math.abs(this.state.drawing.to.y - this.state.drawing.from.y)
    )
    this.setState({
      drawing: null
    })
  }

  render () {
    const drawingShadow = this.state.drawing ? snapRectToGrid({
      x: this.state.drawing.from.x < this.state.drawing.to.x ? this.state.drawing.from.x : this.state.drawing.to.x,
      y: this.state.drawing.from.y < this.state.drawing.to.y ? this.state.drawing.from.y : this.state.drawing.to.y,
      width: Math.abs(this.state.drawing.to.x - this.state.drawing.from.x),
      height: Math.abs(this.state.drawing.to.y - this.state.drawing.from.y)
    }) : null

    return this.props.connectDropTarget(
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden'}}>
        <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
          <defs>
            <pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'>
              <path d='M 20 0 L 0 0 0 20' fill='none' stroke='#aaa' strokeWidth='0.5' />
            </pattern>
            <style type='text/css'>@import url(http://fonts.googleapis.com/css?family=Roboto);</style>
          </defs>
          <FilterDropShadow id='dropshadow' />

          <rect x={0} y={0} width='100%' height='100%' fill='#ddd' onClick={this.props.onClearSelection} />
          <DraggableCore
            onStart={(_, d) => this.onStartDrawing(d.lastX, d.lastY)}
            onStop={(_, d) => this.onStopDrawing()}
            onDrag={(_, d) => this.onDraw(d.deltaX, d.deltaY)}
          >
            <rect x={0} y={0} width='100%' height='100%' fill='url(#grid)' onClick={this.props.onClearSelection} />
          </DraggableCore>

          {this.props.data.shapes.map(r =>
            <Shape
              {...snapRectToGrid(r)}
              color={colors[r.color]}
              key={r.id}
              id={r.id}
              filter='dropshadow'
              moveRect={this.props.onMoveRect}
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
