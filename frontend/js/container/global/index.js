import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, browserHistory } from 'react-router';

import store from './store';
import routes from './routes';

const history = syncHistoryWithStore(browserHistory, store);

export default (
  <Provider store={store}>
    <Router routes={routes} history={history} />
  </Provider>
);

