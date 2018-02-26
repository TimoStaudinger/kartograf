import React from 'react'
import RectOptions from './rect/RectOptions'
import IconOptions from './icon/IconOptions'

const ShapeOptions = (props) => {
  if (props.shape) {
    switch (props.shape.type) {
      case 'icon':
        return <IconOptions {...props} />

      case 'rect':
      default:
        return <RectOptions {...props} />
    }
  } else return null
}

export default ShapeOptions
