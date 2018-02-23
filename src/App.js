import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import { withStyles } from 'material-ui/styles';
import uuid from 'uuid/v4'
import classNames from 'classnames';
import Canvas from './components/Canvas'
import Sidebar from './components/Sidebar'
import colors from './colors'

const sidebarWidth = 400

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: 430,
    marginTop: theme.spacing.unit * 3,
    zIndex: 1,
    overflow: 'hidden',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
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
    width: sidebarWidth,
  },
  drawerHeader: theme.mixins.toolbar,
  content: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    height: 'calc(100% - 64px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      marginTop: 64,
    },
  },
  formControl: {
    margin: theme.spacing.unit,
  },
})

const rectTemplate = {
  strokeWidth: 0
}

const snapTo = (grid, value) => {
  const rem = value % grid
  if (rem < grid / 2) {
    return value - rem
  } else {
    return value - rem + grid
  }
}

const rand = (min, max) => Math.round((Math.random() * (max - min))) + min
const generateRect = () => ({
  ...rectTemplate,
  id: uuid(),
  x: rand(0, 30) * 20,
  y: rand(0, 30) * 20,
  width: rand(1, 2) * 80,
  height: rand(1, 2) * 80,
  color: rand(0, colors.length - 1),
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

const findAdjacentConnector = (id, x, y, shapes) => {
  const threshold = 20

  let connector = null
  shapes.find(o => {
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

class App extends Component {
  constructor (props) {
    super(props)

    this.onDropConnector = this.onDropConnector.bind(this)
    this.onMoveConnector = this.onMoveConnector.bind(this)
    this.onMoveRect = this.onMoveRect.bind(this)
    this.onResize = this.onResize.bind(this)
    this.onAddRect = this.onAddRect.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.onClearSelection = this.onClearSelection.bind(this)
    this.onChangeShape = this.onChangeShape.bind(this)

    this.state = {
      data: {
        shapes: [],
        currentDropTarget: null,
        selected: []
      },
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

  onMoveConnector (id, connector, dx, dy) {
    this.setState(state => {
      const prevRect = state.data.shapes.find(r => r.id === id)
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
        data: {
          ...state.data,
          shapes: state.data.shapes.map(r => r.id === id
            ? newRect
            : r
          ),
          currentDropTarget: findAdjacentConnector(
            id,
            newRect.connections[connector].x,
            newRect.connections[connector].y,
            state.data.shapes
          )
        }
      }
    })
  }

  onDropConnector (id, connector) {
    this.setState(state => ({
      data: {
        ...state.data,
        shapes: state.data.shapes.map(r => r.id === id
          ? {
            ...r,
            connections: {
              ...r.connections,
              [connector]: {connectedTo: state.currentDropTarget}
            }}
          : r
        ),
        currentDropTarget: null
      }
    }))
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
  
  onAddRect () {
    this.setState(state => ({
      data: {
        ...state.data,
        shapes: [...state.data.shapes, generateRect()]
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
    return (
      <div className={this.props.classes.appFrame}>
        <AppBar className={classNames(this.props.classes.appBar, this.props.classes[`appBar-right`])}>
          <Toolbar>
            <IconButton className={this.props.classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={this.props.classes.flex}>
              Kartograf
            </Typography>
            <Button color="inherit" onClick={this.onAddRect}>Add element</Button>
          </Toolbar>
        </AppBar>
        <main className={this.props.classes.content}>
          <Canvas
            data={this.state.data}
            selected={this.state.selected}
            onMoveRect={this.onMoveRect}
            onMoveConnector={this.onMoveConnector}
            onDropConnector={this.onDropConnector}
            onResize={this.onResize}
            onSelect={this.onSelect}
            onClearSelection={this.onClearSelection}
          />
        </main>
        <Sidebar
          shapes={this.state.data.shapes}
          selected={this.state.selected}
          onChangeShape={this.onChangeShape}
        />
      </div>
    )
  }
}

export default withStyles(styles)(App)
