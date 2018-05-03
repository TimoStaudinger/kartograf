import React from 'react'
import {DraggableCore} from 'react-draggable'

const getBufferedDimensions = (viewBox, interval) => ({
  x: (Math.floor(viewBox.x / interval) - 10) * interval,
  y: (Math.floor(viewBox.y / interval) - 10) * interval,
  width: viewBox.width * 2,
  height: viewBox.height * 2
})

const Grid = ({
  onClick,
  onStartDrag,
  onDrag,
  onStopDrag,
  viewBox,
  interval = 20
}) => [
  <rect
    {...getBufferedDimensions(viewBox, interval)}
    fill="#efefef"
    onClick={onClick}
    key="background"
  />,
  <DraggableCore
    onStart={(_, d) => onStartDrag(d.lastX, d.lastY)}
    onStop={(_, d) => onStopDrag()}
    onDrag={(_, d) => onDrag(d.deltaX, d.deltaY)}
    key="grid"
  >
    <rect
      {...getBufferedDimensions(viewBox, interval)}
      fill="url(#grid)"
      onClick={onClick}
    />
  </DraggableCore>
]

export default Grid
