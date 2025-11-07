import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router as BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import './index.scss';
import App from './App.tsx';

const history = createBrowserHistory();

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <BrowserRouter history={history}>
    <App />
  </BrowserRouter>
);
