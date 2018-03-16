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