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

    .controller('infoFormPopUpController', ['$scope', 'globalVarsSrv', '$uibModalInstance', 'api', 'config', function ($scope, globalVarsSrv, $uibModalInstance, api, config) {
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

        $scope.mailTm = function (tm) {
            window.open('mailto:' + tm.supervisor.em_main);
        };

        $scope.getPop = function () {
            api.apiCall('GET', baseURL + "/roombook/" + $scope.reqID, function (results) {
                $scope.mainData = results.data;
                $scope.requests = {};

                api.apiCall('GET', baseURL + '/requests/' + $scope.mainData.req_id, function (results) {
                    $scope.requests = results.data;
                    api.apiCall('GET', baseURL + "/tms/" + $scope.requests.ps.tm_code, function (results) {
                        $scope.tm = results.data;

                    })
                });
            });
        };
        $scope.getPop();
    }]);
