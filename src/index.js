import React from 'react';
import ReactDOM from 'react-dom';
import './static/css/index.css';
import './static/css/fontawesome-all.min.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
