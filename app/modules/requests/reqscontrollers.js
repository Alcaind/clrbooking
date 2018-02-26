'use strict';

angular.module('Requests', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'

]).controller('RequestsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv) {
    $scope.ctrl = makeController.mainController('/requests', 'requestsTableConf', 'Κατάλογος Αιτημάτων');
    $scope.ctrl.init();

}])
    .controller('RequestProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api) {
        $scope.ctrl = makeController.profileController('/requests', 'requestsTableConf');
        $scope.ctrl.init();

        $scope.users = {};
        $scope.periods = {};

        api.apiCall('GET', 'api/public/users', function (results) {
            $scope.users = results.data;
        });
        api.apiCall('GET', 'api/public/periods', function (results) {
            $scope.periods = results.data;
        });
    }])
    .component('requestsProfile', {
        restrict: 'EA',
        templateUrl: 'modules/requests/reqviews/profile.html',
        scope: {
            method: '='
        },
        controller: 'RequestProfileController'
    })
;