angular.module('Rooms')
    .controller('RoomRequestsController', ['$scope', 'AuthenticationService', 'makeController', '$routeParams', 'api', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, $routeParams, api, globalVarsSrv) {
        var room = {};

        api.apiCall('GET', globalVarsSrv.getGlobalVar('appUrl') + "/rooms/" + $routeParams.id, function (results) {
            room = results.data;
            $scope.ctrl = makeController.mainController('/rooms/' + $routeParams.id + '/requests', 'requestsTableConf', "Κατοχυρωμένα αιτήματα στην αίθουσα " + room.name);
            $scope.ctrl.init();

        })
    }])
    .controller('RoomRequestsProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api) {
        $scope.ctrl = makeController.profileController('/rooms/requests', 'reqguestsTableConf');
        $scope.ctrl.init();
        $scope.ctrl.item['room_id'] = $routeParams.rid;


        $scope.users = {};

        api.apiCall('GET', 'api/public/users', function (results) {
            $scope.users = results.data;
        });

        $scope.periods = {};

        api.apiCall('GET', 'api/public/periods', function (results) {
            $scope.periods = results.data;
        });

        $scope.admin = [];

        api.apiCall('GET', 'api/public/users', function (results) {
            for (var i = 0; i < results.data.length; i++) {
                if (results.data[i].cat_id === 9) $scope.admin.push(results.data[i]);
            }
        });

        $scope.getAdmin = function (adminId) {
            for (var i = 0; i < $scope.admin.length; i++) {
                if ($scope.admin[i].id === adminId) return $scope.admin[i].user;
            }
        };
    }])
    .component('reqRoomsProfile', {
        restrict: 'EA',
        templateUrl: 'modules/requests/reqviews/profile.html',
        scope: {
            method: '='
        },
        controller: 'RoomRequestsProfileController'
    })
;