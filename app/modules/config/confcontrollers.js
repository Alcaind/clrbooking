'use strict';

angular.module('Config', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
]).controller('ConfigController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', 'ClrStatusSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv, ClrStatusSrv) {

    $scope.ctrl = makeController.mainController('/config', 'configTableConf', 'Configuration');
    $scope.ctrl.init();

    $scope.statusOptions = ClrStatusSrv.getStatus('configStatus');

}])
    .controller('ConfigProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api) {
        $scope.ctrl = makeController.profileController('/config', 'configTableConf');
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