import React from 'react'
import {DraggableCore} from 'react-draggable'

const Grid = ({onClearSelection, onStartDrawing, onDraw, onStopDrawing}) => [
  <rect x={0} y={0} width='100%' height='100%' fill='#ddd' onClick={onClearSelection} />,
  <DraggableCore
    onStart={(_, d) => onStartDrawing(d.lastX, d.lastY)}
    onStop={(_, d) => onStopDrawing()}
    onDrag={(_, d) => onDraw(d.deltaX, d.deltaY)}
  >
    <rect x={0} y={0} width='100%' height='100%' fill='url(#grid)' onClick={onClearSelection} />
  </DraggableCore>
]

export default Grid
