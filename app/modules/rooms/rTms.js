angular.module('Rooms')
    .controller('RoomsTmsController', ['$scope', 'MakeModal', 'api', 'orderByFilter', 'AuthenticationService', '$routeParams', function ($scope, MakeModal, api, orderBy, AuthenticationService, $routeParams) {
        AuthenticationService.CheckCredentials();

        $scope.rData = $scope.lData = [];
        $scope.rLength = $scope.lLength = 0;
        $scope.currentTms = null;
        $scope.baseURL = 'api/public/rooms';
        $scope.roomData = null;

        $scope.getRoom = function () {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.roomId, function (results) {
                $scope.roomData = results.data;
            });
        };
        $scope.getRoom();

        api.apiCall('GET', $scope.baseURL + "/" + $routeParams.roomId + '/tms', function (results) {
            $scope.lData = results.data.tms;
            $scope.lLength = $scope.lData.length;
            if ($scope.rData && $scope.rData.length > 0) {
                $scope.compare();
            }
        });

        api.apiCall('GET', 'api/public/tms', function (results) {
            $scope.rData = results.data;
            $scope.rLength = $scope.rData.length;
            if ($scope.lData && $scope.lData.length > 0) {
                $scope.compare();
            }
        });

        $scope.editPivotData = function (tms) {
            $scope.pivotData = tms.pivot;
            $scope.currentTms = tms;
            $scope.state = 1;
        };

        $scope.showPivotData = function (tms) {
            $scope.state = 0;
            $scope.currentTms = tms;
        };

        $scope.deleteTmsRoom = function (tid) {
            api.apiCall('DELETE', $scope.baseURL + "/" + $routeParams.roomId + '/tms/' + tid, function (results) {
                $scope.lData = results.data;
                $scope.compare();
            }, undefined, tid);
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
            templateUrl: 'modules/rooms/rviews/tms/evTmsForm.html',
            controller: "EvTmsFormController"
        }
    })
    .controller('EvTmsFormController', ['$scope', 'api', '$routeParams', function ($scope, api, $routeParams) {
        $scope.pivotData = {comments: ''};
        $scope.baseURL = 'api/public/rooms';
        $scope.state = 1;

        $scope.cancel = function () {
            $scope.pivotData = {comments: ''};
            $scope.currentTms = null;
        };

        $scope.insert = function () {
            var method = "PUT";
            if ($scope.state === 0) method = "POST";
            api.apiCall(method, $scope.baseURL + "/" + $routeParams.roomId + '/tms/' + $scope.currentTms.id, function (results) {
                $scope.pivotData = {comments: ''};
                $scope.lData = results.data;
                $scope.compare();
                $scope.cancel();
            }, undefined, $scope.pivotData, undefined, $scope);
        };
    }]);