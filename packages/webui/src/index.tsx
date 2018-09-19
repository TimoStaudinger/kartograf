import React from 'react'
import ReactDOM from 'react-dom'

import Kartograf from './components/Kartograf'

import registerServiceWorker from './registerServiceWorker'

import './index.css'

ReactDOM.render(<Kartograf />, document.getElementById('root'))
registerServiceWorker()
