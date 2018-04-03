'use strict';

angular.module('Tms', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
]).controller('TmsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv) {

    $scope.ctrl = makeController.mainController('/tms', 'tmsTableConf', 'Κατάλογος Τμημάτων ');
    $scope.ctrl.init();

}])

    .controller('TmProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api) {
        $scope.ctrl = makeController.profileController('/tms', 'tmsTableConf');
        $scope.ctrl.init();

        $scope.supervisor = [];
        api.apiCall('GET', 'api/public/users', function (result) {
            $scope.supervisor = result.data;
        });
    }])

    .component('tmProfile', {
        restrict: 'EA',
        templateUrl: 'modules/tm/tmviews/profile.html',
        scope: {
            method: '='
        },
        controller: 'TmProfileController'
    })
;
