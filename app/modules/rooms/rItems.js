angular.module('Rooms')
    .controller('RoomsItemsController', ['$scope', 'AuthenticationService', 'makeController', 'ClrStatusSrv', function ($scope, AuthenticationService, makeController, ClrStatusSrv) {

        $scope.ctrl = makeController.n2nController('/rooms', 'items', {comments: '', stat: '', from: '', to: ''});
        $scope.ctrl.init();

    }])

    .directive('lItemTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/rooms/rviews/items/urTable.html'
        }
    })
    .directive('rItemTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/rooms/rviews/items/evrTable.html'
        }
    })
    .directive('evItemsForm', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/rooms/rviews/items/evItemsForm.html'
        }
    });