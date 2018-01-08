'use strict';

angular.module('Users', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules'
]).controller('UsersController', ['$scope', 'MakeModal', '$http', 'api', 'orderByFilter', function ($scope, MakeModal, $http, api, orderBy) {

    $scope.apiResults = [];
    $scope.dp = [];
    $scope.item = {};
    $scope.method = '';

    $scope.uRoles = [];
    $scope.uRequest = [];

    $scope.profileShow = false;
    $scope.rolesShow = false;
    $scope.newUser = {
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
    };
    $scope.viewState = [];

    function intiSates() {
        $scope.viewState['mainTable'] = true;
        $scope.viewState['profile'] = false;
        $scope.viewState['roles'] = false;
        $scope.viewState['requests'] = false;
    }

    $scope.showState = function (div, state) {
        for (var item in $scope.viewState) {
            $scope.viewState[item] = false;
            if (item === div) {
                $scope.viewState[item] = state;
            }
        }
    }

    intiSates();

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
                $scope.showState('mainTable', true);
                break;
            case 'POST' :
                $scope.dp.push(results.data);
                $scope.modalMessage = "User Inserted";
                var modalInstance = MakeModal.defaultModal('lg', null, null, $scope);
                $scope.showState('mainTable', true);
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
            $scope.showState('mainTable', true);
        });
    };

    $scope.selectUser = function (user) {
        $scope.item = user;
        $scope.showState('profile', true)
    };

    $scope.getRoles = function (user) {
        $scope.usersApi('api/public/users/' + user.id + '/roles', 'GET', undefined, function (results) {
            $scope.uRoles = results.data;
            $scope.showState('roles', true);
        });
    };

    $scope.getRequests = function (user) {
        $scope.usersApi('api/public/users/' + user.id + '/requests', 'GET', undefined, function (results) {
            $scope.uRequest = results.data;
            $scope.showState('requests', true)
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
        };
        $scope.showState('profile', true);
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
}])
// -------------------------------------------------------------------------------------------
    .controller('OrderByController', ['$scope', 'orderByFilter', function ($scope, orderBy) {

        $scope.propertyName = 'fname';
        $scope.reverse = true;
        $scope.sorttable = orderBy($scope.dp, $scope.propertyName, $scope.reverse);

        $scope.sortBy = function (propertyName) {
            $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
                ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
            $scope.dp = orderBy($scope.dp, $scope.propertyName, $scope.reverse);
        };

    }])


;
