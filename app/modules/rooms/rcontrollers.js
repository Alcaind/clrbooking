'use strict';

angular.module('Rooms', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
])
    .controller('RoomsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, api) {

        $scope.ctrl = makeController.mainController('/rooms', 'roomsTableConf', 'Κατάλογος Αιθουσών');
        $scope.ctrl.init();

        $scope.deleteUsage = function (id) {
            api.apiCall('DELETE', ctrl.baseURL + "/" + $routeParams.id + '/' + table + '/' + id, function (results) {
                ctrl.ldp = results.data;
                ctrl.compare(ctrl.ldp, ctrl.rdp);
            }, undefined, id);
        };

    }])

    .controller('RoomProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, $routeParams, api, MakeModal, AuthenticationService, makeController, globalVarsSrv) {
        $scope.ctrl = makeController.profileController('/rooms', 'roomsTableConf');
        $scope.ctrl.init();

        $scope.categories = [];
        $scope.roomusages = [];
        $scope.configs = [];
        $scope.tms = [];
        $scope.selectedUsages = [];
        $scope.multiSelectOptions = {displayProp: 'synt'};

        api.apiCall('GET', 'api/public/roomcategory', function (result) {
            $scope.categories = result.data;
        });
        api.apiCall('GET', 'api/public/config', function (result) {
            $scope.configs = result.data;
        });
        api.apiCall('GET', 'api/public/roomuse', function (result) {
            $scope.roomusages = result.data;
            $scope.roomusages.forEach(function (element) {
                element.label = element.synt;
            });
        });
        api.apiCall('GET', 'api/public/tms', function (result) {
            $scope.tms = result.data;
        });


    }])
    .component('roomProfile', {
        restrict: 'EA',
        templateUrl: 'modules/rooms/rviews/rprofile.html',
        scope: {
            method: '='
        },
        controller: 'RoomProfileController'
    })
;