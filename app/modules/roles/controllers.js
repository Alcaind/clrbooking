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
    .controller('RolesUserController', ['$scope', 'AuthenticationService', 'makeController', function ($scope, AuthenticationService, makeController) {

        $scope.ctrl = makeController.n2nController('/roles', 'users', {comment: '', exp_dt: '', status: '1'});
        $scope.ctrl.init();

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
        $scope.baseURL = 'api/public/roles';

        $scope.cancelUrData = function () {
            $scope.ctrl.pivotData = null;
            $scope.ctrl.currentRight = null;
        };

        $scope.insertRole = function () {
            var method = "PUT";
            if ($scope.ctrl.state === 0) method = "POST";
            api.apiCall(method, $scope.baseURL + "/" + $routeParams.id + '/users/' + $scope.ctrl.currentRight.id, function (results) {
                $scope.ctrl.pivotData = Object.assign({}, $scope.ctrl.pivotTable);
                $scope.ctrl.ldp = results.data;
                $scope.ctrl.compare($scope.ctrl.ldp, $scope.ctrl.rdp);
                $scope.cancelUrData();
            }, undefined, $scope.ctrl.pivotData);
        };
    }]);