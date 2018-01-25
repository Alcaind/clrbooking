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
        $scope.pageThresholds = [{th: 'all'}, {th: 3}, {th: 5}, {th: 10}, {th: 20}, {th: 50}];

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
                $scope.setItemsPerPage($scope.itemsPerPage);
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

        $scope.totalItems = 40;
        $scope.currentPage = 1;
        $scope.itemsPerPage = 'all';
        $scope.maxSize = 5; //Number of pager buttons to show
        //$scope.totalItems = 0;

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.setItemsPerPage = function (num) {
            $scope.itemsPerPage = num === 'all' ? $scope.totalItems : num;
            $scope.currentPage = 1; //reset to first page
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
    .controller('URequestsController', ['$scope', '$routeParams', 'api', 'AuthenticationService', function ($scope, $routeParams, api, AuthenticationService) {
        AuthenticationService.CheckCredentials();
        api.apiCall('GET', 'api/public/users/' + $routeParams.userId + '/requests', function (results) {
            $scope.uRequest = results.data;
        });
    }])
    .component('usersRequests', {
        scope: {
            itemId: '=itemId'
        }
    })
    .controller('URolesController', ['$scope', '$routeParams', 'api', 'AuthenticationService', function ($scope, $routeParams, api, AuthenticationService) {
        AuthenticationService.CheckCredentials();
        $scope.uRoles = $scope.evRoles = null;

        api.apiCall('GET', 'api/public/users/' + $routeParams.userId + '/roles', function (results) {
            $scope.uRoles = results.data;
            if ($scope.evRoles) {
                $scope.compare();
            }
        });

        api.apiCall('GET', 'api/public/roles', function (results) {
            $scope.evRoles = results.data;
            if ($scope.uRoles) {
                $scope.compare();
            }
        });

        $scope.currentRole = null;
        $scope.urData = {comment: '', exp_dt: '', status: ''};

        $scope.editUrData = function (role) {
            $scope.urData = role.pivot;
            $scope.currentRole = role;
        }

        $scope.showUrData = function (role) {
            $scope.currentRole = role;
        }

        $scope.cancelUrData = function () {
            $scope.urData = null;
            $scope.currentRole = null;
        }

        $scope.insertRole = function () {
            api.apiCall('POST', 'api/public/users/' + $routeParams.userId + '/roles/' + $scope.currentRole.id, function (results) {
                $scope.uRoles = results.data;
                //$scope.evRoles.slice($scope.evRoles.)
                $scope.currentRole = null;
            }, undefined, $scope.urData, undefined, $scope);
        }

        $scope.deleteRole = function (rid) {
            api.apiCall('DELETE', 'api/public/users/' + $routeParams.userId + '/roles/' + rid, function (results) {
                $scope.uRoles = results.data;
                //$scope.evRoles.slice($scope.evRoles.)
            }, undefined, rid, undefined, $scope);
        }

        $scope.compare = function () {
            for (var i = 0; i < $scope.evRoles.length; i++) {
                $scope.evRoles[i].disabled = false;
                for (var j = 0; j < $scope.uRoles.length; j++)
                    if (angular.equals($scope.uRoles[j].id, $scope.evRoles[i].id))
                        $scope.evRoles[i].disabled = true;
            }
        }
    }])

    .component('usersRoles', {
        scope: {
            itemId: '=itemId'
        }
    });
