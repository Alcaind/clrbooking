angular.module('Users')
    .controller('URolesController', ['$scope', 'AuthenticationService', 'makeController', function ($scope, AuthenticationService, makeController) {

        $scope.ctrl = makeController.n2nController('/users', 'roles', {comment: '', exp_dt: '', status: '1'});
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
        $scope.baseURL = 'api/public/users';

        $scope.cancelUrData = function () {
            $scope.ctrl.pivotData = null;
            $scope.ctrl.currentRight = null;
        };

        $scope.insertRole = function () {
            var method = "PUT";
            if ($scope.ctrl.state === 0) method = "POST";
            api.apiCall(method, $scope.baseURL + "/" + $routeParams.id + '/roles/' + $scope.ctrl.currentRight.id, function (results) {
                $scope.ctrl.pivotData = Object.assign({}, $scope.ctrl.pivotTable);
                $scope.ctrl.ldp = results.data;
                $scope.ctrl.compare($scope.ctrl.ldp, $scope.ctrl.rdp);
                $scope.cancelUrData();
            }, undefined, $scope.ctrl.pivotData);
        };
    }]);