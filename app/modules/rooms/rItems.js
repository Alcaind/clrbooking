angular.module('Rooms')
    .controller('RoomsItemsController', ['$scope', 'MakeModal', 'api', 'orderByFilter', 'AuthenticationService', '$routeParams', function ($scope, MakeModal, api, orderBy, AuthenticationService, $routeParams) {


        $scope.rData = $scope.lData = [];
        $scope.rLength = $scope.lLength = 0;
        $scope.currentItem = null;
        $scope.baseURL = 'api/public/rooms';
        $scope.roomData = null;

        $scope.getRoom = function () {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.roomId, function (results) {
                $scope.roomData = results.data;
            });
        };
        $scope.getRoom();

        api.apiCall('GET', $scope.baseURL + "/" + $routeParams.roomId + '/items', function (results) {
            $scope.lData = results.data.items;
            $scope.lLength = $scope.lData.length;
            if ($scope.rData && $scope.rData.length > 0) {
                $scope.compare();
            }
        });

        api.apiCall('GET', 'api/public/items', function (results) {
            $scope.rData = results.data;
            $scope.rLength = $scope.rData.length;
            if ($scope.lData && $scope.lData.length > 0) {
                $scope.compare();
            }
        });

        $scope.editPivotData = function (items) {
            $scope.pivotData = items.pivot;
            $scope.currentItem = items;
            $scope.state = 1;
        };

        $scope.showPivotData = function (items) {
            $scope.state = 0;
            $scope.currentItem = items;
        };

        $scope.deleteItemRoom = function (iid) {
            api.apiCall('DELETE', $scope.baseURL + "/" + $routeParams.roomId + '/items/' + iid, function (results) {
                $scope.lData = results.data;
                $scope.compare();
            }, undefined, iid);
        };

        $scope.compare = function () {
            for (var i = 0; i < $scope.rData.length; i++) {
                $scope.rData[i].disabled = false;
                for (var j = 0; j < $scope.lData.length; j++)
                    if (angular.equals($scope.lData[j].id, $scope.rData[i].id))
                        $scope.rData[i].disabled = true;
            }
        }


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
        $scope.pivotData = {comments: '', stat: '', from: '', to: ""};
        $scope.baseURL = 'api/public/rooms';
        $scope.state = 1;

        $scope.cancel = function () {
            $scope.pivotData = {comments: '', stat: '', from: '', to: ""};
            $scope.currentItem = null;
        };

        $scope.insert = function () {
            var method = "PUT";
            if ($scope.state === 0) method = "POST";
            api.apiCall(method, $scope.baseURL + "/" + $routeParams.roomId + '/items/' + $scope.currentItem.id, function (results) {
                $scope.pivotData = {comments: '', stat: '', from: '', to: ""};
                $scope.lData = results.data;
                $scope.compare();
                $scope.cancel();
            }, undefined, $scope.pivotData, undefined, $scope);
        };
    }]);