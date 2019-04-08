namespace Cellar {

  export function configureCellarRoutes($routeProvider: ng.route.IRouteProvider) {

    'ngInject';
    $routeProvider
      .when('/cellar', {template: '<h3>Cellar Index</h3>'})
      .when('/cellar/config', {templateUrl: 'plugins/cellar/html/cellar-index.html'});
  }

  export function configureCellarMainNav(mainNavService: Nav.MainNavService) {
    'ngInject';
    mainNavService.addItem({
      title: 'Cellar',
      basePath: '/cellar',
      isValid: () => true,
      rank: -1
    });
  }

}