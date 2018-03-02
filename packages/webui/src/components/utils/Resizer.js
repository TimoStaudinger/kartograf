import React from 'react'
import {DraggableCore} from 'react-draggable'

const Resizer = ({id, position, x, y, onResize, isSelected, isConnecting}) => isSelected && !isConnecting ? (
  <DraggableCore
    onDrag={(_, d) => onResize(id, position, d.deltaX, d.deltaY)}
  >
    <rect
      x={x - 4}
      y={y - 4}
      rx={1}
      ry={1}
      width={8}
      height={8}
      fill='#999'
      stroke='#555'
      strokeWidth={0.5}
    />
  </DraggableCore>
) : null

export default Resizer
