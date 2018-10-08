'use strict';

angular.module('Kat', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
]).controller('KatController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv) {

    $scope.ctrl = makeController.mainController('/kats', 'katTableConf', 'Κατάλογος Κατευθύνσεων');
    $scope.ctrl.init();

}])
    .controller('KatProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api) {
        $scope.ctrl = makeController.profileController('/kats', 'katTableConf');
        $scope.ctrl.init();

        $scope.tms = {};

        api.apiCall('GET', 'api/public/tms', function (results) {
            $scope.tms = results.data;
        });

    }])
    .component('katProfile', {
        restrict: 'EA',
        templateUrl: 'modules/kat/katsviews/profile.html',
        scope: {
            method: '='
        },
        controller: 'KatProfileController'
    })
;
