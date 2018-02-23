import React from 'react'
import Rect from './Rect'

const Shape = props => {
  switch (props.type) {
    default:
      return <Rect {...props} />
  }
}

export default Shape
