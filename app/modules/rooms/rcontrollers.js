'use strict';

angular.module('Rooms', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
])
    .controller('RoomsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', 'api', 'MakeModal', 'ClrStatusSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv, api, MakeModal, ClrStatusSrv) {
        AuthenticationService.CheckCredentials();
        $scope.ctrl = makeController.mainController('/rooms', 'roomsTableConf', 'Κατάλογος Αιθουσών');
        $scope.ctrl.init();
        $scope.statusOptions = {};
        $scope.itemtypes = [];
        $scope.itemtype = [];
        $scope.roomDP = [];
        $scope.statusOptions = ClrStatusSrv.getStatus('roomStatus');

        $scope.deleteUsage = function (item, usage) {
            api.apiCall('DELETE', "api/public/rooms/" + item.id + '/usages/' + usage.id, function (results) {
                $scope.ctrl.dp[$scope.ctrl.dp.indexOf(item)].room_use.splice($scope.ctrl.dp[$scope.ctrl.dp.indexOf(item)].room_use.indexOf(usage), 1);
                MakeModal.generalInfoModal('sm', 'Info', 'info', 'Eπιτυχής διαγραφή', 1)
            })
        };

        $scope.$watch('ctrl.dp', function (newVal) {
            $scope.ctrl.dp.map(function (value) {
                $scope.roomDP.push(value)
            });
        });
        $scope.userview = true;
        var auth = globalVarsSrv.getGlobalVar('auth');
        auth.authdata.roles[0].roles.map(function (value) {
            if (value.id === 4) {
                $scope.userview = false;
            }
        });
        api.apiCall('GET', "api/public/itemtype", function (results) {
            $scope.itemtypes = results.data;
        });

        $scope.roomItemsModal = function () {
            MakeModal.generalModal('modules/mainComponents/views/generalModal.html', 'sm', 'info', 'Επιλογή εξοπλισμού', $scope.itemtypes, 2,
                function (results) {
                    $scope.itemtype = results;
                    $scope.filterRooms($scope.roomDP, $scope.ctrl.dp, results);
                });
        };
        $scope.filterRooms = function (filteredArray, inputArray, roomsFilter) {
            while ($scope.roomDP.length > 0) $scope.roomDP.pop();
            var typeChecked = 0;
            for (var j = 0; j < $scope.itemtype.length; j++) {
                if ($scope.itemtype[j].visible) typeChecked++
            }

            inputArray.map(function (room) {
                var exists = false;
                var typeCheckedCnt = 0;
                for (var i = 0; i < room.items.length; i++) {
                    for (var j = 0; j < $scope.itemtype.length; j++) {
                        if (room.items[i].id === $scope.itemtype[j].id && $scope.itemtype[j].visible) typeCheckedCnt++
                    }
                    if (typeCheckedCnt === typeChecked) exists = true;
                }

                if (exists || !typeChecked) $scope.roomDP.push(room);
                // $scope.roomTile=$scope.roomDP
            });
        };

    }])

    .controller('RoomProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', 'makeController', 'globalVarsSrv', 'ClrStatusSrv', function ($scope, $routeParams, api, MakeModal, AuthenticationService, makeController, globalVarsSrv, ClrStatusSrv) {
        $scope.ctrl = makeController.profileController('/rooms', 'roomsTableConf');
        $scope.statusOptions = {};
        $scope.statusOptions = ClrStatusSrv.getStatus('roomStatus');
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
            var tmpTms = [];
            var keepTms = [];
            result.data.map(function (tms) {
                if (tmpTms.indexOf(tms.descr) < 0) {
                    tmpTms.push(tms.descr);
                    keepTms.push(tms);
                }
            });
            $scope.tms = keepTms;
        })


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