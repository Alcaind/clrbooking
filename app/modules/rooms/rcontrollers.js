'use strict';

angular.module('Rooms', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules'
]).controller('RoomsController', ['$scope', 'MakeModal', '$http', 'api', function ($scope, MakeModal, $http, api) {

    $scope.apiResults = [];
    $scope.dp = [];
    $scope.item = {};
    $scope.method = '';
    $scope.roomItems = [];


    $scope.roomsApi = function (url, method, data, successCallback, errorCallback) {

        method = typeof method !== 'undefined' ? method : 'GET';
        data = typeof data !== 'undefined' ? data : null;
        url = typeof url !== 'undefined' ? url : 'api/public/rooms';
        $scope.method = method;
        $scope.item = data;
        successCallback = typeof successCallback !== 'undefined' ? successCallback : $scope.successCallback;
        errorCallback = typeof errorCallback !== 'undefined' ? errorCallback : $scope.errorCallback;

        return api.apiCall(method, url, successCallback, errorCallback, data, $scope.dp, $scope)
    }

    $scope.successCallback = function (results) {
        switch ($scope.method) {
            case 'DELETE' :
                $scope.dp.splice($scope.dp.indexOf($scope.item), 1);
                $scope.item = {};
                $scope.modalMessage = "Room Deleted";
                var modalInstance = MakeModal.defaultModal('lg', null, null, $scope);
                break;
            case 'PUT' :
                $scope.modalMessage = "Room Updated";
                var modalInstance = MakeModal.defaultModal('lg', null, null, $scope);
                break;
            case 'POST' :
                $scope.dp.push(results.data);
                $scope.modalMessage = "Room Inserted";
                var modalInstance = MakeModal.defaultModal('lg', null, null, $scope);
                break;
            case 'GET' :
                $scope.dp = results.data;
                break;
            default :
                $scope.dp = results.data;
                break
        }
    }
    $scope.errorCallback = function (results) {

    }

    $scope.selectRoom = function (room) {
        $scope.item = room;
    };

    $scope.newRoom = function () {
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
        }
    };

    $scope.getRooms = function () {
        $scope.roomsApi(undefined, undefined, undefined, function (results) {
            $scope.dp = results.data;
        });
    };


    $scope.deleteRooms = function (item) {
        $scope.roomsApi(undefined, 'DELETE', item);
    };

    $scope.updateRooms = function (item) {
        $scope.roomsApi(undefined, 'PUT', item);
    };

    $scope.saveRoom = function (item) {
        $scope.roomsApi(undefined, 'POST', item);
    };

    $scope.getItems = function (room) {
        $scope.roomsApi("api/public/rooms/" + room.id + "/item", 'GET', undefined, function (results) {
            $scope.roomItems = results.data;
        })
    };

}]);
