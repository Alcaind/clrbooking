'use strict';

angular.module('Roles', [
    'MainComponents',
    'ui.bootstrap',
    'Users'
]).controller('RolesController', ['$scope', '$http', function ($scope, $http) {

    $scope.roles = [];
    $scope.currentRole = {};

    $scope.getRoles = function () {
        $http({
            method: 'GET',
            url: 'api/public/roles'
        }).then(function successCallback(response) {
            $scope.roles = response.data;
        }, function errorCallback(response) {
            alert(response.message);
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