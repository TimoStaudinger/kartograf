import React from 'react'
import RectOptions from './rect/RectOptions'
import IconOptions from './icon/IconOptions'

class ShapeOptions extends React.PureComponent {
  render() {
    if (this.props.shape) {
      switch (this.props.shape.type) {
        case 'icon':
          return <IconOptions {...this.props} />

        case 'rect':
        default:
          return <RectOptions {...this.props} />
      }
    } else return null
  }
}

export default ShapeOptions
