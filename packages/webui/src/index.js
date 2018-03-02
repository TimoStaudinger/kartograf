import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Kartograf from './components/Kartograf';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Kartograf />, document.getElementById('root'));
registerServiceWorker();
