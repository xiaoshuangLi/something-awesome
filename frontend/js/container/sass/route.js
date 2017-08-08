const rootRoute = {
  path: 'sass',
  component: require('js/components/App'),
  indexRoute: {
    component: require('./pages/Wave'),
  },
  childRoutes: [
    {
      path: 'wave',
      getComponent(location, cb) {
        require.ensure([], (require) => {
          cb(null, require('./pages/Wave'));
        });
      },
    },
    {
      path: 'sun',
      getComponent(location, cb) {
        require.ensure([], (require) => {
          cb(null, require('./pages/Sun'));
        });
      },
    },
    {
      path: 'swiper',
      getComponent(location, cb) {
        require.ensure([], (require) => {
          cb(null, require('./pages/Swiper'));
        });
      },
    },
    {
      path: 'mario',
      getComponent(location, cb) {
        require.ensure([], (require) => {
          cb(null, require('./pages/Mario'));
        });
      },
    },
  ],
};

export default rootRoute;
