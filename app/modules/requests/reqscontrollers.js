'use strict';

angular.module('Requests', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication'
]).controller('RequestsController', ['$scope', 'MakeModal', 'api', 'orderByFilter', 'AuthenticationService', function ($scope, MakeModal, api, orderBy, AuthenticationService) {
    AuthenticationService.CheckCredentials();
    $scope.dp = [];
    $scope.item = {};
    $scope.method = '';
    $scope.baseURL = 'api/public/requests';

    $scope.getRequests = function () {
        api.apiCall('GET', $scope.baseURL, function (results) {
            $scope.dp = results.data;
            $scope.totalItems = $scope.dp.length;
        });
    };

    $scope.deleteRequest = function (item) {
        api.apiCall('DELETE', $scope.baseURL + "/" + item.id, function (results) {
            $scope.dp.splice($scope.dp.indexOf(item), 1);
            $scope.item = {};
            MakeModal.generalInfoModal('sm', 'Info', 'info', 'Το αίτημα διαγράφηκε.', 1)
        });
    };

    $scope.propertyName = 'user_id';
    $scope.reverse = true;
    $scope.sorttable = orderBy($scope.dp, $scope.propertyName, $scope.reverse);

    $scope.sortBy = function (propertyName) {
        $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
            ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.getRequests();

}])
    .controller('RequestProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, AuthenticationService) {
        AuthenticationService.CheckCredentials();
        $scope.baseURL = 'api/public/requests';
        $scope.users = {};

        api.apiCall('GET', 'api/public/users', function (results) {
            $scope.users = results.data;
        });


        if (!$routeParams.requestId) {
            $scope.item = {
                id: "",
                req_dt: "",
                user_id: "",
                descr: "",
                period: "",
                ps_id: "",
                class_use: "",
                links: "",
                fromdt: "",
                todt: "",
                protocol_id: "",
                req_status: "",
                fromd: "",
                tod: "",
                date_index: "",
                admin: ""
            };
        } else {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.requestId, function (results) {
                $scope.item = results.data;
            });
        }
        $scope.updateRequest = function (item) {
            api.apiCall('PUT', $scope.baseURL + "/" + item.id, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Το αίτημα ανανεώθηκε.', 1);
                history.back();
            }, undefined, item)

        };

        $scope.saveRequest = function (item) {
            api.apiCall('POST', $scope.baseURL, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Νεο αίτημα δημιουργήθηκε.', 1);
                history.back();
            }, undefined, item)
        }
    }])
    .component('requestsProfile', {
        restrict: 'EA',
        templateUrl: 'modules/requests/reqviews/profile.html',
        scope: {
            method: '='
        },
        controller: 'RequestProfileController'
    })

;