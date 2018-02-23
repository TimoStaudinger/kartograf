import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import { withStyles } from 'material-ui/styles';
import uuid from 'uuid/v4'
import Canvas from './Canvas'

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
}

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

class App extends Component {
  constructor (props) {
    super(props)

    this.onDropConnector = this.onDropConnector.bind(this)
    this.onMoveConnector = this.onMoveConnector.bind(this)
    this.onMoveRect = this.onMoveRect.bind(this)
    this.onResize = this.onResize.bind(this)
    this.onAddRect = this.onAddRect.bind(this)

    this.state = {
      data: {
        rects: [],
        currentDropTarget: null,
        selected: []
      }
    }
  }

  onMoveRect (id, dx, dy) {
    this.setState(state => ({
      data: {
        ...state.data,
        rects: state.data.rects.map(r => r.id === id
          ? {...r, x: r.x + dx, y: r.y + dy}
          : r
        )
      }
    }))
  }

  onMoveConnector (id, connector, dx, dy) {
    this.setState(state => {
      const prevRect = state.data.rects.find(r => r.id === id)
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
          rects: state.data.rects.map(r => r.id === id
            ? newRect
            : r
          ),
          currentDropTarget: findAdjacentConnector(
            id,
            newRect.connections[connector].x,
            newRect.connections[connector].y,
            state.data.rects
          )
        }
      }
    })
  }

  onDropConnector (id, connector) {
    this.setState(state => ({
      data: {
        ...state.data,
        rects: state.data.rects.map(r => r.id === id
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
    let newRect = this.state.data.rects.find(r => r.id === id)

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
        rects: state.data.rects.map(r => r.id === id ? newRect : r)
      }
    }))
  }
  
  onAddRect () {
    this.setState(state => ({
      data: {
        ...state.data,
        rects: [...state.data.rects, generateRect()]
      }
    }))
  }

  render () {
    return (
      <div>
        <AppBar position='static'>
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
        <Canvas
          data={this.state.data}
          onMoveRect={this.onMoveRect}
          onMoveConnector={this.onMoveConnector}
          onDropConnector={this.onDropConnector}
          onResize={this.onResize}
        />
      </div>
    )
  }
}

export default withStyles(styles)(App)
