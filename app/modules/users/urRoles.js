angular.module('Users')
    .controller('URolesController', ['$scope', 'AuthenticationService', 'makeController', function ($scope, AuthenticationService, makeController) {
        AuthenticationService.CheckCredentials();

        $scope.ctrl = makeController.n2nController('/users', 'roles');
        $scope.ctrl.init();

    }])

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
        $scope.urData = {comment: '', exp_dt: '', status: '1'};
        $scope.baseURL = 'api/public/users';
        $scope.state = 1;

        $scope.cancelUrData = function () {
            $scope.urData = null;
            $scope.currentRole = null;
        };

        $scope.insertRole = function () {
            var method = "PUT";
            if ($scope.state === 0) method = "POST";
            api.apiCall(method, $scope.baseURL + "/" + $routeParams.userId + '/roles/' + $scope.currentRole.id, function (results) {
                $scope.urData = {comment: '', exp_dt: '', status: '1'};
                $scope.uRoles = results.data;
                $scope.compare();
                $scope.cancelUrData();
            }, undefined, $scope.urData, undefined, $scope);
        };
    }]);