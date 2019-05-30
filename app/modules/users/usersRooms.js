angular.module('Users')
    .controller('UsersRoomsController', ['$scope', 'AuthenticationService', 'makeController', 'api', function ($scope, AuthenticationService, makeController, api) {

        $scope.ctrl = makeController.n2nController('/users', 'rooms', {comment: ''});
        $scope.ctrl.init();

        $scope.rooms = {};

        api.apiCall('GET', 'api/public/rooms', function (results) {
            $scope.rooms = results.data;
        });
    }])

    .directive('rURoomsTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/users/rooms/urTable.html'
        }
    })
    .directive('lURoomsTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/users/rooms/evrTable.html'
        }
    })
    .directive('evURoomsForm', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/users/rooms/evItemsForm.html'
        }
    })
;