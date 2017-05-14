const rootRoute = {
  path: 'svg',
  component: require('js/components/App'),
  indexRoute: {
    component: require('./pages/Base'),
  },
  childRoutes: [
    {
      path: 'animate',
      getComponent(location, cb) {
        require.ensure([], (require) => {
          cb(null, require('./pages/Animate'));
        });
      },
    },
    {
      path: 'menu',
      getComponent(location, cb) {
        require.ensure([], (require) => {
          cb(null, require('./pages/Menu'));
        });
      },
    },
    {
      path: 'filter',
      getComponent(location, cb) {
        require.ensure([], (require) => {
          cb(null, require('./pages/Filter'));
        });
      },
    },
  ],
};

export default rootRoute;
