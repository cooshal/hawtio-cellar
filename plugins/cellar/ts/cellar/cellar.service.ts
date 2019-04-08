/// <reference path="node.ts" />

namespace Cellar {
    
    export class CellarJolokiaService {

        constructor(private $q: ng.IQService, $http) {
            'ngInject';
        }

        getNodes(): ng.IPromise<Node[]> {
            return this.fetchNodes();
        }


        private fetchNodes(): ng.IPromise<Node[]> {
            return null;
        }

    }

}