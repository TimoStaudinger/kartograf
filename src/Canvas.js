import './Canvas.css'
import React from 'react'
import FilterDropShadow from './FilterDropShadow'
import Rect from './Rect'

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

const resolveConnections = (connections, objects) => {
  const resolvedConnections = {...connections}

  Object.keys(resolvedConnections).forEach(position => {
    if (resolvedConnections[position].connectedTo) {
      const remote = objects.find(o => o.id === resolvedConnections[position].connectedTo.id)
      const remoteConnector = getInitialConnectorPosition(resolvedConnections[position].connectedTo.position, remote.x, remote.y, remote.width, remote.height)
      resolvedConnections[position].x = snapTo(20, remoteConnector.x)
      resolvedConnections[position].y = snapTo(20, remoteConnector.y)
    }
  })

  return resolvedConnections
}

class Canvas extends React.Component {
  constructor () {
    super()

    this.onSelect = this.onSelect.bind(this)
    this.onClearSelection = this.onClearSelection.bind(this)

    this.state = {
      selected: []
    }
  }

  onSelect (id) {
    this.setState({selected: [id]})
  }

  onClearSelection () {
    this.setState({selected: []})
  }

  render () {
    return (
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: -1, overflow: 'hidden'}}>
        <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
          <defs>
            <pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'>
              <path d='M 20 0 L 0 0 0 20' fill='none' stroke='gray' strokeWidth='0.5' />
            </pattern>
            <style type='text/css'>@import url(http://fonts.googleapis.com/css?family=Roboto);</style>
          </defs>
          <FilterDropShadow id='dropshadow' />
          <rect x={0} y={0} width='100%' height='100%' fill='url(#grid)' onClick={this.onClearSelection} />

          {this.props.data.rects.map(r =>
            <Rect
              {...snapToGrid(r)}
              id={r.id}
              filter='dropshadow'
              moveRect={this.props.onMoveRect}
              moveConnector={this.props.onMoveConnector}
              dropConnector={this.props.onDropConnector}
              onResize={this.props.onResize}
              onSelect={this.onSelect}
              currentDropTarget={this.props.data.currentDropTarget}
              connections={resolveConnections(r.connections, this.props.data.rects)}
              selected={this.state.selected}
            />
          )}
        </svg>
      </div>
    )
  }
}

export default Canvas
