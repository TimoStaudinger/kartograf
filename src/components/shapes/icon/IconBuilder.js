import uuid from 'uuid/v4'

export const create = (x, y, width) => ({
  id: uuid(),
  type: 'icon',
  icon: 'Database',
  x,
  y,
  width,
  color: 5
})

