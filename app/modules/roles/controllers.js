'use strict';

angular.module('Roles', [
    'MainComponents',
    'ui.bootstrap',
    'Users'
]).controller('RolesController', ['$scope', '$http', function ($scope, $http) {

    $scope.roles = [];
    $scope.currentRole = {};

    $scope.rolesApi = function (url, method, data, successCallback, errorCallback) {
        method = typeof method !== 'undefined' ? method : 'GET';
        data = typeof data !== 'undefined' ? data : null;
        url = typeof url !== 'undefined' ? url : 'api/public/roles';
        successCallback = typeof successCallback !== 'undefined' ? successCallback : $scope.successCallback;
        errorCallback = typeof errorCallback !== 'undefined' ? errorCallback : $scope.errorCallback;
        $scope.method = method;
        $scope.item = data;

        return api.apiCall(method, url, successCallback, errorCallback, data, $scope.dp, $scope)
    }

    $scope.getRoles = function () {
        /*$http({
            method: 'GET',
            url: 'api/public/roles'
        }).then(function successCallback(response) {
            $scope.roles = response.data;
        }, function errorCallback(response) {
            alert(response.message);
        });*/

        $scope.rolesApi(undefined, undefined, undefined, function (results) {
            $scope.dp = results.data;
            $scope.totalItems = $scope.dp.length;
            $scope.setItemsPerPage($scope.itemsPerPage);
        });
    };

    $scope.getRole = function () {
        $http({
            method: 'GET',
            url: 'api/public/role/' + $scope.currentRole.id
        }).then(function successCallback(response) {
            $scope.currentRole = response.data;
        }, function errorCallback(response) {
            alert(response.message);
        });
    };

    $scope.deleteRole = function (role) {
        $http({
            method: 'DELETE',
            url: 'api/public/role/' + role.id
        }).then(function successCallback(response) {
            $scope.roles.splice($scope.roles.indexOf(role), 1)
        }, function errorCallback(response) {
            alert(response.message);
        });
    };

    $scope.insertRole = function () {
        $http({
            method: 'POST',
            url: 'api/public/role',
            data: JSON.stringify($scope.currentRole)
        }).then(function successCallback(response) {
            $scope.roles.push(response.data);
        }, function errorCallback(response) {
            alert(response.message);
        });
    };

    $scope.updateRole = function () {
        $http({
            method: 'PUT',
            url: 'api/public/role/' + $scope.currentRole["id"],
            data: JSON.stringify($scope.currentRole)
        }).then(function successCallback(response) {
            //TODO : reply confirmation to user;
            //$scope.roles = response.data;
        }, function errorCallback(response) {
            alert(response);
        });
    };

    $scope.selectRole = function (role) {
        $scope.currentRole = role;
    };
    $scope.newRole = function () {
        $scope.currentRole = {role: "", descr: ""};
    };
}]);