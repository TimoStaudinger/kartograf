import React from 'react'

import Canvas from '@kartograf/canvas-svg'

import App from './app/App'
import ShapeBuilder from './shapes/ShapeBuilder'
import Shape, {getConnectorPosition, getConnectors} from './shapes/Shape'
import Printer from './Printer'

import theme from '@kartograf/theme-material'

const findAdjacentConnector = (origin, x, y, shapes, threshold = 20) => {
  const originShape = shapes.find(s => s.id === origin.id)

  let adjacentConnector = null
  shapes.find(shape => {
    if (shape === originShape) return false

    const connectors = getConnectors(shape)
    return connectors.find(connector => {
      const connectorPosition = getConnectorPosition(shape, connector)
      if (
        Math.abs(connectorPosition.x - x) < threshold &&
        Math.abs(connectorPosition.y - y) < threshold
      ) {
        adjacentConnector = {
          id: shape.id,
          connector
        }
        return true
      }

      return false
    })
  })

  return adjacentConnector
}

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
          onMoveShape={this.onMoveShape}
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
