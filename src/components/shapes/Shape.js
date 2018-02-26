import React from 'react'
import Rect, {getConnectorPosition as getConnectorPositionRect, getConnectors as getConnectorsRect} from './rect/Rect'
import Icon, {getConnectorPosition as getConnectorPositionIcon, getConnectors as getConnectorsIcon} from './icon/Icon'

export const getConnectors = shape => {
  switch (shape.type) {
    case 'icon':
      return getConnectorsIcon()
    
    case 'rect':
    default:
      return getConnectorsRect()
  }
}
export const getConnectorPosition = (shape, connector) => {
  switch (shape.type) {
    case 'icon':
      return getConnectorPositionIcon(shape, connector)
    
    case 'rect':
    default:
      return getConnectorPositionRect(shape, connector)
  }
}

const Shape = props => {
  switch (props.type) {
    case 'icon': 
      return <Icon {...props} />

    case 'rect':
    default:
      return <Rect {...props} />
  }
}

export default Shape
