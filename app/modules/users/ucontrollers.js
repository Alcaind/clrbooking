'use strict';

angular.module('Users', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules'
]).controller('UsersController', ['$scope', 'MakeModal', '$http', 'api', function ($scope, MakeModal, $http, api) {

    $scope.apiResults = [];
    $scope.dp = [];
    $scope.item = {};
    $scope.method = '';
    $scope.uRoles = [];

    $scope.usersApi = function (url, method, data, successCallback, errorCallback) {
        method = typeof method !== 'undefined' ? method : 'GET';
        data = typeof data !== 'undefined' ? data : null;
        url = typeof url !== 'undefined' ? url : 'api/public/users';
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
                $scope.modalMessage = "User Deleted";
                var modalInstance = MakeModal.defaultModal('lg', null, null, $scope);
                break;
            case 'PUT' :
                $scope.modalMessage = "User Updated";
                var modalInstance = MakeModal.defaultModal('lg', null, null, $scope);
                break;
            case 'POST' :
                $scope.dp.push(results.data);
                $scope.modalMessage = "User Inserted";
                var modalInstance = MakeModal.defaultModal('lg', null, null, $scope);
                break;
            case 'GET' :
                $scope.apiResults = results.data;
                break;
            default :
                $scope.apiResults = results.data;
                break
        }
    }

    $scope.errorCallback = function (results) {

    }

    $scope.getUsers = function () {
        $scope.usersApi(undefined, undefined, undefined, function (results) {
            $scope.dp = results.data;
        });
    };

    $scope.selectUser = function (user) {
        $scope.item = user;
    };

    $scope.getRoles = function (user) {
        $scope.usersApi('api/public/users/' + user.id + '/roles', 'GET', undefined, function (results) {
            $scope.uRoles = results.data;
        });
    };

    $scope.newUser = function () {
        $scope.item = {
            tm_id: "",
            fname: "",
            sname: "",
            phone: "",
            em_main: "",
            em_sec: "",
            em_pant: "",
            cat_id: "",
            comments: "",
            user: "",
            hash: ""
        }
    };

    $scope.updateUser = function (item) {
        $scope.usersApi(undefined, 'PUT', item);
    };

    $scope.deleteUser = function (item) {
        $scope.usersApi(undefined, 'DELETE', item);

    };

    $scope.saveUser = function (item) {
        $scope.usersApi(undefined, 'POST', item);
    };
}]);