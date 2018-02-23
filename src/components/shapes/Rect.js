import React from 'react'
import {DraggableCore} from 'react-draggable'
import Connector from '../utils/Connector'
import Resizer from '../utils/Resizer'

const Rect = ({id, x, y, label, height, width, color, filter, connections, moveRect, moveConnector, dropConnector, onResize, currentDropTarget, onSelect, selected}) =>
  <g>
    <DraggableCore onDrag={(_, d) => moveRect(id, d.deltaX, d.deltaY)}>
      <g onClick={() => onSelect(id)}>
        <rect
          id={id}
          x={x}
          y={y}
          rx={2}
          ry={2}
          height={height}
          width={width}
          fill={color.primary}
          style={{filter: `url(#${filter})`}}
        />
        <path fill="#000000" d="M12,17.5C14.33,17.5 16.3,16.04 17.11,14H6.89C7.69,16.04 9.67,17.5 12,17.5M8.5,11A1.5,1.5 0 0,0 10,9.5A1.5,1.5 0 0,0 8.5,8A1.5,1.5 0 0,0 7,9.5A1.5,1.5 0 0,0 8.5,11M15.5,11A1.5,1.5 0 0,0 17,9.5A1.5,1.5 0 0,0 15.5,8A1.5,1.5 0 0,0 14,9.5A1.5,1.5 0 0,0 15.5,11M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
        <text
          x={x + width / 2}
          y={y + height / 2}
          fontSize={Math.min(30, height - 10)}
          fontFamily='Roboto'
          fill={color.text}
          textAnchor='middle'
          alignmentBaseline='central'
        >
          {label}
        </text>

      </g>
    </DraggableCore>

    {selected.find(s => s === id) ? <g>
      <Resizer
        id={id}
        position='topLeft'
        x={x}
        y={y}
        onResize={onResize}
      />
      <Resizer
        id={id}
        position='topRight'
        x={x + width}
        y={y}
        onResize={onResize}
      />
      <Resizer
        id={id}
        position='bottomLeft'
        x={x}
        y={y + height}
        onResize={onResize}
      />
      <Resizer
        id={id}
        position='bottomRight'
        x={x + width}
        y={y + height}
        onResize={onResize}
      />

      <Connector
        x={(connections.right && connections.right.x) || x + width}
        y={(connections.right && connections.right.y) || y + (height / 2)}
        originX={x + width}
        originY={y + (height / 2)}
        id={id}
        position='right'
        connectedTo={connections.right.connectedTo}
        moveConnector={moveConnector}
        dropConnector={dropConnector}
        currentDropTarget={currentDropTarget}
      />

      <Connector
        x={(connections.left && connections.left.x) || x}
        y={(connections.left && connections.left.y) || y + (height / 2)}
        originX={x}
        originY={y + (height / 2)}
        id={id}
        position='left'
        connectedTo={connections.left.connectedTo}
        moveConnector={moveConnector}
        dropConnector={dropConnector}
        currentDropTarget={currentDropTarget}
      />

      <Connector
        x={(connections.top && connections.top.x) || x + (width / 2)}
        y={(connections.top && connections.top.y) || y}
        originX={x + (width / 2)}
        originY={y}
        id={id}
        position='top'
        connectedTo={connections.top.connectedTo}
        moveConnector={moveConnector}
        dropConnector={dropConnector}
        currentDropTarget={currentDropTarget}
      />

      <Connector
        x={(connections.bottom && connections.bottom.x) || x + (width / 2)}
        y={(connections.bottom && connections.bottom.y) || y + height}
        originX={x + (width / 2)}
        originY={y + height}
        id={id}
        position='bottom'
        connectedTo={connections.bottom.connectedTo}
        moveConnector={moveConnector}
        dropConnector={dropConnector}
        currentDropTarget={currentDropTarget}
      />
    </g> : null}
  </g>

export default Rect
