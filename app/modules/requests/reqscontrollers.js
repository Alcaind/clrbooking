'use strict';

angular.module('Requests', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules'
]).controller('RequestsController', ['$scope', '$http', function ($scope, $http) {

    $scope.requests = [];
    $scope.currentRequest = {};

    $scope.getRequests = function () {
        $http({
            method: 'GET',
            url: 'api/public/requests'
        }).then(function successCallback(response) {
            $scope.requests = response.data;
        }, function errorCallback(response) {
            alert(response.message);
        });
    };

    $scope.getRequest = function () {
        $http({
            method: 'GET',
            url: 'api/public/requests/' + $scope.currentRequest.id
        }).then(function successCallback(response) {
            $scope.currentRequest = response.data;
        }, function errorCallback(response) {
            alert(response.message);
        });
    };

    $scope.deleteRequest = function (request) {
        $http({
            method: 'DELETE',
            url: 'api/public/requests/' + request.id
        }).then(function successCallback(response) {
            $scope.requests.splice($scope.requests.indexOf(request), 1)
        }, function errorCallback(response) {
            alert(response.message);
        });
    };

    $scope.insertRequest = function () {
        $http({
            method: 'POST',
            url: 'api/public/requests',
            data: JSON.stringify($scope.currentRequest)
        }).then(function successCallback(response) {
            $scope.requests.push(response.data);
        }, function errorCallback(response) {
            alert(response.message);
        });
    };

    $scope.updateRequest = function () {
        $http({
            method: 'PUT',
            url: 'api/public/requests/' + $scope.currentRequest["id"],
            data: JSON.stringify($scope.currentRequest)
        }).then(function successCallback(response) {
            //TODO : reply confirmation to user;
            //$scope.roles = response.data;
        }, function errorCallback(response) {
            alert(response);
        });
    };

    $scope.selectRequest = function (request) {
        $scope.currentRequest = request;
    };
    $scope.newRequest = function () {
        $scope.currentRequest = {
            role: "",
            req_dt: "",
            user_id: "",
            descr: "",
            period: "",
            ps_id: "",
            teacher: "",
            from_book: "",
            class_use: "",
            links: "",
            fromdt: "",
            todt: "",
            protocol_id: "",
            req_stat: ""
        };
    };
}]);