import React from 'react'
import Rect, {getConnectorPosition as getConnectorPositionRect, getConnectors as getConnectorsRect} from './rect/Rect'

export const getConnectors = shape => {
  switch (shape.type) {
    default:
      return getConnectorsRect()
  }
}
export const getConnectorPosition = (shape, connector) => {
  switch (shape.type) {
    default:
      return getConnectorPositionRect(shape, connector)
  }
}

const Shape = props => {
  switch (props.type) {
    default:
      return <Rect {...props} />
  }
}

export default Shape
