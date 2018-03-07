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

        api.apiCall('GET', 'api/public/users', function (results) {
            $scope.users = results.data;
        });

        $scope.periods = {};

        api.apiCall('GET', 'api/public/periods', function (results) {
            $scope.periods = results.data;
        });

        $scope.admin = [];

        api.apiCall('GET', 'api/public/users', function (results) {
            for (var i = 0; i < results.data.length; i++) {
                if (results.data[i].cat_id === 9) $scope.admin.push(results.data[i]);
            }
        });

        $scope.getAdmin = function (adminId) {
            for (var i = 0; i < $scope.admin.length; i++) {
                if ($scope.admin[i].id === adminId) return $scope.admin[i].user;
            }
        };


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