/// <reference path="cellar.config.ts" />
/// <reference path="cellar.controller.ts" />
/// <reference path="cellar.service.ts" />

namespace Cellar {
	
	export const cellarModule = angular
		.module('hawtio-cellar-cellar', [])
		.config(configureCellarRoutes)
		.run(configureCellarMainNav)
		.service("cellarService", CellarJolokiaService)
		.controller("CellarController", CellarController)
		.name;

}