'use strict';

angular.module('RoomUse', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication'
]).controller('RoomUseController', ['$scope', 'MakeModal', 'api', 'orderByFilter', 'AuthenticationService', function ($scope, MakeModal, api, orderBy, AuthenticationService) {

    $scope.dp = [];
    $scope.item = {};
    $scope.method = '';
    $scope.baseURL = 'api/public/roomuse';

    $scope.getRoomUse = function () {
        api.apiCall('GET', $scope.baseURL, function (results) {
            $scope.dp = results.data;
            $scope.totalItems = $scope.dp.length;
        });
    };

    $scope.deleteRoomUse = function (item) {
        api.apiCall('DELETE', $scope.baseURL + "/" + item.id, function (results) {
            $scope.dp.splice($scope.dp.indexOf(item), 1);
            $scope.item = {};
            MakeModal.generalInfoModal('sm', 'Info', 'info', 'Η χρήση αίθουσας διαγράφηκε.', 1)
        });
    };

    $scope.propertyName = 'synt';
    $scope.reverse = true;
    $scope.sorttable = orderBy($scope.dp, $scope.propertyName, $scope.reverse);

    $scope.sortBy = function (propertyName) {
        $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
            ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.getRoomUse();

}])
    .controller('RoomUseProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, AuthenticationService) {

        $scope.baseURL = 'api/public/roomuse';

        if (!$routeParams.roomuseId) {
            $scope.item = {
                synt: "",
                descr: ""
            };
        } else {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.roomuseId, function (results) {
                $scope.item = results.data;
            });
        }
        $scope.updateRoomUse = function (item) {
            api.apiCall('PUT', $scope.baseURL + "/" + item.id, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Η χρήση αίθουσας ανανεώθηκε.', 1);
                history.back();
            }, undefined, item)

        };

        $scope.saveRoomUse = function (item) {
            api.apiCall('POST', $scope.baseURL, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Νεα χρήση αίθουσας δημιουργήθηκε.', 1);
                history.back();
            }, undefined, item)
        }

    }])
    .component('roomUseProfile', {
        restrict: 'EA',
        templateUrl: 'modules/roomUse/ruseviews/ruprofile.html',
        scope: {
            method: '='
        },
        controller: 'RoomUseProfileController'
    })

;