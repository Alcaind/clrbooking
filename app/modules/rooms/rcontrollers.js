'use strict';

angular.module('Rooms', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication'
]).controller('RoomsController', ['$scope', '$routeParams', 'api', 'MakeModal', 'orderByFilter', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, orderBy, AuthenticationService) {
    AuthenticationService.CheckCredentials();

    $scope.dp = [];
    $scope.item = {};
    $scope.method = '';
    $scope.baseURL = 'api/public/rooms';

    $scope.getRooms = function () {
        api.apiCall('GET', $scope.baseURL, function (results) {
            $scope.dp = results.data;
            $scope.totalItems = $scope.dp.length;
        });
    };

    $scope.deleteRooms = function (item) {
        api.apiCall('DELETE', $scope.baseURL + "/" + item.id, function (results) {
            $scope.dp.splice($scope.dp.indexOf(item), 1);
            $scope.item = {};
            MakeModal.generalInfoModal('sm', 'Info', 'info', 'Αίθουσα διαγράφηκε', 1)
        });
    };

    $scope.propertyName = 'name';
    $scope.reverse = true;
    $scope.sorttable = orderBy($scope.dp, $scope.propertyName, $scope.reverse);

    $scope.sortBy = function (propertyName) {
        $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
            ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.getRooms();

}])

    .controller('RoomProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, AuthenticationService) {
        AuthenticationService.CheckCredentials();
        $scope.baseURL = 'api/public/rooms';

        if (!$routeParams.roomId) {
            $scope.item = {
                name: "",
                address: "",
                building: "",
                floor: "",
                status: "",
                active: "",
                destroyed: "",
                nonexist: "",
                capasity: "",
                width: "",
                height: "",
                xoros: "",
                exams_capasity: "",
                capasity_categ: "",
                tm_owner: "",
                dt: "",
                stat_comm: "",
                conf_id: "",
                type: "",
                use_id: "",
                use_str: ""
            };
        } else {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.roomId, function (results) {
                $scope.item = results.data;
            });
        }
        $scope.updateRoom = function (item) {
            api.apiCall('PUT', $scope.baseURL + "/" + item.id, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Η αίθουσα ανανεώθηκε', 1);
                history.back();
            }, undefined, item)

        };

        $scope.saveRoom = function (item) {
            api.apiCall('POST', $scope.baseURL, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Νεα αίθουσα', 1);
                history.back();
            }, undefined, item)
        }

    }])
    .component('roomProfile', {
        restrict: 'EA',
        templateUrl: 'modules/rooms/rviews/rprofile.html',
        scope: {
            method: '='
        },
        controller: 'RoomProfileController'
    })

;