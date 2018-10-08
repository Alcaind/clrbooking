'use strict';

angular.module('PsStats', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'

]).controller('PsStatsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv) {

    $scope.ctrl = makeController.mainController('/psstats', 'psstatsTableConf', 'Κατάλογος Στατιστικών Προγράμματος Σπουδών');
    $scope.ctrl.init();

}])
    .controller('PsStatsProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api) {
        $scope.ctrl = makeController.profileController('/psstats', 'psstatsTableConf');
        $scope.ctrl.init();

        $scope.ps = {};

        api.apiCall('GET', 'api/public/ps', function (results) {
            $scope.ps = results.data;
        });
    }])
    .component('psStatsProfile', {
        restrict: 'EA',
        templateUrl: 'modules/ps_stats/psstatsviews/profile.html',
        scope: {
            method: '='
        },
        controller: 'PsStatsProfileController'
    })
;