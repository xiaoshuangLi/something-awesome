const rootRoute = {
  path: '/',
  component: require('./components/App'),
  childRoutes: [
    require('js/container/home/route'),
    {
      path: '*',
      getComponent: () => {
        console.log(1);
      },
    },
  ],
};

export default rootRoute;