'use strict';

angular.module('Users')
    .controller('UserViewTableController', ['$scope', '$location', function ($scope, $location) {
        // $scope.baseURL = 'api/public/view';

        $scope.search = {status: $scope.status};

        $scope.selectRow = function (item) {
            if ($scope.status === 1 || $scope.status === 2) return;
            $location.url('/usercreaterequests/' + item.id);
        }

    }])
    .controller('UserViewController', ['$scope', 'globalVarsSrv', 'ClrStatusSrv', 'api', '$routeParams', '$location', 'AuthenticationService',
        function ($scope, globalVarsSrv, ClrStatusSrv, api, $routeParams, $location, AuthenticationService) {
            $scope.statusOptions = ClrStatusSrv.getStatus('requestStatus');
            $scope.requests = {};

            AuthenticationService.CheckCredentials();

            var user = globalVarsSrv.getGlobalVar('auth');

            api.apiCall('GET', 'api/public/requests/users/' + user.authdata.roles[0].id, function (results) {
                $scope.requests = results.data;
            });
        }
    ])
    .directive('dashBoardTable', function () {
        return {
            restrict: 'EA',
            scope: {
                title: "@",
                status: "<",
                dp: "="
            },
            controller: 'UserViewTableController',
            templateUrl: 'modules/userView/userHome/dashboardTable.html'
        }
    });