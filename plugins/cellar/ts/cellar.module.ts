/// <reference path="cellar/cellar.module.ts"/>

namespace Cellar {
  
  const module = angular.module('hawtio-cellar', [
    cellarModule
  ])
  .name;

  hawtioPluginLoader.addModule(module);
}