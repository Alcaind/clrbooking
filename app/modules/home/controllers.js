'use strict';

angular.module('Home', [
    'Authentication',
    'Admin',
    'ui.bootstrap',
    'GlobalVarsSrvs'
])
    .controller('HomeController', ['$scope', 'globalVarsSrv', 'AuthenticationService', function ($scope, globalVarsSrv, AuthenticationService) {
        AuthenticationService.CheckCredentials();

        $scope.adminColums = globalVarsSrv.getGlobalVar(globalVarsSrv.getGlobalVar('menuRole') === 'admin' ? 'homeButtonAdminTableConf' : 'homeButtonUserTableConf');

        console.log('in Home controller');

    }])
;