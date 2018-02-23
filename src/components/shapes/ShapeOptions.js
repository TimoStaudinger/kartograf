import React from 'react'
import RectOptions from './RectOptions';

const ShapeOptions = (props) => {
  if (props.shape) {
    switch (props.shape.type) {
      default:
        return <RectOptions {...props} />
    }
  } else return null
}

export default ShapeOptions
