'use strict';

angular.module('Roles', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
])
    .controller('RolesController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api) {
        $scope.ctrl = makeController.mainController('/roles', 'rolesTableConf', 'Κατάλογος Ρόλων');
        $scope.ctrl.init();

    }])
    .controller('RoleProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, $routeParams, api, MakeModal, AuthenticationService, makeController, globalVarsSrv) {

        $scope.ctrl = makeController.profileController('/roles', 'rolesTableConf');
        $scope.ctrl.init();
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
    .controller('RolesUserController', ['$scope', 'AuthenticationService', 'makeController', 'ClrStatusSrv', function ($scope, AuthenticationService, makeController, ClrStatusSrv) {

        $scope.ctrl = makeController.n2nController('/roles', 'users', {comment: '', exp_dt: '', status: '0'});
        $scope.ctrl.init();

        $scope.statusOptions = ClrStatusSrv.getStatus('userRoleStatus');


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
            templateUrl: 'modules/roles/views/evRolesForm.html'
        }
    })
;