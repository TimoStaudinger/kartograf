import uuid from 'uuid/v4'

const rand = (min, max) => Math.round((Math.random() * (max - min))) + min
const createRect = ({x, y, type}) => ({
  id: uuid(),
  x: x - 100,
  y: y - 50,
  width: 200,
  height: 100,
  color: 0,
  connections: {
    left: {connectedTo: null},
    right: {connectedTo: null},
    top: {connectedTo: null},
    bottom: {connectedTo: null}
  }
})

class ShapeBuilder {
  static create (shape) {
    return createRect(shape)
  }
}

export default ShapeBuilder
