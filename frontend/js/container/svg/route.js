const rootRoute = {
  path: 'svg',
  component: require('js/components/App'),
  indexRoute: {
    component: require('./pages/Base'),
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
