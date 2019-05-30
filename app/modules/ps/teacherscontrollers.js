angular.module('Ps')
    .controller('TeachersController', ['$scope', 'AuthenticationService', 'makeController', 'ClrStatusSrv', function ($scope, AuthenticationService, makeController, ClrStatusSrv) {
        $scope.ctrl = makeController.n2nController('/ps', 'users', {comment: ''});
        $scope.ctrl.init();

        $scope.$watch('ctrl.rdp', function (newVal) {
            if (!newVal) return;
            for (var i = $scope.ctrl.rdp.length - 1; i >= 0; i--) {
                if ($scope.ctrl.rdp[i].cat_id !== 7) {
                    $scope.ctrl.rdp.splice(i, 1);
                }
            }
        });

    }])

    .directive('lTeacherPsTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/ps/teachers/urTable.html'
        }
    })
    .directive('rTeacherPsTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/ps/teachers/evrTable.html'
        }
    })
    .directive('evTeacherPsForm', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/ps/teachers/evItemsForm.html'
        }
    });