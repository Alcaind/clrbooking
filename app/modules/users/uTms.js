angular.module('Users')
    .controller('UsersTmsController', ['$scope', 'AuthenticationService', 'makeController', function ($scope, AuthenticationService, makeController) {

        $scope.ctrl = makeController.n2nController('/users', 'tms', {comments: ''});
        $scope.ctrl.init();
    }])

    .directive('rUTmsTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/users/utms/urTable.html'
        }
    })
    .directive('lUTmsTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/users/utms/evrTable.html'
        }
    })
    .directive('evUTmsForm', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/users/utms/evItemForm.html'
        }
    })
;