angular.module('Rooms')
    .controller('RoomsTmsController', ['$scope', 'MakeModal', 'api', 'orderByFilter', 'AuthenticationService', '$routeParams', function ($scope, MakeModal, api, orderBy, AuthenticationService, $routeParams) {
        AuthenticationService.CheckCredentials();
        $scope.rTms = [];
        $scope.baseURL = 'api/public/rooms';

        $scope.propertyName = 'tm_code';
        $scope.reverse = true;
        $scope.sorttable = orderBy($scope.dp, $scope.propertyName, $scope.reverse);

        $scope.tData = null;

        api.apiCall('GET', $scope.baseURL + "/" + $routeParams.roomId, function (results) {
            $scope.tData = results.data;
        });

        $scope.sortBy = function (propertyName) {
            $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
                ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };

        api.apiCall('GET', $scope.baseURL + "/" + $routeParams.roomId + '/tms',
            function (results) {
                $scope.rTms = results.data;
                $scope.totalItems = $scope.rTms.length;
            });
    }])
;
