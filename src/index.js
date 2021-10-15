import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import store from './store';
import { init as appInitAction} from './store/app/actions'

store.dispatch(appInitAction());
const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
        <ToastContainer />
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
serviceWorker.unregister();
