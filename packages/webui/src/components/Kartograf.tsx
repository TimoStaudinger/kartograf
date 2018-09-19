import React from 'react'
import produce from 'immer'
import Mousetrap from 'mousetrap'

import {findAdjacentConnector} from '../util/geo'

import Canvas from './Canvas'

import App from './app/App'
import ShapeBuilder from './shapes/ShapeBuilder'
import ShapeComponent, {getConnectorPosition} from './shapes/Shape'
import Printer from './Printer'

import theme from '@kartograf/theme-material'

interface Connection {}
interface Shape {
  id: string
  x: number
  y: number
  width: number
  height: number
}

interface Props {}
interface State {
  shapes?: Shape[]
  connections?: Connection[]
  connecting?: {x: number; y: number; origin: {id: string; connector: string}}
  selected?: string[]
  mode?: string
  print?: boolean
}

class Kartograf extends React.Component<Props, State> {
  debouncedOnMoveShape: Function = null

  constructor(props: Props) {
    super(props)

    this.onDropConnector = this.onDropConnector.bind(this)
    this.onMoveConnector = this.onMoveConnector.bind(this)
    this.onMoveShape = this.onMoveShape.bind(this)
    this.onResize = this.onResize.bind(this)
    this.onAddShape = this.onAddShape.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.onClearSelection = this.onClearSelection.bind(this)
    this.onChangeShape = this.onChangeShape.bind(this)
    this.onDelete = this.onDelete.bind(this)

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

  componentDidMount() {
    Mousetrap.bind('del', this.onDelete)
  }

  componentWillUnmount() {
    Mousetrap.unbind('del')
  }

  onSelect(id: string) {
    this.setState({selected: [id]})
  }

  onClearSelection() {
    this.setState({selected: []})
  }

  onMoveShape(id: string, dx: number, dy: number) {
    this.setState(
      (state): State => ({
        shapes: state.shapes.map(
          r =>
            r.id === id
              ? produce(r, draft => {
                  draft.x += dx
                  draft.y += dy
                })
              : r
        )
      })
    )
  }

  makeDebouncedOnMoveShape(wait = 16) {
    let lastId = 'foo'
    let dxSum = 0
    let dySum = 0

    let timeout: number = null

    const later = () => {
      timeout = null

      this.onMoveShape(lastId, dxSum, dySum)

      dxSum = null
      dySum = null
    }

    return function(id: string, dx: number, dy: number) {
      if (lastId !== id) {
        lastId = id
        dxSum = dx
        dySum = dy
      } else {
        dxSum += dx
        dySum += dy
      }

      if (!timeout) timeout = window.setTimeout(later, wait)
    }
  }

  onMoveConnector(
    origin: {id: string; connector: string},
    dx: number,
    dy: number
  ) {
    this.setState(
      (state: State): State => {
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
      }
    )
  }

  onDropConnector() {
    // this.setState({print: true})
  }

  onResize(shapeId: string, cornerId: string, dx: number, dy: number) {
    let newRect = this.state.shapes.find(r => r.id === shapeId)

    switch (cornerId) {
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
      shapes: state.shapes.map(r => (r.id === shapeId ? newRect : r))
    }))
  }

  onAddShape({
    x,
    y,
    width,
    height
  }: {
    x: number
    y: number
    width: number
    height: number
  }) {
    const type = this.state.mode === 'drawIcon' ? 'icon' : 'rect'

    this.setState(state => ({
      shapes: produce(state.shapes, draft => {
        draft.push(ShapeBuilder.create(x, y, width, height, type) as Shape)
      })
    }))
  }

  onChangeShape(newShape: Shape) {
    this.setState(state => ({
      shapes: state.shapes.map(
        shape => (shape.id === newShape.id ? newShape : shape)
      )
    }))
  }

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
        onSelectMode={(mode: string) => this.setState({mode})}
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
          shape={ShapeComponent}
          getConnectorPosition={getConnectorPosition}
        />
        {this.state.print ? (
          <Printer
            shapes={this.state.shapes}
            connections={this.state.connections}
            theme={theme}
            shape={ShapeComponent}
            onPrintDone={() => this.setState({print: false})}
          />
        ) : null}
      </App>
    )
  }
}

export default Kartograf
