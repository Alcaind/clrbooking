'use strict';

angular.module('RoomBook', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication'
]).controller('roomBookController', ['$scope', 'MakeModal', 'api', 'orderByFilter', 'AuthenticationService', function ($scope, MakeModal, api, orderBy, AuthenticationService) {
    AuthenticationService.CheckCredentials();
    $scope.dp = [];
    $scope.item = {};
    $scope.method = '';
    $scope.baseURL = 'api/public/booking';

    $scope.getRoomBook = function () {
        api.apiCall('GET', $scope.baseURL, function (results) {
            $scope.dp = results.data;
            $scope.totalItems = $scope.dp.length;
        });
    };

    $scope.deleteRoomBook = function (item) {
        api.apiCall('DELETE', $scope.baseURL + "/" + item.id, function (results) {
            $scope.dp.splice($scope.dp.indexOf(item), 1);
            $scope.item = {};
            MakeModal.generalInfoModal('sm', 'Info', 'info', 'H δέσμεση αίθουσας διαγράφηκε', 1)
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

    $scope.getRoomBook();

}])
    .controller('RoomBookProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, AuthenticationService) {
        AuthenticationService.CheckCredentials();
        $scope.baseURL = 'api/public/booking';
        $scope.users = {};

        api.apiCall('GET', 'api/public/users', function (results) {
            $scope.users = results.data;
        });


        if (!$routeParams.roombookId) {
            $scope.item = {
                id: "",
                user_id: "",
                room_id: "",
                request_id: "",
                date_index: "",
                fromd: "",
                tod: "",
                fromt: "",
                tot: "",
                type: "",
                period: ""
            };
        } else {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.roombookId, function (results) {
                $scope.item = results.data;
            });
        }
        $scope.updateRoomBook = function (item) {
            api.apiCall('PUT', $scope.baseURL + "/" + item.id, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Η δέσμεση αίθουσας ανανεώθηκε', 1);
                history.back();
            }, undefined, item)

        };

        $scope.saveRoomBook = function (item) {
            api.apiCall('POST', $scope.baseURL, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Νεα δέσμεση αίθουσας', 1);
                history.back();
            }, undefined, item)
        }
    }])
    .component('roomBookProfile', {
        restrict: 'EA',
        templateUrl: 'modules/booking/roombookviews/rbprofile.html',
        scope: {
            method: '='
        },
        controller: 'roomBookProfileController'
    })

;