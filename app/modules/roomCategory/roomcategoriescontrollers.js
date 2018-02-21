'use strict';

angular.module('RoomCategory', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication'
]).controller('RoomCategoryController', ['$scope', 'MakeModal', 'api', 'orderByFilter', 'AuthenticationService', function ($scope, MakeModal, api, orderBy, AuthenticationService) {
    AuthenticationService.CheckCredentials();
    $scope.dp = [];
    $scope.item = {};
    $scope.method = '';
    $scope.baseURL = 'api/public/roomcategory';

    $scope.getRoomCategory = function () {
        api.apiCall('GET', $scope.baseURL, function (results) {
            $scope.dp = results.data;
            $scope.totalItems = $scope.dp.length;
        });
    };

    $scope.deleteRoomCategory = function (item) {
        api.apiCall('DELETE', $scope.baseURL + "/" + item.id, function (results) {
            $scope.dp.splice($scope.dp.indexOf(item), 1);
            $scope.item = {};
            MakeModal.generalInfoModal('sm', 'Info', 'info', 'Η κατηγορία αίθουσας διαγράφηκε.', 1)
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

    $scope.getRoomCategory();

}])
    .controller('RoomCategoryProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, AuthenticationService) {
        AuthenticationService.CheckCredentials();
        $scope.baseURL = 'api/public/roomcategory';

        if (!$routeParams.roomcategoryId) {
            $scope.item = {
                id: "",
                synt: "",
                descr: ""
            };
        } else {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.roomcategoryId, function (results) {
                $scope.item = results.data;
            });
        }
        $scope.updateRoomCategory = function (item) {
            api.apiCall('PUT', $scope.baseURL + "/" + item.id, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Η κατηγορία αίθουσας ανανεώθηκε.', 1);
                history.back();
            }, undefined, item)

        };

        $scope.saveRoomCategory = function (item) {
            api.apiCall('POST', $scope.baseURL, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Νεα κατηγορία αίθουσας δημιουργήθηκε.', 1);
                history.back();
            }, undefined, item)
        }
    }])
    .component('roomCategoryProfile', {
        restrict: 'EA',
        templateUrl: 'modules/roomCategory/rcviews/rcprofile.html',
        scope: {
            method: '='
        },
        controller: 'RoomCategoryProfileController'
    })
;