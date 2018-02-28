'use strict';

angular.module('Config', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
]).controller('ConfigController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv) {

    $scope.ctrl = makeController.mainController('/config', 'configTableConf', 'Configuration');
    $scope.ctrl.init();

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