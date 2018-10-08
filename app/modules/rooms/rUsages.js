angular.module('Rooms')
    .controller('RoomsUsagesController', ['$scope', 'AuthenticationService', 'makeController', function ($scope, AuthenticationService, makeController) {

        $scope.ctrl = makeController.n2nController('/rooms', 'roomuse', {comment: ''});
        $scope.ctrl.init();

    }])

    .directive('lRoomTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/rooms/rviews/urTable.html'
        }
    })
    .directive('rRoomTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/rooms/rviews/evrTable.html'
        }
    })
    .directive('evRoomsForm', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/rooms/rviews/evRoomsForm.html'
        }
    })
;