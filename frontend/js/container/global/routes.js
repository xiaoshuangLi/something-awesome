const rootRoute = {
  path: '/',
  component: require('./components/App'),
  childRoutes: [
    require('js/container/home/route'),
    require('js/container/sass/route'),
    {
      path: '*',
      getComponent: () => {
        console.log(1);
      },
    },
  ],
};

export default rootRoute;