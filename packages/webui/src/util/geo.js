import {getConnectorPosition, getConnectors} from '../components/shapes/Shape'

export const findAdjacentConnector = (origin, x, y, shapes, threshold = 20) => {
  const originShape = shapes.find(s => s.id === origin.id)

  let adjacentConnector = null
  shapes.find(shape => {
    if (shape === originShape) return false

    const connectors = getConnectors(shape)
    return connectors.find(connector => {
      const connectorPosition = getConnectorPosition(shape, connector)
      if (
        Math.abs(connectorPosition.x - x) < threshold &&
        Math.abs(connectorPosition.y - y) < threshold
      ) {
        adjacentConnector = {
          id: shape.id,
          connector
        }
        return true
      }

      return false
    })
  })

  return adjacentConnector
}
