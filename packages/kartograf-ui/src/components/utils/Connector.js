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
    this.props.dropConnector()
  }

  render () {
    const {isSelected, isConnecting, isConnectingMe, isPotentialDropTarget, isCurrentDropTarget, moveConnector, draggedX, draggedY, originX, originY} = this.props

    return (isSelected || isConnectingMe || isPotentialDropTarget) && !(isConnecting && !(isConnectingMe || isPotentialDropTarget)) ? (
      <g>
        {isConnectingMe ? (
          <line
            x1={draggedX}
            y1={draggedY}
            x2={originX}
            y2={originY}
            strokeWidth={1}
            stroke='#AAA'
          />
        ) : null}

        <DraggableCore
          onDrag={(_, d) => moveConnector(d.deltaX, d.deltaY)}
          onStart={this.dragStart}
          onStop={this.dragStop}
        >
          <circle
            cx={draggedX || originX}
            cy={draggedY || originY}
            fill={isCurrentDropTarget ? 'orange' : '#EEE'}
            stroke={isCurrentDropTarget ? 'red' : '#555'}
            r={isConnectingMe ? 6 : isPotentialDropTarget ? 8 : 4}
            strokeWidth={0.5}
          />
        </DraggableCore>
      </g>
    ) : null
  }
}

export default Connector
