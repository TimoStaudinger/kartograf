import React, { Component } from 'react'
import Button from 'material-ui/Button'
import AddIcon from 'material-ui-icons/Add'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import { withStyles } from 'material-ui/styles'
import classNames from 'classnames'
import {DragDropContextProvider} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Canvas from './components/Canvas'
import Options from './components/Options'
import ShapeBuilder from './shapes/ShapeBuilder'
import {getConnectorPosition} from './shapes/Shape'
import { getConnectors } from './shapes/rect/Rect'

const sidebarWidth = 400

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: 430,
    marginTop: theme.spacing.unit * 3,
    zIndex: 1,
    overflow: 'hidden'
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  appFrame: {
    position: 'absolute',
    display: 'flex',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  appBar: {
    position: 'absolute',
    width: '100%',
    zIndex: 1500
  },
  drawerPaper: {
    position: 'relative',
    height: 'calc(100% - 64px)',
    marginTop: 64,
    width: sidebarWidth
  },
  drawerHeader: theme.mixins.toolbar,
  content: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    height: 'calc(100% - 64px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      marginTop: 64
    }
  },
  formControl: {
    margin: theme.spacing.unit
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 4,
    right: theme.spacing.unit * 4
  }
})

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
    })
  })

  return adjacentConnector
}

class App extends Component {
  constructor (props) {
    super(props)

    this.onDropConnector = this.onDropConnector.bind(this)
    this.onMoveConnector = this.onMoveConnector.bind(this)
    this.onMoveRect = this.onMoveRect.bind(this)
    this.onResize = this.onResize.bind(this)
    this.onAddShape = this.onAddShape.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.onClearSelection = this.onClearSelection.bind(this)
    this.onChangeShape = this.onChangeShape.bind(this)

    this.state = {
      data: {
        shapes: [],
        connections: []
      },
      connecting: null,
      selected: []
    }
  }

  onSelect (id) {
    this.setState({selected: [id]})
  }

  onClearSelection () {
    this.setState({selected: []})
  }

  onMoveRect (id, dx, dy) {
    this.setState(state => ({
      data: {
        ...state.data,
        shapes: state.data.shapes.map(r => r.id === id
          ? {...r, x: r.x + dx, y: r.y + dy}
          : r
        )
      }
    }))
  }

  onMoveConnector (origin, dx, dy) {
    this.setState(state => {
      const originShape = state.data.shapes.find(r => r.id === origin.id)
      const originConnectorPosition = getConnectorPosition(originShape, origin.connector)

      const prevX = state.connecting ? state.connecting.x : originConnectorPosition.x
      const prevY = state.connecting ? state.connecting.y : originConnectorPosition.y

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

  onDropConnector () {
    this.setState(state => {
      const dropTarget = findAdjacentConnector(this.state.connecting.origin, this.state.connecting.x, this.state.connecting.y, this.state.data.shapes)
      if (dropTarget) {
        const newConnection = {
          from: state.connecting.origin,
          to: dropTarget
        }
        return {
          data: {
            ...state.data,
            connections: [...state.data.connections, newConnection]
          },
          connecting: null
        }
      } else return {connecting: null}
    })
  }

  onResize (id, position, dx, dy) {
    let newRect = this.state.data.shapes.find(r => r.id === id)

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
      data: {
        ...state.data,
        shapes: state.data.shapes.map(r => r.id === id ? newRect : r)
      }
    }))
  }

  onAddShape (shape) {
    this.setState(state => ({
      data: {
        ...state.data,
        shapes: [...state.data.shapes, ShapeBuilder.create(shape)]
      }
    }))
  }

  onChangeShape (newShape) {
    this.setState(state => ({
      data: {
        ...state.data,
        shapes: state.data.shapes.map(shape => shape.id === newShape.id
          ? newShape
          : shape
        )
      }
    }))
  }

  render () {
    console.log(this.state.connecting)
    const currentDropTarget = this.state.connecting
      ? findAdjacentConnector(this.state.connecting.origin, this.state.connecting.x, this.state.connecting.y, this.state.data.shapes)
      : null
    console.log(currentDropTarget)

    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div className={this.props.classes.appFrame}>
          <AppBar className={classNames(this.props.classes.appBar, this.props.classes[`appBar-right`])}>
            <Toolbar>
              <IconButton className={this.props.classes.menuButton} color='inherit' aria-label='Menu'>
                <MenuIcon />
              </IconButton>
              <Typography variant='title' color='inherit' className={this.props.classes.flex}>
                Kartograf
              </Typography>
            </Toolbar>
          </AppBar>
          <main className={this.props.classes.content}>
            {/* <Palette /> */}
            <Options
              shapes={this.state.data.shapes}
              selected={this.state.selected}
              onChangeShape={this.onChangeShape}
            />
            <Canvas
              data={this.state.data}
              selected={this.state.selected}
              currentDropTarget={currentDropTarget}
              connecting={this.state.connecting}
              onMoveRect={this.onMoveRect}
              onMoveConnector={this.onMoveConnector}
              onDropConnector={this.onDropConnector}
              onResize={this.onResize}
              onSelect={this.onSelect}
              onClearSelection={this.onClearSelection}
              onAddShape={this.onAddShape}
            />
          </main>
          <Button onClick={() => this.onAddShape({x: 300, y: 300, type: 'rect'})} variant='fab' className={this.props.classes.fab} color='primary'>
            <AddIcon />
          </Button>
          {/* <Sidebar
            shapes={this.state.data.shapes}
            selected={this.state.selected}
            onChangeShape={this.onChangeShape}
          /> */}
        </div>
      </DragDropContextProvider>
    )
  }
}

export default withStyles(styles)(App)
