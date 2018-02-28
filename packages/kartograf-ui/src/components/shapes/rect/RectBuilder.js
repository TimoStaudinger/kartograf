import uuid from 'uuid/v4'

export const create = (x, y, width, height) => ({
  id: uuid(),
  type: 'rect',
  x,
  y,
  width,
  height,
  color: 0
})

