import React from 'react';
import ReactDOM from 'react-dom';
import {
    Provider
} from 'react-redux';
import store from './reducers';
import router from './router';

// Render the main component into the dom
ReactDOM.render(
    <Provider store={store}>
        {router}
    </Provider>, document.getElementById('app'));
