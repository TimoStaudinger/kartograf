import {create as createRect} from './rect/RectBuilder'
import {create as createIcon} from './icon/IconBuilder'

class ShapeBuilder {
  static create (x, y, width, height, type) {
    switch (type) {
      case 'icon':
        return createIcon(x, y, width)
      
      case 'rect':
      default:
        return createRect(x, y, width, height)
    }
  }
}

export default ShapeBuilder
