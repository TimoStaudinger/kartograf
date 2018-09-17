import React from 'react'
import keydown, {Keys} from 'react-keydown'

import {findAdjacentConnector} from '../util/geo'

import Canvas from './Canvas'

import App from './app/App'
import ShapeBuilder from './shapes/ShapeBuilder'
import Shape, {getConnectorPosition} from './shapes/Shape'
import Printer from './Printer'

import theme from '@kartograf/theme-material'

class Kartograf extends React.Component {
  constructor(props) {
    super(props)

    this.onDropConnector = this.onDropConnector.bind(this)
    this.onMoveConnector = this.onMoveConnector.bind(this)
    this.onMoveShape = this.onMoveShape.bind(this)
    this.onResize = this.onResize.bind(this)
    this.onAddShape = this.onAddShape.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.onClearSelection = this.onClearSelection.bind(this)
    this.onChangeShape = this.onChangeShape.bind(this)

    this.debouncedOnMoveShape = this.makeDebouncedOnMoveShape()

    this.state = {
      shapes: [],
      connections: [],
      connecting: null,
      selected: [],
      mode: 'pan',
      print: false
    }
  }

  onSelect(id) {
    this.setState({selected: [id]})
  }

  onClearSelection() {
    this.setState({selected: []})
  }

  onMoveShape(id, dx, dy) {
    this.setState(state => ({
      shapes: state.shapes.map(
        r => (r.id === id ? {...r, x: r.x + dx, y: r.y + dy} : r)
      )
    }))
  }

  makeDebouncedOnMoveShape(wait = 16) {
    let lastId = 'foo'
    let dxSum = 0
    let dySum = 0

    let timeout = null

    const later = () => {
      timeout = null

      this.onMoveShape(lastId, dxSum, dySum)

      dxSum = null
      dySum = null
    }

    return function(id, dx, dy) {
      if (lastId !== id) {
        lastId = id
        dxSum = dx
        dySum = dy
      } else {
        dxSum += dx
        dySum += dy
      }

      if (!timeout) timeout = setTimeout(later, wait)
    }
  }

  onMoveConnector(origin, dx, dy) {
    this.setState(state => {
      const originShape = state.shapes.find(r => r.id === origin.id)
      const originConnectorPosition = getConnectorPosition(
        originShape,
        origin.connector
      )

      const prevX = state.connecting
        ? state.connecting.x
        : originConnectorPosition.x
      const prevY = state.connecting
        ? state.connecting.y
        : originConnectorPosition.y

      const newX = prevX + dx
      const newY = prevY + dy

      return {
        connecting: {
          origin,
          x: newX,
          y: newY
        }
      }
    })
  }

  onDropConnector() {
    this.setState({print: true})
  }

  onResize(id, position, dx, dy) {
    let newRect = this.state.shapes.find(r => r.id === id)

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
      default:
        newRect = {
          ...newRect,
          width: newRect.width + dx,
          height: newRect.height + dy
        }
        break
    }

    this.setState(state => ({
      shapes: state.shapes.map(r => (r.id === id ? newRect : r))
    }))
  }

  onAddShape({x, y, width, height}) {
    const type = this.state.mode === 'drawIcon' ? 'icon' : 'rect'

    this.setState(state => ({
      shapes: [...state.shapes, ShapeBuilder.create(x, y, width, height, type)]
    }))
  }

  onChangeShape(newShape) {
    this.setState(state => ({
      shapes: state.shapes.map(
        shape => (shape.id === newShape.id ? newShape : shape)
      )
    }))
  }

  @keydown(Keys.delete)
  onDelete() {
    this.setState(state => ({
      shapes: state.shapes.filter(shape => !state.selected.includes(shape.id)),
      selected: []
    }))
  }

  render() {
    const currentDropTarget = this.state.connecting
      ? findAdjacentConnector(
          this.state.connecting.origin,
          this.state.connecting.x,
          this.state.connecting.y,
          this.state.shapes
        )
      : null

    const selectedShape = this.state.selected.length
      ? this.state.shapes.find(s => s.id === this.state.selected[0])
      : null

    return (
      <App
        selectedMode={this.state.mode}
        onSelectMode={mode => this.setState({mode})}
        selectedShape={selectedShape}
        onChangeShape={this.onChangeShape}
        onDownload={() => this.setState({print: true})}
        theme={theme}
      >
        <Canvas
          shapes={this.state.shapes}
          connections={this.state.connections}
          selected={this.state.selected}
          currentDropTarget={currentDropTarget}
          connecting={this.state.connecting}
          onMoveShape={this.debouncedOnMoveShape}
          onMoveConnector={this.onMoveConnector}
          onDropConnector={this.onDropConnector}
          onResize={this.onResize}
          onSelect={this.onSelect}
          onClearSelection={this.onClearSelection}
          onAddShape={this.onAddShape}
          isDrawable={this.state.mode && this.state.mode.startsWith('draw')}
          isDrawableSquare={this.state.mode === 'drawIcon'}
          theme={theme}
          shape={Shape}
          getConnectorPosition={getConnectorPosition}
        />
        {this.state.print ? (
          <Printer
            shapes={this.state.shapes}
            connections={this.state.connections}
            theme={theme}
            shape={Shape}
            onPrintDone={() => this.setState({print: false})}
          />
        ) : null}
      </App>
    )
  }
}

export default Kartograf
