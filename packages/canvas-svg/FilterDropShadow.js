import React from 'react'

const FilterDropShadow = ({id}) =>
  <filter id={id} x='-50%' y='-100%' width='200%' height='300%'>
    <feOffset in='SourceAlpha' result='offA' dy='6' />
    <feOffset in='SourceAlpha' result='offB' dy='1' />
    <feOffset in='SourceAlpha' result='offC' dy='3' />
    <feMorphology in='offC' result='spreadC' operator='erode' radius='1' />
    <feGaussianBlur in='offA' result='blurA' stdDeviation='5' />
    <feGaussianBlur in='offB' result='blurB' stdDeviation='9' />
    <feGaussianBlur in='spreadC' result='blurC' stdDeviation='2.5' />
    <feFlood floodOpacity='0.14' result='opA' />
    <feFlood floodOpacity='0.12' result='opB' />
    <feFlood floodOpacity='0.40' result='opC' />
    <feComposite in='opA' in2='blurA' result='shA' operator='in' />
    <feComposite in='opB' in2='blurB' result='shB' operator='in' />
    <feComposite in='opC' in2='blurC' result='shC' operator='in' />
    <feMerge>
      <feMergeNode in='shA' />
      <feMergeNode in='shB' />
      <feMergeNode in='shC' />
      <feMergeNode in='SourceGraphic' />
    </feMerge>
  </filter>

export default FilterDropShadow
