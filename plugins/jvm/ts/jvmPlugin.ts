/// <reference path="connect/connect.module.ts"/>
/// <reference path="jvm.component.ts"/>

namespace JVM {

  export const _module = angular
    .module(pluginName, [ConnectModule])
    .config(defineRoutes)
    .constant('mbeanName', 'hawtio:type=JVMList')
    .run(configurePlugin)
    .component("jvm", jvmComponent);

  function defineRoutes(configManager: Core.ConfigManager) {
    'ngInject';

    configManager
      .addRoute('/jvm/connect', { template: '<connect></connect>' })
      .addRoute('/jvm/connect-login', { template: '<connect-login></connect-login>' })
      .addRoute('/jvm/welcome', { templateUrl: UrlHelpers.join(templatePath, 'welcome.html') })
      .addRoute('/jvm/discover', { templateUrl: UrlHelpers.join(templatePath, 'discover.html') })
      .addRoute('/jvm/local', { templateUrl: UrlHelpers.join(templatePath, 'local.html') });
  }

  function configurePlugin(
    mainNavService: Nav.MainNavService,
    $location: ng.ILocationService,
    viewRegistry,
    helpRegistry: Help.HelpRegistry,
    preferencesRegistry: Core.PreferencesRegistry,
    ConnectOptions: ConnectOptions,
    preLogoutTasks: Core.Tasks,
    locationChangeStartTasks: Core.ParameterizedTasks,
    HawtioDashboard,
    HawtioExtension: Core.HawtioExtension,
    $templateCache: ng.ITemplateCacheService,
    $compile: ng.ICompileService): void {
    'ngInject';

    viewRegistry['jvm'] = "plugins/jvm/html/layoutConnect.html";

    HawtioExtension.add('hawtio-header', ($scope) => {
      let template = $templateCache.get<string>(UrlHelpers.join(templatePath, 'navbarHeaderExtension.html'));
      return $compile(template)($scope);
    });

    if (!HawtioDashboard.inDashboard) {
      // ensure that if the connection parameter is present, that we keep it
      locationChangeStartTasks.addTask('ConParam', ($event: ng.IAngularEvent, newUrl: string, oldUrl: string) => {
        // we can't execute until the app is initialized...
        if (!HawtioCore.injector) {
          return;
        }
        if (!ConnectOptions || !ConnectOptions.name || !newUrl) {
          return;
        }
        let newQuery: any = new URI(newUrl).query(true);
        if (!newQuery.con) {
          newQuery['con'] = ConnectOptions.name;
          $location.search(newQuery);
        }
      });
    }

    // clean up local storage upon logout
    preLogoutTasks.addTask('CleanupJvmConnectCredentials', () => {
      log.debug("Clean up credentials from JVM connection settings in local storage");
      let connections = loadConnections();
      connections.forEach((connection) => {
        delete connection.userName;
        delete connection.password;
      });
      saveConnections(connections);
    });

    helpRegistry.addUserDoc('jvm', 'plugins/jvm/doc/help.md');
    preferencesRegistry.addTab("Connect", 'plugins/jvm/html/reset.html');
    preferencesRegistry.addTab("Jolokia", "plugins/jvm/html/jolokia-preferences.html");

    mainNavService.addItem({
      title: 'Connect',
      href: '/jvm',
      template: '<jvm></jvm>',
      isValid: () => ConnectOptions == null || ConnectOptions.name == null
    });    
  }

  hawtioPluginLoader.addModule(pluginName);
}
