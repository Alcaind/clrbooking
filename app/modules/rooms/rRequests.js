angular.module('Rooms')
    .controller('RoomRequestsController', ['$scope', 'AuthenticationService', 'makeController', '$routeParams', 'api', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, $routeParams, api, globalVarsSrv) {
        var room = {};

        api.apiCall('GET', globalVarsSrv.getGlobalVar('appUrl') + "/rooms/" + $routeParams.id, function (results) {
            room = results.data;
            $scope.ctrl = makeController.mainController('/requests/rooms/' + $routeParams.id, 'requestsTableConf', "Κατοχυρωμένα αιτήματα στην αίθουσα " + room.name);
            $scope.ctrl.init();

        });
    }]);
