import React from 'react'
import {DraggableCore} from 'react-draggable'
import Connector from '../../components/utils/Connector'
import Resizer from '../../components/utils/Resizer'

const connectors = ['top', 'bottom', 'left', 'right']
export const getConnectors = () => connectors

export const getConnectorPosition = ({x, y, width, height}, connector) => {
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

const Rect = ({id, x, y, label, height, width, color, filter, connections, moveRect, moveConnector, dropConnector, onResize, currentDropTarget, onSelect, isSelected, isConnecting, isConnectingMe, connecting}) =>
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

    <Resizer
      id={id}
      position='topLeft'
      x={x}
      y={y}
      onResize={onResize}
      isSelected={isSelected}
      isConnecting={isConnecting}
    />
    <Resizer
      id={id}
      position='topRight'
      x={x + width}
      y={y}
      onResize={onResize}
      isSelected={isSelected}
      isConnecting={isConnecting}
    />
    <Resizer
      id={id}
      position='bottomLeft'
      x={x}
      y={y + height}
      onResize={onResize}
      isSelected={isSelected}
      isConnecting={isConnecting}
    />
    <Resizer
      id={id}
      position='bottomRight'
      x={x + width}
      y={y + height}
      onResize={onResize}
      isSelected={isSelected}
      isConnecting={isConnecting}
    />

    <Connector
      draggedX={isConnectingMe && connecting.origin.connector === 'right' ? connecting.x : null}
      draggedY={isConnectingMe && connecting.origin.connector === 'right' ? connecting.y : null}
      originX={x + width}
      originY={y + (height / 2)}
      moveConnector={(dx, dy) => moveConnector({id, connector: 'right'}, dx, dy)}
      dropConnector={dropConnector}
      isCurrentDropTarget={currentDropTarget === 'right'}
      isPotentialDropTarget={!isConnectingMe && isConnecting}
      isSelected={isSelected}
      isConnecting={isConnecting}
      isConnectingMe={isConnectingMe && connecting.origin.connector === 'right'}
    />

    <Connector
      draggedX={isConnectingMe && connecting.origin.connector === 'left' ? connecting.x : null}
      draggedY={isConnectingMe && connecting.origin.connector === 'left' ? connecting.y : null}
      originX={x}
      originY={y + (height / 2)}
      moveConnector={(dx, dy) => moveConnector({id, connector: 'left'}, dx, dy)}
      dropConnector={dropConnector}
      isCurrentDropTarget={currentDropTarget === 'left'}
      isPotentialDropTarget={!isConnectingMe && isConnecting}
      isSelected={isSelected}
      isConnecting={isConnecting}
      isConnectingMe={isConnectingMe && connecting.origin.connector === 'left'}
    />

    <Connector
      draggedX={isConnectingMe && connecting.origin.connector === 'top' ? connecting.x : null}
      draggedY={isConnectingMe && connecting.origin.connector === 'top' ? connecting.y : null}
      originX={x + (width / 2)}
      originY={y}
      moveConnector={(dx, dy) => moveConnector({id, connector: 'top'}, dx, dy)}
      dropConnector={dropConnector}
      isCurrentDropTarget={currentDropTarget === 'top'}
      isPotentialDropTarget={!isConnectingMe && isConnecting}
      isSelected={isSelected}
      isConnecting={isConnecting}
      isConnectingMe={isConnectingMe && connecting.origin.connector === 'top'}
    />

    <Connector
      draggedX={isConnectingMe && connecting.origin.connector === 'bottom' ? connecting.x : null}
      draggedY={isConnectingMe && connecting.origin.connector === 'bottom' ? connecting.y : null}
      originX={x + (width / 2)}
      originY={y + height}
      moveConnector={(dx, dy) => moveConnector({id, connector: 'bottom'}, dx, dy)}
      dropConnector={dropConnector}
      isCurrentDropTarget={currentDropTarget === 'bottom'}
      isPotentialDropTarget={!isConnectingMe && isConnecting}
      isSelected={isSelected}
      isConnecting={isConnecting}
      isConnectingMe={isConnectingMe && connecting.origin.connector === 'bottom'}
    />
  </g>

export default Rect
