'use strict';

angular.module('Kat', [
    'MainComponents',
    'ui.bootstrap'
]).controller('KatController', ['$scope', '$http', function ($scope, $http) {

    $scope.kats = [];
    $scope.currentKat = {};

    $scope.getKats = function () {
        $http({
            method: 'GET',
            url: 'api/public/kat'
        }).then(function successCallback(response) {
            $scope.kats = response.data;
        }, function errorCallback(response) {
            alert(response.message);
        });
    };

    $scope.getKat = function () {
        $http({
            method: 'GET',
            url: 'api/public/kat/' + $scope.currentKat.id
        }).then(function successCallback(response) {
            $scope.currentKat = response.data;
        }, function errorCallback(response) {
            alert(response.message);
        });
    };

    $scope.deleteKat = function (kat) {
        $http({
            method: 'DELETE',
            url: 'api/public/kat/' + kat.id
        }).then(function successCallback(response) {
            $scope.kats.splice($scope.kats.indexOf(kat), 1)
        }, function errorCallback(response) {
            alert(response.message);
        });
    };

    $scope.insertKat = function () {
        $http({
            method: 'POST',
            url: 'api/public/kat',
            data: JSON.stringify($scope.currentKat)
        }).then(function successCallback(response) {
            $scope.kats.push(response.data);
        }, function errorCallback(response) {
            alert(response.message);
        });
    };

    $scope.updateKat = function () {
        $http({
            method: 'PUT',
            url: 'api/public/kat/' + $scope.currentKat["id"],
            data: JSON.stringify($scope.currentKat)
        }).then(function successCallback(response) {
            //TODO : reply confirmation to user;
            //$scope.roles = response.data;
        }, function errorCallback(response) {
            alert(response);
        });
    };

    $scope.selectKat = function (kat) {
        $scope.currentKat = kat;
    };
    $scope.newKat = function () {
        $scope.currentKat = {tm_id: "", decr: "", title: "", pm: ""};
    };
}]);