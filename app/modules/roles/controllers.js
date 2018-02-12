'use strict';

angular.module('Roles', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication'
])
    .controller('RolesController', ['$scope', 'MakeModal', 'api', 'orderByFilter', 'AuthenticationService', '$routeParams', function ($scope, MakeModal, api, orderBy, AuthenticationService, $routeParams) {
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
                MakeModal.generalInfoModal('sm', 'Info', 'info', 'Ο ρόλος διαγράφηκε.', 1)
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
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Ο ρόλος ανανεώθηκε.', 1);
                history.back();
            }, undefined, item)

        };

        $scope.saveRole = function (item) {
            api.apiCall('POST', $scope.baseURL, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Δημιουργία νέου ρόλου.', 1);
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
    .controller('RolesUserController', ['$scope', 'MakeModal', 'api', '$routeParams', 'orderByFilter', function ($scope, MakeModal, api, $routeParams, orderBy) {
        $scope.baseURL = 'api/public/roles';
        $scope.dp = [];
        $scope.currentRole = {};
        $scope.userTable = {};
        $scope.totalItemsL = $scope.totalItemsR = 0;
        $scope.currentUser = null;
        $scope.rData = {};

        api.apiCall('GET', $scope.baseURL + "/" + $routeParams.roleId, function (results) {
            $scope.rData = results.data;
        });

        $scope.getUsersRole = function () {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.roleId + '/users', function (results) {
                $scope.dp = results.data;
                $scope.totalItemsL = results.data.length;
                if ($scope.userTable && $scope.userTable.length > 0) {
                    $scope.compare();
                }
            });
        };
        $scope.getUsersRole();

        $scope.deleteUserRole = function (item) {
            api.apiCall('DELETE', 'api/public/users/' + item.id + "/roles/" + $routeParams.roleId, function (results) {
                $scope.dp.splice($scope.dp.indexOf(item), 1);
                $scope.item = {};
                $scope.compare();
                MakeModal.generalInfoModal('sm', 'Info', 'info', 'Ο ρόλος από τον χρήστη διαγράφηκε', 1)
            });
        };

        api.apiCall('GET', 'api/public/users', function (results) {
            $scope.userTable = results.data;
            $scope.totalItemsR = results.data.length;
            if ($scope.dp && $scope.dp.length > 0) {
                $scope.compare();
            }
        });

        api.apiCall('GET', $scope.baseURL + "/" + $routeParams.roleId, function (results) {
            $scope.currentRole = results.data;
        });

        $scope.editUrData = function (user) {
            $scope.urData = user.pivot;
            $scope.currentUser = user;
            $scope.state = 1;
        };

        $scope.showUrData = function (user) {
            $scope.currentUser = user;
            $scope.state = 0;
        };

        $scope.propertyName = 'user';
        $scope.reverse = true;
        $scope.sorttable = orderBy($scope.dp, $scope.propertyName, $scope.reverse);

        $scope.sortBy = function (propertyName) {
            $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
                ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };

        $scope.compare = function () {
            for (var i = 0; i < $scope.userTable.length; i++) {
                $scope.userTable[i].disabled = false;
                for (var j = 0; j < $scope.dp.length; j++)
                    if (angular.equals($scope.dp[j].id, $scope.userTable[i].id))
                        $scope.userTable[i].disabled = true;
            }
        }

    }])
    .directive('urUserTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/roles/views/urTable.html'
        }
    })
    .directive('evrUserTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/roles/views/evrTable.html'
        }
    })

    .directive('evUsersRolesForm', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/roles/views/evRolesForm.html',
            controller: "EvUserRolesFormController"
        }
    })
    .controller('EvUserRolesFormController', ['$scope', 'api', '$routeParams', function ($scope, api, $routeParams) {
        $scope.urData = {comment: '', exp_dt: '', status: 1};
        $scope.state = 1;

        $scope.insertRole = function () {
            var method = "PUT";
            if ($scope.state === 0) method = "POST";
            api.apiCall(method, 'api/public/users/' + $scope.currentUser.id + '/roles/' + $routeParams.roleId, function (results) {
                $scope.uRoles = results.data;
                $scope.urData = {comment: '', exp_dt: '', status: 1};
                $scope.currentUser = null;
                $scope.getUsersRole();
            }, undefined, $scope.urData, undefined, $scope);

            $scope.cancelUrData = function () {
                $scope.urData = null;
                $scope.currentUser = null;
            };
        };
    }])
;