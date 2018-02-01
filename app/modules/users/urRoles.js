angular.module('Users')
    .controller('URolesController', ['$scope', 'MakeModal', 'api', 'orderByFilter', 'AuthenticationService', '$routeParams', function ($scope, MakeModal, api, orderBy, AuthenticationService, $routeParams) {
        AuthenticationService.CheckCredentials();
        $scope.uRoles = $scope.evRoles = [];
        $scope.urLength = $scope.evLength = 0;
        $scope.currentRole = null;
        $scope.baseURL = 'api/public/users';

        api.apiCall('GET', $scope.baseURL + "/" + $routeParams.userId + '/roles', function (results) {
            $scope.uRoles = results.data;
            $scope.urLength = $scope.uRoles.length;
            if ($scope.evRoles && $scope.evRoles.length > 0) {
                $scope.compare();
            }
        });

        api.apiCall('GET', 'api/public/roles', function (results) {
            $scope.evRoles = results.data;
            $scope.evLength = $scope.evRoles.length;
            if ($scope.uRoles && $scope.uRoles.length > 0) {
                $scope.compare();
            }
        });

        $scope.editUrData = function (role) {
            $scope.urData = role.pivot;
            $scope.currentRole = role;
        };

        $scope.showUrData = function (role) {
            $scope.currentRole = role;
        };

        $scope.deleteRole = function (rid) {
            api.apiCall('DELETE', $scope.baseURL + "/" + $routeParams.userId + '/roles/' + rid, function (results) {
                $scope.uRoles = results.data;
                $scope.compare();
            }, undefined, rid, undefined, $scope);
        };

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
    })
    .directive('urTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/users/uviews/urTable.html'
        }
    })
    .directive('evrTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/users/uviews/evrTable.html'
        }
    })
    .directive('evRolesForm', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/users/uviews/evRolesForm.html',
            controller: "EvRolesFormController"
        }
    })
    .controller('EvRolesFormController', ['$scope', 'api', '$routeParams', function ($scope, api, $routeParams) {
        $scope.urData = {comment: '', exp_dt: '', status: ''};
        $scope.baseURL = 'api/public/users';

        $scope.insertRole = function () {
            api.apiCall('POST', $scope.baseURL + "/" + $routeParams.userId + '/roles/' + $scope.currentRole.id, function (results) {
                $scope.uRoles = results.data;
                $scope.compare();
                $scope.currentRole = null;
            }, undefined, $scope.urData, undefined, $scope);

            $scope.cancelUrData = function () {
                $scope.urData = null;
                $scope.currentRole = null;
            };
        };
    }])