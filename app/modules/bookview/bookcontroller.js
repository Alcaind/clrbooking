'use strict';

angular.module('RoomBook', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules'
])
    .controller('BookController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, api) {
        $scope.rooms = [];
        $scope.periods = [];
        $scope.users = [];
        //$scope.book = [];

        api.apiCall('GET', 'api/public/rooms', function (result) {
            $scope.rooms = result.data;
        });

        api.apiCall('GET', 'api/public/periods', function (result) {
            $scope.periods = result.data;
        });

        api.apiCall('GET', 'api/public/users', function (result) {
            $scope.users = result.data;
        });

        $scope.openCalendar = function (item) {
            api.apiCall('POST', 'api/public/roombook/dates', function (result) {

                $scope.book = result.data;
                for (var i = 0; i < $scope.book.length; i++) {
                    var mdt = new Date($scope.book[i].fromd + 'T' + $scope.book[i].fromt);
                    $scope.calendar[$scope.book[i].date_index - $scope.item.fromd.getDay()][mdt.getHours()] = 1;
                }

            }, undefined, item);

        }


    }]);
