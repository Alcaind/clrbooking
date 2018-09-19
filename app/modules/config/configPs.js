angular.module('Config')
    .controller('ConfigPsController', ['$scope', 'AuthenticationService', 'makeController', '$routeParams', 'api', 'globalVarsSrv', '$translate', function ($scope, AuthenticationService, makeController, $routeParams, api, globalVarsSrv, $translate) {
        var config = {};

        api.apiCall('GET', globalVarsSrv.getGlobalVar('appUrl') + '/config/' + $routeParams.id, function (results) {
            config = results.data;
            $scope.ctrl = makeController.mainController('/ps/config/' + $routeParams.id, 'psTableConf', $translate.instant("Κατοχυρωμένα μαθήματα στο ακαδημαϊκό έτος") + ' ' + config.year);
            $scope.ctrl.init();

            $scope.fromAnotherPage = true;


        });
    }])
;