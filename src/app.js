//Using react properties module
import React from 'react';
import ReactDOM from 'react-dom'
import AppRouter from './routers/AppRouter'
import 'normalize.css/normalize.css'
import './styles/styles.scss';
import "regenerator-runtime/runtime.js";

ReactDOM.render( <AppRouter />, document.getElementById('app'));
