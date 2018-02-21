angular.module('Rooms')
    .controller('RoomsUsagesController', ['$scope', 'MakeModal', 'api', 'orderByFilter', 'AuthenticationService', '$routeParams', function ($scope, MakeModal, api, orderBy, AuthenticationService, $routeParams) {
        AuthenticationService.CheckCredentials();

        $scope.rData = $scope.lData = [];
        $scope.rLength = $scope.lLength = 0;
        $scope.currentUsage = null;
        $scope.baseURL = 'api/public/rooms';
        $scope.roomData = null;

        $scope.getRoom = function () {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.roomId, function (results) {
                $scope.roomData = results.data;
            });
        };
        $scope.getRoom();

        api.apiCall('GET', $scope.baseURL + "/" + $routeParams.roomId + '/usages', function (results) {
            $scope.lData = results.data.room_use;
            $scope.lLength = $scope.lData.length;
            if ($scope.rData && $scope.rData.length > 0) {
                $scope.compare();
            }
        });

        api.apiCall('GET', 'api/public/roomuse', function (results) {
            $scope.rData = results.data;
            $scope.rLength = $scope.rData.length;
            if ($scope.lData && $scope.lData.length > 0) {
                $scope.compare();
            }
        });

        $scope.editUrData = function (usage) {
            $scope.urData = usage.pivot;
            $scope.currentUsage = usage;
            $scope.state = 1;
        };

        $scope.showUrData = function (usage) {
            $scope.state = 0;
            $scope.currentUsage = usage;
        };

        $scope.deleteUsageRoom = function (uid) {
            api.apiCall('DELETE', $scope.baseURL + "/" + $routeParams.roomId + '/usages/' + uid, function (results) {
                $scope.lData = results.data;
                $scope.compare();
            }, undefined, uid, undefined, $scope);
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

    .directive('rRoomTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/rooms/rviews/urTable.html'
        }
    })
    .directive('lRoomTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/rooms/rviews/evrTable.html'
        }
    })
    .directive('evRoomsForm', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/rooms/rviews/evRoomsForm.html',
            controller: "EvRoomsFormController"
        }
    })
    .controller('EvRoomsFormController', ['$scope', 'api', '$routeParams', function ($scope, api, $routeParams) {
        $scope.pivotData = {comment: ''};
        $scope.baseURL = 'api/public/rooms';
        $scope.state = 1;

        $scope.cancel = function () {
            $scope.pivotData = {comment: ''};
            $scope.currentUsage = null;
        };

        $scope.insert = function () {
            var method = "PUT";
            if ($scope.state === 0) method = "POST";
            api.apiCall(method, $scope.baseURL + "/" + $routeParams.roomId + '/usages/' + $scope.currentUsage.id, function (results) {
                $scope.pivotData = {comment: ''};
                $scope.lData = results.data;
                $scope.compare();
                $scope.cancel();
            }, undefined, $scope.pivotData, undefined, $scope);
        };
    }]);