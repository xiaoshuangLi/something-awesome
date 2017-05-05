import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import { browserHistory } from 'react-router';
import reducers from './reducers';
import promiseThunk from './promiseThunk';

const configureStore = (history, initialState) => {
  const reduxRouterMiddleware = routerMiddleware(history);

  const middleware = [reduxRouterMiddleware, thunkMiddleware, promiseThunk];

  let finalCreateStore = applyMiddleware(...middleware)(createStore);

  const reducer = combineReducers({
    ...reducers,
    routing: routerReducer,
  });

  const store = finalCreateStore(reducer, initialState);

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextReducer = combineReducers({
        ...reducers,
        routing: routerReducer,
      });
      store.replaceReducer(nextReducer);
    });
  }

  return store;
};

let initState;
if (window.__data) {
  initState = window.__data;
}


const store = configureStore(browserHistory, initState);
export default store;
