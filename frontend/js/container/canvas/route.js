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
  ],
};

export default rootRoute;