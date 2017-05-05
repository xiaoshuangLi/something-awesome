const rootRoute = {
  path: 'home',
  component: require('js/components/App'),
  indexRoute: {
    component: require('./pages/Test'),
  },
  // childRoutes: [
  //   {
  //     path: 'list',
  //     getComponent(location, cb) {
  //       require.ensure([], (require) => {
  //         cb(null, require('./pages/List'));
  //       });
  //     },
  //   },
  // ],
};

export default rootRoute;
