import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

// eslint-disable-next-line no-unused-vars
import styles from '../scss/styles.scss';
import store from './store';
import IndexPage from './layouts/IndexPage';

const history = syncHistoryWithStore(browserHistory, store);

// eslint-disable-next-line no-undef
window.init = () => {
  render(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={IndexPage} />
      </Router>
    </Provider>,
    // eslint-disable-next-line no-undef
    document.getElementById('root')
  );
};
