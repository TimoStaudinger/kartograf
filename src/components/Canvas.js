import './Canvas.css'
import React from 'react'
import FilterDropShadow from './utils/FilterDropShadow'
import Shape from './shapes/Shape'
import {DropTarget} from 'react-dnd'
import colors from '../colors'

const snapTo = (grid, value) => {
  const rem = value % grid
  if (rem < grid / 2) {
    return value - rem
  } else {
    return value - rem + grid
  }
}

const snapToGrid = rect => ({
  ...rect,
  x: snapTo(20, rect.x),
  y: snapTo(20, rect.y),
  width: snapTo(20, rect.width),
  height: snapTo(20, rect.height)
})

const getInitialConnectorPosition = (connector, x, y, width, height) => {
  switch (connector) {
    case 'top':
      return {x: x + width / 2, y}

    case 'bottom':
      return {x: x + width / 2, y: y + height}

    case 'left':
      return {x, y: y + height / 2}

    case 'right':
      return {x: x + width, y: y + height / 2}

    default:
      return {x, y}
  }
}

const resolveConnections = (connections, shapes) => {
  const resolvedConnections = {...connections}

  Object.keys(resolvedConnections).forEach(position => {
    if (resolvedConnections[position].connectedTo) {
      const remote = shapes.find(o => o.id === resolvedConnections[position].connectedTo.id)
      const remoteConnector = getInitialConnectorPosition(resolvedConnections[position].connectedTo.position, remote.x, remote.y, remote.width, remote.height)
      resolvedConnections[position].x = snapTo(20, remoteConnector.x)
      resolvedConnections[position].y = snapTo(20, remoteConnector.y)
    }
  })

  return resolvedConnections
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
  render () {
    return this.props.connectDropTarget(
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden'}}>
        <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
          <defs>
            <pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'>
              <path d='M 20 0 L 0 0 0 20' fill='none' stroke='gray' strokeWidth='0.5' />
            </pattern>
            <style type='text/css'>@import url(http://fonts.googleapis.com/css?family=Roboto);</style>
          </defs>
          <FilterDropShadow id='dropshadow' />
          <rect x={0} y={0} width='100%' height='100%' fill='url(#grid)' onClick={this.props.onClearSelection} />

          {this.props.data.shapes.map(r =>
            <Shape
              {...snapToGrid(r)}
              color={colors[r.color]}
              id={r.id}
              filter='dropshadow'
              moveRect={this.props.onMoveRect}
              moveConnector={this.props.onMoveConnector}
              dropConnector={this.props.onDropConnector}
              onResize={this.props.onResize}
              onSelect={this.props.onSelect}
              currentDropTarget={this.props.data.currentDropTarget}
              connections={resolveConnections(r.connections, this.props.data.shapes)}
              selected={this.props.selected}
            />
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
