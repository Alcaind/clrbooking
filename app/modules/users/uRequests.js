angular.module('Users')
    .controller('URequestsController', ['$scope', '$routeParams', 'api', 'AuthenticationService', function ($scope, $routeParams, api, AuthenticationService) {
        AuthenticationService.CheckCredentials();
        api.apiCall('GET', 'api/public/users/' + $routeParams.userId + '/requests', function (results) {
            $scope.uRequest = results.data;
        });

        // $scope.editRequestData = function (request) {
        //     api.apiCall('PUT', 'api/public/users/' + request.id, function (results) {
        //         $scope.modalMessage = "Request Updated";
        //         var modalInstance = MakeModal.defaultModal('lg', null, null, $scope);
        //     }, undefined, request, undefined, $scope)
        // };
    }])
    .component('usersRequests', {
        scope: {
            itemId: '='
        }
    })
;

