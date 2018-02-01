'use strict';

angular.module('Roles', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication'

]).controller('RolesController', ['$scope', 'MakeModal', 'api', 'orderByFilter', 'AuthenticationService', function ($scope, MakeModal, api, orderBy, AuthenticationService) {
    AuthenticationService.CheckCredentials();
    $scope.dp = [];
    $scope.item = {};
    $scope.method = '';
    $scope.baseURL = 'api/public/roles';

    $scope.getRoles = function () {
        api.apiCall('GET', $scope.baseURL, function (results) {
            $scope.dp = results.data;
            $scope.totalItems = $scope.dp.length;
        });
    };

    $scope.deleteRole = function (item) {
        api.apiCall('DELETE', $scope.baseURL + "/" + item.id, function (results) {
            $scope.dp.splice($scope.dp.indexOf(item), 1);
            $scope.item = {};
            MakeModal.generalInfoModal('sm', 'Info', 'info', 'Role Deleted', 1)
        });
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
        $scope.baseURL = 'api/public/roles';

        if (!$routeParams.roleId) {
            $scope.item = {
                role: "",
                descr: ""
            };
        } else {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.roleId, function (results) {
                $scope.item = results.data;
            });
        }

        $scope.updateRole = function (item) {
            api.apiCall('PUT', $scope.baseURL + "/" + item.id, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Role Updated', 1);
                history.back();
            }, undefined, item)

        };

        $scope.saveRole = function (item) {
            api.apiCall('POST', $scope.baseURL, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Role Created', 1);
                history.back();
            }, undefined, item)
        };
    }])


    .component('rolesProfile', {
        restrict: 'EA',
        templateUrl: 'modules/roles/views/profile.html',
        scope: {
            method: '='
        },
        controller: 'RoleProfileController'
    })
    .component('rolesUsers', {
        restrict: 'EA',
        templateUrl: 'modules/roles/views/rolesusers.html',
        scope: {
            method: '='
        },
        controller: 'RolesUserController'
    })
    .controller('RolesUserController', ['$scope', 'api', '$routeParams', 'orderByFilter', function ($scope, api, $routeParams, orderBy) {
        $scope.baseURL = 'api/public/roles';
        $scope.dp = [];

        api.apiCall('GET', $scope.baseURL + "/" + $routeParams.roleId + '/users', function (results) {
            $scope.dp = results.data;
            $scope.totalItems = results.data.length;
        });

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