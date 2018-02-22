import './Canvas.css'
import React from 'react'
import uuid from 'uuid/v4'
import FilterDropShadow from './FilterDropShadow'
import Rect from './Rect'

const colors = [
  {fill: '#F44336', stroke: '#B71C1C'},
  // {fill: '#E91E63', stroke: '#880E4F'},
  // {fill: '#9C27B0', stroke: '#4A148C'},
  {fill: '#3F51B5', stroke: '#1A237E'},
  // {fill: '#2196F3', stroke: '#0D47A1'},
  {fill: '#009688', stroke: '#004D40'},
  // {fill: '#8BC34A', stroke: '#33691E'},
  {fill: '#FFC107', stroke: '#FF6F00'},
  // {fill: '#FF5722', stroke: '#BF360C'},
  {fill: '#607D8B', stroke: '#263238'}
]
const rectTemplate = {
  strokeWidth: 0
}

const rand = (min, max) => Math.round((Math.random() * (max - min))) + min
const generateRect = () => ({
  ...rectTemplate,
  id: uuid(),
  x: rand(0, 30) * 20,
  y: rand(0, 30) * 20,
  width: rand(1, 2) * 80,
  height: rand(1, 2) * 80,
  ...colors[rand(0, colors.length - 1)],
  connections: {
    left: {connectedTo: null},
    right: {connectedTo: null},
    top: {connectedTo: null},
    bottom: {connectedTo: null}
  }
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

const findAdjacentConnector = (id, x, y, objects) => {
  const threshold = 20

  let connector = null
  objects.find(o => {
    if (o.id === id) return false

    return Object.keys(o.connections).find(position => {
      if (
        !o.connections[position].connectedTo &&
        !o.connections[position].x &&
        !o.connections[position].y &&
        Math.abs(getInitialConnectorPosition(position, o.x, o.y, o.width, o.height).x - x) < threshold &&
        Math.abs(getInitialConnectorPosition(position, o.x, o.y, o.width, o.height).y - y) < threshold
      ) {
        connector = {
          id: o.id,
          position
        }
        return true
      }
    })
  })

  return connector
}

class Canvas extends React.Component {
  constructor () {
    super()

    this.moveRect = this.moveRect.bind(this)
    this.moveConnector = this.moveConnector.bind(this)
    this.dropConnector = this.dropConnector.bind(this)
    this.onResize = this.onResize.bind(this)
    this.addRect = this.addRect.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.onClearSelection = this.onClearSelection.bind(this)

    this.state = {
      rects: [],
      currentDropTarget: null,
      selected: []
    }
  }

  addRect () {
    this.setState(state => ({rects: [...state.rects, generateRect()]}))
  }

  moveRect (id, dx, dy) {
    this.setState(state => ({
      rects: state.rects.map(r => r.id === id
        ? {...r, x: r.x + dx, y: r.y + dy}
        : r
      )
    }))
  }

  moveConnector (id, connector, dx, dy) {
    this.setState(state => {
      const prevRect = state.rects.find(r => r.id === id)
      const newRect = {
        ...prevRect,
        connections: {
          ...prevRect.connections,
          [connector]: {
            connectedTo: null,
            x: ((prevRect.connections[connector] && prevRect.connections[connector].x) || getInitialConnectorPosition(connector, prevRect.x, prevRect.y, prevRect.width, prevRect.height).x) + dx,
            y: ((prevRect.connections[connector] && prevRect.connections[connector].y) || getInitialConnectorPosition(connector, prevRect.x, prevRect.y, prevRect.width, prevRect.height).y) + dy
          }
        }
      }

      return {
        rects: state.rects.map(r => r.id === id
          ? newRect
          : r
        ),
        currentDropTarget: findAdjacentConnector(
          id,
          newRect.connections[connector].x,
          newRect.connections[connector].y,
          state.rects
        )
      }
    })
  }

  dropConnector (id, connector) {
    this.setState(state => ({
      rects: state.rects.map(r => r.id === id
        ? {
          ...r,
          connections: {
            ...r.connections,
            [connector]: {connectedTo: state.currentDropTarget}
          }}
        : r
      ),
      currentDropTarget: null
    }))
  }

  onResize (id, position, dx, dy) {
    let newRect = this.state.rects.find(r => r.id === id)

    switch (position) {
      case 'topLeft':
        newRect = {
          ...newRect,
          x: newRect.x + dx,
          y: newRect.y + dy,
          width: newRect.width - dx,
          height: newRect.height - dy
        }
        break

      case 'topRight':
        newRect = {
          ...newRect,
          y: newRect.y + dy,
          width: newRect.width + dx,
          height: newRect.height - dy
        }
        break

      case 'bottomLeft':
        newRect = {
          ...newRect,
          x: newRect.x + dx,
          width: newRect.width - dx,
          height: newRect.height + dy
        }
        break

      case 'bottomRight':
        newRect = {
          ...newRect,
          width: newRect.width + dx,
          height: newRect.height + dy
        }
        break
    }

    this.setState(state => ({
      rects: state.rects.map(r => r.id === id ? newRect : r)
    }))
  }

  onSelect (id) {
    this.setState({selected: [id]})
  }

  onClearSelection () {
    this.setState({selected: []})
  }

  render () {
    return <div>
      <button onClick={this.addRect}>Add</button>
      <svg xmlns='http://www.w3.org/2000/svg' width={800} height={800} viewBox='0 0 800 800'>
        <defs>
          <pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'>
            <path d='M 20 0 L 0 0 0 20' fill='none' stroke='gray' strokeWidth='0.5' />
          </pattern>
          <style type='text/css'>@import url(http://fonts.googleapis.com/css?family=Roboto);</style>
        </defs>
        <FilterDropShadow id='dropshadow' />
        <rect x={0} y={0} width={800} height={800} stroke='grey' strokeWidth={1} fill='url(#grid)' onClick={this.onClearSelection} />

        {this.state.rects.map(r =>
          <Rect
            {...snapToGrid(r)}
            id={r.id}
            filter='dropshadow'
            moveRect={this.moveRect}
            moveConnector={this.moveConnector}
            dropConnector={this.dropConnector}
            onResize={this.onResize}
            onSelect={this.onSelect}
            currentDropTarget={this.state.currentDropTarget}
            connections={resolveConnections(r.connections, this.state.rects)}
            selected={this.state.selected}
          />
        )}
      </svg>
    </div>
  }
}

export default Canvas
