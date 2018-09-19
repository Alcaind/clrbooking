'use strict';

angular.module('Config', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
])
    .controller('ConfigController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', 'ClrStatusSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv, ClrStatusSrv) {

        $scope.ctrl = makeController.mainController('/config', 'configTableConf', 'Configuration');
        $scope.statusOptions = globalVarsSrv.getGlobalVar('configStatus');
        $scope.ctrl.init();

    }])
    .controller('ConfigProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', 'ClrStatusSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api, ClrStatusSrv) {
        $scope.ctrl = makeController.profileController('/config', 'configTableConf');
        $scope.statusOptions = globalVarsSrv.getGlobalVar('configStatus');
        $scope.ctrl.init();


        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };

        $scope.popup1 = {
            opened: false
        };
        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };

        $scope.popup2 = {
            opened: false
        };


    }])
    .component('configProfile', {
        restrict: 'EA',
        templateUrl: 'modules/config/confviews/cprofile.html',
        scope: {
            method: '='
        },
        controller: 'ConfigProfileController'
    })
;