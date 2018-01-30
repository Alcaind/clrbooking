'use strict';

angular.module('Users', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication'
])
    .controller('UsersController', ['$scope', 'MakeModal', '$http', 'api', 'orderByFilter', 'AuthenticationService', function ($scope, MakeModal, $http, api, orderBy, AuthenticationService) {

        AuthenticationService.CheckCredentials();

        $scope.apiResults = [];
        $scope.dp = [];
        $scope.item = {};
        $scope.method = '';

        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        $scope.totalItems = 5;

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
        };

        $scope.errorCallback = function (results) {

        };

        $scope.getUsers = function () {
            $scope.usersApi(undefined, undefined, undefined, function (results) {
                $scope.dp = results.data;
                $scope.totalItems = $scope.dp.length;
            });
        };

        $scope.getRoles = function (user) {
            $scope.usersApi('api/public/users/' + user.id + '/roles', 'GET', undefined, function (results) {
                $scope.uRoles = results.data;
            });
        };

        $scope.deleteUser = function (item) {
            $scope.usersApi('api/public/users/' + item.id, 'DELETE', item);
        };

        $scope.propertyName = 'fname';
        $scope.reverse = true;
        $scope.sorttable = orderBy($scope.dp, $scope.propertyName, $scope.reverse);

        $scope.sortBy = function (propertyName) {
            $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
                ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };


        $scope.getUsers();
    }])

    .controller('ProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, AuthenticationService) {
        AuthenticationService.CheckCredentials();
        $scope.tms = {};
        $scope.ucategories = {};

        api.apiCall('GET', 'api/public/tms', function (results) {
            $scope.tms = results.data;
        });

        api.apiCall('GET', 'api/public/ucategories', function (results) {
            $scope.ucategories = results.data;
        });

        if (!$routeParams.userId) {
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
        } else {
            api.apiCall('GET', 'api/public/users/' + $routeParams.userId, function (results) {
                $scope.item = results.data;
            });
        }

        $scope.updateUser = function (item) {
            api.apiCall('PUT', 'api/public/users/' + item.id, function (results) {
                $scope.modalMessage = "User Updated";
                var modalInstance = MakeModal.defaultModal('lg', null, null, $scope);
            }, undefined, item, undefined, $scope)
        };

        $scope.saveUser = function (item) {

            api.apiCall('POST', 'api/public/users', function (results) {
                var modalInstance = MakeModal.infoModal('lg', "User Created");

            }, undefined, item, undefined, $scope)
        };
    }])

    .component('usersProfile', {
        restrict: 'EA',
        templateUrl: 'modules/users/uviews/profile.html',
        scope: {
            itemId: '=itemId',
            method: '=method'
        },
        controller: 'ProfileController'
    })

    .directive('pwCheck', [function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.pwCheck;
                elem.add(firstPassword).on('keyup', function () {
                    scope.$apply(function () {
                        // console.info(elem.val() === $(firstPassword).val());
                        ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                    });
                });
            }
        }
    }])
;
