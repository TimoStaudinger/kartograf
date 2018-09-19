import React from 'react'

import Shape from '../geo/Shape'
import Connection from '../geo/Connection'

import Canvas from './Canvas'

interface Props {
  onPrintDone(): void
  shapes: Shape[]
  connections: Connection[]
  shape: any // TODO
  theme: any // TODO
}

class Printer extends React.Component<Props> {
  private print: () => string = null

  componentDidMount() {
    if (this.print) {
      const data = this.print()
      const blob = new Blob([data], {type: 'image/svg+xml'})
      const filename = 'export.svg'

      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename)
      } else {
        var elem = window.document.createElement('a')
        elem.href = window.URL.createObjectURL(blob)
        elem.download = filename
        document.body.appendChild(elem)
        elem.click()
        document.body.removeChild(elem)
      }
    } else console.log('Not ready to render yet.')
    this.props.onPrintDone()
  }

  render() {
    const {shapes, connections, shape, theme} = this.props

    return (
      <Canvas
        connections={connections}
        shapes={shapes}
        theme={theme}
        shape={shape}
        printCallback={(print: () => string) => (this.print = print)}
        printMode
      />
    )
  }
}

export default Printer
