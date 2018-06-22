import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const array = [];

ReactDOM.render(
    <App data={array} />,
    document.getElementById('root')
);
registerServiceWorker();
