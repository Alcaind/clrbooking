'use strict';

angular.module('RoomBook', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules'
])
    .controller('BookController', ['$scope', 'api', function ($scope, api) {


        $scope.rooms = [];
        $scope.periods = [];
        $scope.users = [];

        api.apiCall('GET', 'api/public/rooms', function (result) {
            $scope.rooms = result.data;
        });

        api.apiCall('GET', 'api/public/periods', function (result) {
            $scope.periods = result.data;
        });

        api.apiCall('GET', 'api/public/users', function (result) {
            $scope.users = result.data;
        });


    }]);
