angular.module('Rooms')
    .controller('RoomsItemsController', ['$scope', 'AuthenticationService', 'makeController', function ($scope, AuthenticationService, makeController) {

        $scope.ctrl = makeController.n2nController('/rooms', 'items', {comments: '', stat: '', from: '', to: ''});
        $scope.ctrl.init();

    }])

    .directive('rItemTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/rooms/rviews/items/urTable.html'
        }
    })
    .directive('lItemTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/rooms/rviews/items/evrTable.html'
        }
    })
    .directive('evItemsForm', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/rooms/rviews/items/evItemsForm.html',
            controller: "EvItemsFormController"
        }
    })
    .controller('EvItemsFormController', ['$scope', 'api', '$routeParams', function ($scope, api, $routeParams) {
        $scope.baseURL = 'api/public/rooms';

        $scope.cancelUrData = function () {
            $scope.ctrl.pivotData = null;
            $scope.ctrl.currentRight = null;
        };

        $scope.insert = function () {
            var method = "PUT";
            if ($scope.ctrl.state === 0) method = "POST";
            api.apiCall(method, $scope.baseURL + "/" + $routeParams.id + '/items/' + $scope.ctrl.currentRight.id, function (results) {
                $scope.ctrl.pivotData = Object.assign({}, $scope.ctrl.pivotTable);
                $scope.ctrl.ldp = results.data;
                $scope.ctrl.compare($scope.ctrl.ldp, $scope.ctrl.rdp);
                $scope.cancelUrData();
            }, undefined, $scope.ctrl.pivotData);
        };
    }]);