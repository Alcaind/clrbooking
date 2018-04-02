'use strict';

angular.module('Users')
    .controller('UserViewController', ['$scope', 'globalVarsSrv', 'ClrStatusSrv', 'api', function ($scope, globalVarsSrv, ClrStatusSrv, api) {
        // $scope.baseURL = 'api/public/view';
        $scope.statusOptions = ClrStatusSrv.getStatus('requestStatus');
        $scope.item = {};
        $scope.requests = {};
        $scope.search = {status: 2};

        var user = globalVarsSrv.getGlobalVar('auth');

        api.apiCall('GET', 'api/public/requests/users/' + user.authdata.roles[0].id, function (results) {
            $scope.requests = results.data;
        });

    }])
    .directive('dashBoardTable', function () {
        return {
            restrict: 'EA',
            scope: {
                title: "@",
                status: "<",
                dp: "="
            },
            templateUrl: 'modules/userView/userHome/dashboardTable.html'
        }

    });