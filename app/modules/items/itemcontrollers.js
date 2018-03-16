'use strict';

angular.module('Items', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
])
    .controller('ItemsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', 'ClrStatusSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv, ClrStatusSrv) {

        $scope.ctrl = makeController.mainController('/items', 'itemTableConf', 'Κατάλογος Εξοπλισμού Αιθουσών');
        $scope.ctrl.init();

        $scope.statusOptions = ClrStatusSrv.getStatus('itemStatus');

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