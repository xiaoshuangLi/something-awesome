const rootRoute = {
  path: 'canvas',
  component: require('js/components/App'),
  indexRoute: {
    component: require('./pages/Spot'),
  },
  childRoutes: [
    {
      path: 'spot',
      getComponent(location, cb) {
        require.ensure([], (require) => {
          cb(null, require('./pages/Spot'));
        });
      },
    },
    {
      path: 'view',
      getComponent(location, cb) {
        require.ensure([], (require) => {
          cb(null, require('./pages/View'));
        });
      },
    },
    {
      path: 'music',
      getComponent(location, cb) {
        require.ensure([], (require) => {
          cb(null, require('./pages/Music'));
        });
      },
    },
  ],
};

export default rootRoute;
