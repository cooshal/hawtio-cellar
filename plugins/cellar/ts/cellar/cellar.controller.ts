/// <reference path="cellar.service.ts" />

namespace Cellar {

    export function CellarController(
        $scope,
        $http,
        cellarService: CellarJolokiaService
    ) 
    {
        'ngInject';
        $scope.nodes = "node1, node2";

        // $http
        //     .get('http://localhost:8088/api.php')
        //     .then(function(response) {
        //         $scope.nodeList = response.data;
        //     },
        //     function(error){
        //         console.log(error);
        //     });

    }


    // export class CellarController {

    //     // constructor(cellarService: CellarJolokiaService) {
    //     //     'ngInject';
    //     // }

    //     nodes = "node1, node2, node3";

    //     getNodes(): string {
    //         return this.nodes;
    //     }
    // }


    // export const cellarComponent: angular.IComponentOptions = {
    //     templateUrl: 'plugins/sample-plugin/html/cellar-index.html',
    //     controller: CellarController
    // };

}