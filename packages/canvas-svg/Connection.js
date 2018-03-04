import React from 'react'

const Connection = ({fromCoords, toCoords}) =>
  <line
    x1={fromCoords.x}
    y1={fromCoords.y}
    x2={toCoords.x}
    y2={toCoords.y}
    strokeWidth={2}
    stroke='#999'
  />

export default Connection
