'use strict';

angular.module('Users')
    .controller('UserViewController', ['$scope', 'globalVarsSrv', 'ClrStatusSrv', 'api', '$routeParams', '$location', function ($scope, globalVarsSrv, ClrStatusSrv, api, $routeParams, $location) {
        // $scope.baseURL = 'api/public/view';
        $scope.statusOptions = ClrStatusSrv.getStatus('requestStatus');
        $scope.item = {};
        $scope.requests = {};
        $scope.search = {status: 2};

        var user = globalVarsSrv.getGlobalVar('auth');

        api.apiCall('GET', 'api/public/requests/users/' + user.authdata.roles[0].id, function (results) {
            $scope.requests = results.data;
        });

        $scope.selectRow = function (item) {
            $location.url('/usercreaterequests/' + item.id);
        }

    }])
    .directive('dashBoardTable', function () {
        return {
            restrict: 'EA',
            scope: {
                title: "@",
                status: "<",
                dp: "="
            },
            controller: 'UserViewController',
            templateUrl: 'modules/userView/userHome/dashboardTable.html'
        }

    });