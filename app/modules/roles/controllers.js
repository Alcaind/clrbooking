'use strict';

angular.module('Roles', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Users'
]).controller('RolesController', ['$scope', 'MakeModal', '$http', 'api', 'orderByFilter', 'AuthenticationService', function ($scope, MakeModal, $http, api, orderBy, AuthenticationService) {


    AuthenticationService.CheckCredentials();

    $scope.apiResults = [];
    $scope.dp = [];
    $scope.item = {};
    $scope.method = '';

    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.totalItems = 5;

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

    $scope.successCallback = function (results) {
        switch ($scope.method) {
            case 'DELETE' :
                $scope.dp.splice($scope.dp.indexOf($scope.item), 1);
                $scope.item = {};
                $scope.modalMessage = "Role Deleted";
                var modalInstance = MakeModal.defaultModal('lg', null, null, $scope);
                break;
            case 'PUT' :
                $scope.modalMessage = "Role Updated";
                var modalInstance = MakeModal.defaultModal('lg', null, null, $scope);
                break;
            case 'POST' :
                $scope.dp.push(results.data);
                $scope.modalMessage = "Role Inserted";
                var modalInstance = MakeModal.defaultModal('lg', null, null, $scope);
                break;
            case 'GET' :
                $scope.apiResults = results.data;
                break;
            default :
                $scope.apiResults = results.data;
                break
        }
    };

    $scope.errorCallback = function (results) {

    };

    $scope.getRoles = function () {
        $scope.rolesApi(undefined, undefined, undefined, function (results) {
            $scope.dp = results.data;
            $scope.totalItems = results.data.length;
        });
    };

    $scope.deleteRole = function (item) {
        $scope.rolesApi('api/public/roles/' + item.id, 'DELETE', item);

    };


    $scope.propertyName = 'role';
    $scope.reverse = true;
    $scope.sorttable = orderBy($scope.dp, $scope.propertyName, $scope.reverse);

    $scope.sortBy = function (propertyName) {
        $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
            ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.getRoles();


}])
    .controller('RoleProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, AuthenticationService) {
        AuthenticationService.CheckCredentials();

        if (!$routeParams.roleId) {
            $scope.item = {
                role: "",
                descr: ""
            };
        } else {
            api.apiCall('GET', 'api/public/roles/' + $routeParams.roleId, function (results) {
                $scope.item = results.data;
            });
        }

        $scope.updateRole = function (item) {
            api.apiCall('PUT', 'api/public/roles/' + item.id, function (results) {
                $scope.modalMessage = "Role Updated";
                var modalInstance = MakeModal.defaultModal('lg', null, null, $scope);
            }, undefined, item, undefined, $scope)
        };

        $scope.saveRole = function (item) {
            api.apiCall('POST', 'api/public/roles', function (results) {
                var modalInstance = MakeModal.infoModal('lg', "Role Created");

            }, undefined, item, undefined, $scope)
        };
    }])


    .component('rolesProfile', {
        restrict: 'EA',
        templateUrl: 'modules/roles/views/profile.html',
        scope: {
            method: '=method'
        },
        controller: 'RoleProfileController'
    })
    .component('rolesUsers', {
        restrict: 'EA',
        templateUrl: 'modules/roles/views/rolesusers.html',
        scope: {
            method: '=method'
        },
        controller: 'RolesUserController'
    })
    .controller('RolesUserController', ['$scope', 'api', '$routeParams', 'orderByFilter', function ($scope, api, $routeParams, orderBy) {

        $scope.dp = [];
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        $scope.totalItems = 5;

        api.apiCall('GET', 'api/public/roles/' + $routeParams.roleId + '/users', function (results) {
            $scope.dp = results.data;
            $scope.totalItems = results.data.length;
        })

        $scope.propertyName = 'user';
        $scope.reverse = true;
        $scope.sorttable = orderBy($scope.dp, $scope.propertyName, $scope.reverse);

        $scope.sortBy = function (propertyName) {
            $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
                ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };
    }])


;