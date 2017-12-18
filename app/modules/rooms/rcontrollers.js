'use strict';

angular.module('Rooms', [
    'MainComponents',

    'ui.bootstrap'
]).controller('RoomsController', ['$scope', '$http', function ($scope, $http) {

    $scope.rooms = [];
    $scope.currentRoom = {};

    $scope.getRooms = function () {
        $http({
            method: 'GET',
            url: 'api/public/rooms'
        }).then(function successCallback(response) {
            $scope.rooms = response.data;
        }, function errorCallback(response) {
            alert(response.message);
        });
    };

    $scope.getRoom = function () {
        $http({
            method: 'GET',
            url: 'api/public/room/' + $scope.currentRoom.id
        }).then(function successCallback(response) {
            $scope.currentRoom = response.data;

        }, function errorCallBack(response) {
            alert(response.message);
        });
    };

    $scope.deleteRoom = function (room) {
        $http({
            method: 'DELETE',
            url: 'api/public/room/' + room.id
        }).then(function successCallBack(response) {
            $scope.rooms.splice($scope.rooms.indexOf(room), 1)
        }, function errorCallBack(response) {
            alert(response.message);
        });
    };

    $scope.insertRoom = function () {
        $http({
            method: 'POST',
            url: 'api/public/room',
            data: JSON.stringify($scope.currentRoom)
        }).then(function successCallBack(response) {
            $scope.rooms.push(response.data);
        }, function errorCallBack(response) {
            alert(response.message);
        })
    };

    $scope.updateRoom = function () {
        $http({
            method: 'PUT',
            url: 'api/public/room/' + $scope.currentRoom["id"],
            data: JSON.stringify($scope.currentRoom)
        }).then(function successCallBack(response) {
            //????
        }, function errorCallBack(response) {
            alert(response.message);
        });
    };

    $scope.selectRoom = function (room) {
        $scope.currentRoom = room;
    };

    $scope.newRoom = function () {
        $scope.currentRoom = {
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
    };

}]);
