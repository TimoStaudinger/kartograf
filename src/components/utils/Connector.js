import React from 'react'
import {DraggableCore} from 'react-draggable'

class Connector extends React.Component {
  constructor (props) {
    super(props)

    this.dragStart = this.dragStart.bind(this)
    this.dragStop = this.dragStop.bind(this)

    this.state = {
      dragging: false
    }
  }

  dragStart () {
    this.setState({dragging: true})
  }

  dragStop () {
    this.setState({dragging: false})
    this.props.dropConnector(this.props.id, this.props.position)
  }

  render () {
    return (
      <g>
        <line
          x1={this.props.x}
          y1={this.props.y}
          x2={this.props.originX}
          y2={this.props.originY}
          strokeWidth={1}
          stroke='#AAA'
        />
        {!this.props.connectedTo ? (
          <DraggableCore
            onDrag={(_, d) => this.props.moveConnector(this.props.id, this.props.position, d.deltaX, d.deltaY)}
            onStart={this.dragStart}
            onStop={this.dragStop}
          >
            <circle
              cx={this.props.x}
              cy={this.props.y}
              fill='#EEE'
              stroke={this.props.currentDropTarget && this.props.currentDropTarget.id === this.props.id && this.props.currentDropTarget.position === this.props.position
                ? 'red'
                : '#555'
              }
              r={this.state.dragging ? 6 : 4}
              strokeWidth={0.5}
            />
          </DraggableCore>
        ) : null}
      </g>
    )
  }
}

export default Connector
