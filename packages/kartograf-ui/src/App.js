import React, {Component} from 'react'
import Button from 'material-ui/Button'
import ShareIcon from 'material-ui-icons/Share'
import FileDownloadIcon from 'material-ui-icons/FileDownload'
import MenuIcon from 'material-ui-icons/Menu'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import {withStyles} from 'material-ui/styles'
import classNames from 'classnames'
import {DragDropContextProvider} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Canvas from './components/canvas/Canvas'
import Toolbox from './components/Toolbox'
import Options from './components/Options'
import ShapeBuilder from './components/shapes/ShapeBuilder'
import {getConnectorPosition, getConnectors} from './components/shapes/Shape'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import theme from './components/Theme'

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
    flex: 1,
    fontFamily: 'Raleway, Roboto, sans-serif'
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
    width: '100%'
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
  },
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
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

      return false
    })
  })

  return adjacentConnector
}

class App extends Component {
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
    this.onChangeMode = this.onChangeMode.bind(this)

    this.state = {
      data: {
        shapes: [],
        connections: []
      },
      connecting: null,
      selected: [],
      mode: 'pan'
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
      data: {
        ...state.data,
        shapes: state.data.shapes.map(
          r => (r.id === id ? {...r, x: r.x + dx, y: r.y + dy} : r)
        )
      }
    }))
  }

  onMoveConnector(origin, dx, dy) {
    this.setState(state => {
      const originShape = state.data.shapes.find(r => r.id === origin.id)
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
    this.setState(state => {
      const dropTarget = findAdjacentConnector(
        this.state.connecting.origin,
        this.state.connecting.x,
        this.state.connecting.y,
        this.state.data.shapes
      )
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

  onResize(id, position, dx, dy) {
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
      default:
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
        shapes: state.data.shapes.map(r => (r.id === id ? newRect : r))
      }
    }))
  }

  onAddShape({x, y, width, height}) {
    const type = this.state.mode === 'drawIcon' ? 'icon' : 'rect'

    this.setState(state => ({
      data: {
        ...state.data,
        shapes: [
          ...state.data.shapes,
          ShapeBuilder.create(x, y, width, height, type)
        ]
      }
    }))
  }

  onChangeShape(newShape) {
    this.setState(state => ({
      data: {
        ...state.data,
        shapes: state.data.shapes.map(
          shape => (shape.id === newShape.id ? newShape : shape)
        )
      }
    }))
  }

  onChangeMode(mode) {
    this.setState({mode})
  }

  render() {
    const currentDropTarget = this.state.connecting
      ? findAdjacentConnector(
          this.state.connecting.origin,
          this.state.connecting.x,
          this.state.connecting.y,
          this.state.data.shapes
        )
      : null

    return (
      <MuiThemeProvider theme={theme}>
        <DragDropContextProvider backend={HTML5Backend}>
          <div className={this.props.classes.appFrame}>
            <AppBar
              className={classNames(
                this.props.classes.appBar,
                this.props.classes[`appBar-right`]
              )}
            >
              <Toolbar>
                <IconButton
                  className={this.props.classes.menuButton}
                  color="inherit"
                  aria-label="Menu"
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="title"
                  color="inherit"
                  className={this.props.classes.flex}
                >
                  Kartograf
                </Typography>
                <Button color="inherit">
                  <ShareIcon />
                </Button>
                <Button color="inherit">
                  <FileDownloadIcon />
                </Button>
                <Button color="inherit">Sign in</Button>
              </Toolbar>
            </AppBar>
            <main className={this.props.classes.content}>
              <Options
                shapes={this.state.data.shapes}
                selected={this.state.selected}
                onChangeShape={this.onChangeShape}
              />
              <Toolbox
                mode={this.state.mode}
                onChangeMode={this.onChangeMode}
              />
              <Canvas
                data={this.state.data}
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
                isDrawable={
                  this.state.mode && this.state.mode.startsWith('draw')
                }
                isDrawableSquare={this.state.mode === 'drawIcon'}
              />
            </main>
          </div>
        </DragDropContextProvider>
      </MuiThemeProvider>
    )
  }
}

export default withStyles(styles)(App)
