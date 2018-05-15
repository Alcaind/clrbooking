'use strict';

angular.module('Users')
    .controller('UserViewTableController', ['$scope', '$location', 'api', '$uibModal', function ($scope, $location, api, $uibModal) {
        // $scope.baseURL = 'api/public/view';

        $scope.search = {status: $scope.status};

        $scope.selectRow = function (item) {

            var $myModalInstance = $uibModal.open({
                templateUrl: 'modules/userview/userHome/popInfoPendingRequest.html',
                controller: 'popupUserReq',
                size: 'lg',
                resolve: {
                    config: function () {
                        return {rrID: item.id}
                    }
                }
            });
            //$myModalInstance.result.then(okCallback, cancelCallback);

            if ($scope.status === 3)
            $location.url('/usercreaterequests/' + item.id);
        };
        //
        // $scope.showStatus = function () {
        //     if ($scope.search === 3) {
        //         return true;
        //     }
        // };

    }])
    .controller('UserViewController', ['$scope', 'globalVarsSrv', 'ClrStatusSrv', 'api', '$routeParams', '$location', 'AuthenticationService',
        function ($scope, globalVarsSrv, ClrStatusSrv, api, $routeParams, $location, AuthenticationService) {
            $scope.statusOptions = ClrStatusSrv.getStatus('requestStatus');
            $scope.requests = {};

            AuthenticationService.CheckCredentials();

            var user = globalVarsSrv.getGlobalVar('auth');

            api.apiCall('GET', 'api/public/config', function (results) {
                $scope.config = results.data;
            });

            $scope.config_id = 1;
            $scope.$watch('config_id', function (newVal) {
                api.apiCall('GET', 'api/public/requests/users/' + user.authdata.roles[0].id + '/config/' + newVal, function (results) {
                    $scope.requests = results.data;

                });
            });

            $scope.usersrequests = {};
            api.apiCall('GET', 'api/public/usersrequests/' + user.authdata.roles[0].id, function (results) {
                $scope.usersrequests = results.data;
            });

            $scope.acceptReq = function (item) {
                item.status = 1;
                item.to_comment = item.to_comment + ' Approved';

                api.apiCall('PUT', 'api/public/usersrequests/' + item.id, function (results) {
                    $scope.usersrequests.splice($scope.usersrequests.indexOf(item), 1);
                }, undefined, item);
            };

            $scope.declineReq = function (item) {
                item.status = -1;
                item.to_comment = item.to_comment + ' decline from ' + item.tousers.fname;

                api.apiCall('PUT', 'api/public/usersrequests/' + item.id, function (results) {
                    $scope.usersrequests.splice($scope.usersrequests.indexOf(item), 1);
                }, undefined, item);
            };

        }])
    //.controller('popInfoPendingRequestController', ['api','$scope',  '$uibModalInstance','config',function (api,$scope,$uibModalInstance,config) {
    .controller('popupUserReq', ['api', '$scope', '$uibModalInstance', 'config', function (api, $scope, $uibModalInstance, config) {

        $scope.rrID = config.rrID;
        $scope.dp = [];


        $scope.ok = function () {
            $uibModalInstance.close('ok')
        };

        api.apiCall('GET', 'api/public/pendingrequests/' + $scope.rrID, function (results) {
            $scope.dp = results.data;
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
            controller: 'UserViewTableController',
            templateUrl: 'modules/userView/userHome/dashboardTable.html'
        }
    })


;