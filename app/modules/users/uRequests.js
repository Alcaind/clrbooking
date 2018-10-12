angular.module('Users')
    .controller('URequestsController', ['$scope', 'AuthenticationService', 'makeController', '$routeParams', 'api', 'globalVarsSrv', '$translate',
        function ($scope, AuthenticationService, makeController, $routeParams, api, globalVarsSrv, $translate) {
            var user = {};
            $scope.configs = {};
            $scope.fromAnotherPage = true;
            $scope.acceptShow = false;



            api.apiCall('GET', globalVarsSrv.getGlobalVar('appUrl') + '/users/' + $routeParams.id, function (results) {
                user = results.data;
                $scope.ctrl = makeController.mainController('/requests/users/' + $routeParams.id, 'requestsTableConf', $translate.instant('Κατοχυρωμένα αιτήματα στον') + ' ' + user.user);
                $scope.ctrl.init();
                $scope.statusOptions = globalVarsSrv.getGlobalVar('requestStatus');
                api.apiCall('GET', 'api/public/config', function (results) {
                    $scope.configs = results.data;
                });
            });
            $scope.THLbutton = function (item) {
                $scope.ctrl.operations[2].ifVisible = true;
                if (item.room_use.id !== 7) {
                    $scope.ctrl.operations[2].ifVisible = false;
                }
            };
        }])
;
