import uuid from 'uuid/v4'

const createRect = (x, y, width, height) => ({
  id: uuid(),
  type: 'rect',
  x,
  y,
  width,
  height,
  color: 0
})

class ShapeBuilder {
  static create (x, y, width, height, type = 'rect') {
    return createRect(x, y, width, height)
  }
}

export default ShapeBuilder
