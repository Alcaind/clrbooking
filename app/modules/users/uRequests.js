angular.module('Users')
    .controller('URequestsController', ['$scope', 'MakeModal', 'api', 'orderByFilter', 'AuthenticationService', '$routeParams', function ($scope, MakeModal, api, orderBy, AuthenticationService, $routeParams) {
        AuthenticationService.CheckCredentials();
        $scope.uRequest = [];
        $scope.method = '';
        $scope.baseURL = 'api/public/users';

        $scope.propertyName = 'id';
        $scope.reverse = true;
        $scope.sorttable = orderBy($scope.dp, $scope.propertyName, $scope.reverse);

        $scope.urData = null;

        api.apiCall('GET', $scope.baseURL + "/" + $routeParams.userId, function (results) {
            $scope.urData = results.data;
        });

        $scope.sortBy = function (propertyName) {
            $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
                ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };

        api.apiCall('GET', $scope.baseURL + "/" + $routeParams.userId + '/requests',
            function (results) {
                $scope.uRequest = results.data;
                $scope.totalItems = $scope.uRequest.length;
            });
    }])
    .component('usersRequests', {
        scope: {
            itemId: '='
        }
    })
;
