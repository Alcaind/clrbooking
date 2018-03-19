'use strict';

angular.module('Requests', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
]).controller('RequestsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', 'ClrStatusSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv, ClrStatusSrv) {
    $scope.ctrl = makeController.mainController('/requests', 'requestsTableConf', 'Κατάλογος Αιτημάτων');
    $scope.ctrl.init();
    $scope.statusOptions = ClrStatusSrv.getStatus('requestStatus');

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

        $scope.room_use = {};

        api.apiCall('GET', 'api/public/roomuse', function (results) {
            $scope.room_use = results.data;
        });

        $scope.tms = {};

        api.apiCall('GET', 'api/public/tms', function (results) {
            $scope.tms = results.data;
        });

        $scope.ps = {};

        api.apiCall('GET', 'api/public/ps', function (results) {
            $scope.ps = results.data;
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