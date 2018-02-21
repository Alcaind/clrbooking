angular.module('Rooms')
    .controller('RoomRequestsController', ['$scope', 'MakeModal', 'api', 'orderByFilter', 'AuthenticationService', '$routeParams', function ($scope, MakeModal, api, orderBy, AuthenticationService, $routeParams) {
        AuthenticationService.CheckCredentials();
        $scope.rRequest = [];
        $scope.method = '';
        $scope.baseURL = 'api/public/rooms';

        $scope.propertyName = 'id';
        $scope.reverse = true;
        $scope.sorttable = orderBy($scope.dp, $scope.propertyName, $scope.reverse);

        $scope.urData = null;

        api.apiCall('GET', $scope.baseURL + "/" + $routeParams.roomId, function (results) {
            $scope.urData = results.data;
        });

        $scope.sortBy = function (propertyName) {
            $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
                ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };

        api.apiCall('GET', $scope.baseURL + "/" + $routeParams.roomId + '/requests',
            function (results) {
                $scope.rRequest = results.data;
                $scope.totalItems = $scope.rRequest.length;
            });
    }])
;
