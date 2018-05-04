angular.module('Config')
    .controller('ConfigPsController', ['$scope', 'AuthenticationService', 'makeController', '$routeParams', 'api', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, $routeParams, api, globalVarsSrv) {
        var config = {};

        api.apiCall('GET', globalVarsSrv.getGlobalVar('appUrl') + '/config/' + $routeParams.id, function (results) {
            config = results.data;
            $scope.ctrl = makeController.mainController('/ps/config/' + $routeParams.id, 'psTableConf', "Κατοχυρωμένα μαθήματα στο ακαδημαϊκό έτος " + config.year);
            $scope.ctrl.init();

        });
    }])
;