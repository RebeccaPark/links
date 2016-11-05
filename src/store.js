import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';

import reducer from './reducers';

export function configureStore(initialState) {
  const store = createStore(reducer, initialState,
                            applyMiddleware(thunk, routerMiddleware(browserHistory)));

  if (module.hot) {
    module.hot.accept('./reducers', () =>
      // eslint-disable-next-line global-require
      store.replaceReducer(require('./reducers').default));
  }

  return store;
}

const store = configureStore();
export default store;
