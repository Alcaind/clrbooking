'use strict';

angular.module('Items', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
])
    .controller('ItemsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', 'ClrStatusSrv', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, ClrStatusSrv, api) {

        $scope.ctrl = makeController.mainController('/items', 'itemTableConf', 'Κατάλογος Εξοπλισμού Αιθουσών');
        $scope.ctrl.init();
        $scope.itemtypes = [];
        $scope.statusOptions = ClrStatusSrv.getStatus('itemStatus');

        api.apiCall('GET', 'api/public/itemtype', function (results) {
            $scope.itemtypes = results.data;
        })

    }])
    .controller('ItemProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api) {

        $scope.ctrl = makeController.profileController('/items', 'itemTableConf');
        $scope.ctrl.init();
        $scope.itemtypes = [];

        api.apiCall('GET', 'api/public/itemtype', function (results) {
            $scope.itemtypes = results.data;
        })

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