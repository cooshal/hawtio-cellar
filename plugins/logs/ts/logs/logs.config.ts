/// <reference path="logs.service.ts"/>

namespace Logs {

  export function configureLogsRoutes($routeProvider: ng.route.IRouteProvider) {
    'ngInject';
    $routeProvider.when('/logs', {template: '<logs></logs>'});
  }

  export function configureLogsHelp(helpRegistry, logsService: LogsService) {
    'ngInject';
    helpRegistry.addUserDoc('log', 'plugins/logs/doc/help.md', () => {
      return logsService.hasLogQueryMBean();
    });
  }

  export function configureLogsMainNav(mainNavService: Nav.MainNavService, logsService: LogsService) {
    'ngInject';
    mainNavService.addItem({
      title: 'Logs',
      href: '/logs',
      isValid: () => logsService.hasLogQueryMBean(),
      rank: -1
    });
  }

}
