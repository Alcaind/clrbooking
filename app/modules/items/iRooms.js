angular.module('Items')
    .controller('ItemsRoomsController', ['$scope', 'AuthenticationService', 'makeController', function ($scope, AuthenticationService, makeController) {


        $scope.ctrl = makeController.n2nController('/items', 'rooms', {comments: '', stat: '', from: '', to: ''});
        $scope.ctrl.init();

    }])

    .directive('lItemRoomTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/items/itemviews/rooms/urTable.html'
        }
    })
    .directive('rItemRoomTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/items/itemviews/rooms/evrTable.html'
        }
    })
    .directive('evItemRoomForm', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/items/itemviews/rooms/evItemsForm.html'
        }
    });