import uuid from 'uuid/v4'

const createRect = ({x, y, type}) => ({
  id: uuid(),
  x: x - 100,
  y: y - 50,
  width: 200,
  height: 100,
  color: 0
})

class ShapeBuilder {
  static create (shape) {
    return createRect(shape)
  }
}

export default ShapeBuilder
