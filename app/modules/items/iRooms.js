angular.module('Items')
    .controller('ItemsRoomsController', ['$scope', 'AuthenticationService', 'makeController', 'ClrStatusSrv', function ($scope, AuthenticationService, makeController, ClrStatusSrv) {

        $scope.ctrl = makeController.n2nController('/items', 'rooms', {comments: '', stat: '', from: '', to: ''});
        $scope.ctrl.init();
        $scope.statusOptions = ClrStatusSrv.getStatus('itemStatus');

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