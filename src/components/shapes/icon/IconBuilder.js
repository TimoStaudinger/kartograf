import uuid from 'uuid/v4'

export const create = (x, y, width) => ({
  id: uuid(),
  type: 'icon',
  x,
  y,
  width,
  color: 5
})

