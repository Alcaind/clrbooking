angular.module('Rooms')
    .controller('RoomsTmsController', ['$scope', 'AuthenticationService', 'makeController', function ($scope, AuthenticationService, makeController) {

        $scope.ctrl = makeController.n2nController('/rooms', 'tms', {comments: ''});
        $scope.ctrl.init();
    }])

    .directive('rTmsTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/rooms/rviews/tms/urTable.html'
        }
    })
    .directive('lTmsTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/rooms/rviews/tms/evrTable.html'
        }
    })
    .directive('evTmsForm', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/rooms/rviews/tms/evTmsForm.html'
        }
    })
;