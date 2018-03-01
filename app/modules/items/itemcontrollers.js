'use strict';

angular.module('Items', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
])
    .controller('ItemsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv) {

    $scope.ctrl = makeController.mainController('/items', 'itemTableConf', 'Κατάλογος Εξοπλισμού Αιθουσών');
    $scope.ctrl.init();
}])
    .controller('ItemProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api) {

        $scope.ctrl = makeController.profileController('/items', 'itemTableConf');
        $scope.ctrl.init();

    }])
    .component('itemsProfile', {
        restrict: 'EA',
        templateUrl: 'modules/items/itemviews/iprofile.html',
        scope: {
            method: '='
        },
        controller: 'ItemProfileController'
    })

;