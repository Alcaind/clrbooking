angular.module('Users')
    .controller('URequestsController', ['$scope', 'AuthenticationService', 'makeController', '$routeParams', 'api', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, $routeParams, api, globalVarsSrv) {
        var user = {};

        api.apiCall('GET', globalVarsSrv.getGlobalVar('appUrl') + "/users/" + $routeParams.id, function (results) {
            user = results.data;
            $scope.ctrl = makeController.mainController('/users/' + $routeParams.id + "/requests", 'requestsTableConf', "Κατοχυρωμένα αιτήματα στον " + user.user);
            $scope.ctrl.init();

            });

    }])
;
