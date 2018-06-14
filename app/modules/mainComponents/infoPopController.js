angular.module('MainComponents')
    .directive('infoFormPopUp', function () {
        return {
            restrict: "EA",
            scope: {
                reqID: "="
            },
            templateUrl: 'modules/mainComponents/views/infoFormPopUp.html',
            controller: "infoFormPopUpController"
        }
    })

    .controller('infoFormPopUpController', ['$scope', 'globalVarsSrv', '$uibModalInstance', 'api', 'config', '$location', function ($scope, globalVarsSrv, $uibModalInstance, api, config, $location) {
        var baseURL = globalVarsSrv.getGlobalVar('appUrl');
        $scope.reqID = config.reqID;

        $scope.ok = function () {
            $uibModalInstance.close('ok');
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.mailTo = function (user) {
            window.open('mailto:' + user.em_main);
        };

        $scope.mailTm = function (requests) {
            // window.open('mailto:' + tm.supervisor.em_main);
            window.open('mailto:' + requests.users.em_main);
        };


        $scope.adminReq = function (id) {
            $location.path('/requests/' + id);
            $uibModalInstance.close();
        };

        $scope.getPop = function () {
            if ($location.url() === '/publicroombook') {
                baseURL = 'api/public';
                api.apiCall('GET', baseURL + "/publicroombook/" + $scope.reqID, function (results) {
                    $scope.mainData = results.data;
                    $scope.requests = {};

                    api.apiCall('GET', baseURL + '/requests/' + $scope.mainData.req_id, function (results) {
                        $scope.requests = results.data;
                    });
                });
            }

            api.apiCall('GET', baseURL + "/roombook/" + $scope.reqID, function (results) {
                $scope.mainData = results.data;
                $scope.requests = {};

                api.apiCall('GET', baseURL + '/requests/' + $scope.mainData.req_id, function (results) {
                    $scope.requests = results.data;
                    // api.apiCall('GET', baseURL + "/tms/" + $scope.requests.ps.tm_code, function (results) {
                    //     $scope.tm = results.data;

//                    })
                });
            });
        };
        $scope.uAdmin = function () {
            var auth = globalVarsSrv.getGlobalVar('auth');
            if (!auth && $location.path('/publicroombook')) {
                return true;
            }
            var cnt = 0;
            for (var i = 0; i < auth.authdata.roles[0].roles.length; i++) {
                if (auth.authdata.roles[0].roles[i].id === 4) {
                    cnt++;
                    return false;
                }
            }
            if (cnt === 0) {
                return true;
            }
        };
        $scope.getPop();
    }]);
