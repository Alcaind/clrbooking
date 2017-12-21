'use strict';

angular.module('Tms', [
    'MainComponents',
    'ui.bootstrap'
]).controller('TmsController', ['$scope', '$http', function ($scope, $http) {

    $scope.tms = [];
    $scope.currentTm = {};

    $scope.getTms = function () {
        $http({
            method: 'GET',
            url: 'api/public/tms'
        }).then(function successCallback(response) {
            $scope.tms = response.data;
        }, function errorCallBack(response) {
            alert(response.message);
        });
    };

    $scope.getTm = function () {
        $http({
            method: 'GET',
            url: 'api/public/tm/' + $scope.currentTm.id
        }).then(function successCallback(response) {
            $scope.currentTm = response.data;

        }, function errorCallBack(response) {
            alert(response.message);
        });
    };

    $scope.deleteTm = function (tm) {
        $http({
            method: 'DELETE',
            url: 'api/public/tm/' + tm.id
        }).then(function successCallBack(response) {
            $scope.tms.splice($scope.tms.indexOf(tm), 1)
        }, function errorCallBack(response) {
            alert(response.message);
        });
    };

    $scope.insertTm = function () {
        $http({
            method: 'POST',
            url: 'api/public/tm',
            data: JSON.stringify($scope.currentTm)
        }).then(function successCallBack(response) {
            $scope.tms.push(response.data);
        }, function errorCallBack(response) {
            alert(response.message);
        })
    };

    $scope.updateTm = function () {
        $http({
            method: 'PUT',
            url: 'api/public/tm/' + $scope.currentTm.id,
            data: JSON.stringify($scope.currentTm)
        }).then(function successCallBack(response) {
            //????
        }, function errorCallBack(response) {
            alert(response.message);
        });
    };

    $scope.selectTm = function (tm) {
        $scope.currentTm = tm;
    };

    $scope.newTm = function () {
        $scope.currentTm = {
            tm_code: "",
            descr: "",
            title: "",
            sxoli: ""
        }
    };
}]);