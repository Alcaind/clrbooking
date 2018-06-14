angular.module('Users')
    .controller('UsersTmsController', ['$scope', 'AuthenticationService', 'makeController', 'api', function ($scope, AuthenticationService, makeController, api) {

        $scope.ctrl = makeController.n2nController('/users', 'tms', {comments: '', defaultTm: ''});
        $scope.ctrl.init();

        $scope.tms = {};

        api.apiCall('GET', 'api/public/tms', function (results) {
            $scope.tms = results.data;
        });
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