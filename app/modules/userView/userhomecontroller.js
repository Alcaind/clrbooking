'use strict';

angular.module('Users')
    .controller('UserViewTableController', ['$scope', '$location', 'api', '$uibModal', 'MakeModal', function ($scope, $location, api, $uibModal, MakeModal) {
        // $scope.baseURL = 'api/public/view';
        //$scope.search = {status: $scope.status};

        $scope.selectRow = function (item) {
            if ($scope.status === 1) return;

            if ($scope.status === 3) {
                $location.url('/usercreaterequests/' + item.id);
                return;
            }

            var $myModalInstance = $uibModal.open({
                templateUrl: 'modules/userView/userHome/popInfoPendingRequest.html',
                controller: 'popupUserReq',
                size: 'lg',
                resolve: {
                    config: function () {
                        return {rrID: item.id}
                    }
                }
            });
            //$myModalInstance.result.then(okCallback, cancelCallback);
        };

        $scope.deleteDashReq = function (item, $event) {

            api.apiCall('DELETE', 'api/public/requests/' + item.id, function (results) {
                $scope.dp.splice($scope.dp.indexOf(item), 1);
                MakeModal.generalInfoModal('sm', 'Info', 'info', 'Eπιτυχής διαγραφή', 1)
            });
            $event.stopPropagation();
        };


        $scope.editDashReq = function (item, $event) {
            $location.url('/usercreaterequests/' + item.id);
            $event.stopPropagation();
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
            $scope.expiredRequests = [];
            $scope.canceledRequests = [];
            $scope.doneRequests = [];
            $scope.draftRequests = [];
            $scope.pendingRequests = [];

            $scope.$watch('config_id', function (newVal) {
                api.apiCall('GET', 'api/public/requests/users/' + user.authdata.roles[0].id + '/config/' + newVal, function (results) {
                    var r = $scope.requests = results.data;
                    r.map(function (req) {
                        switch (req.status) {
                            case 0:
                                $scope.pendingRequests.push(req);
                                break;
                            case 1:
                                $scope.doneRequests.push(req);
                                break;
                            case 2:
                                $scope.expiredRequests.push(req);
                                break;
                            case 3:
                                $scope.draftRequests.push(req);
                                break;
                            case 4:
                                $scope.doneRequests.push(req);
                                break;
                        }
                    })
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

            $scope.selectRRid = function (id) {
                $location.url('/usercreaterequests/' + id);
                return;
            };

        }])
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