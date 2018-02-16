'use strict';

angular.module('Rooms', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication'
])
    .controller('RoomsController', ['$scope', '$routeParams', 'api', 'MakeModal', 'orderByFilter', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, orderBy, AuthenticationService) {
        AuthenticationService.CheckCredentials();

        $scope.dp = [];
        $scope.item = {};
        $scope.method = '';
        $scope.baseURL = 'api/public/rooms';
        $scope.columsVisibility = [{column: 'address', value: true}, {column: 'building', value: true}];

        $scope.getRooms = function () {
            api.apiCall('GET', $scope.baseURL, function (results) {
                $scope.dp = results.data;
                $scope.totalItems = $scope.dp.length;
            });
        };

        $scope.deleteRooms = function (item) {
            api.apiCall('DELETE', $scope.baseURL + "/" + item.id, function (results) {
                $scope.dp.splice($scope.dp.indexOf(item), 1);
                $scope.item = {};
                MakeModal.generalInfoModal('sm', 'Info', 'info', 'Η αίθουσα διαγράφηκε.', 1)
            });
        };

        $scope.propertyName = 'name';
        $scope.reverse = true;
        $scope.sorttable = orderBy($scope.dp, $scope.propertyName, $scope.reverse);

        $scope.sortBy = function (propertyName) {
            $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
                ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };

        $scope.deleteUsage = function (room, usage) {
            api.apiCall('DELETE', $scope.baseURL + "/" + room.id + '/usages/' + usage.id, function (results) {
                $scope.dp[$scope.dp.indexOf(room)].room_use.splice($scope.dp[$scope.dp.indexOf(room)].room_use.indexOf(usage), 1);
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Η κατηγορία χρήσης διαγράφηκε από την αίθουσα.', 1);
            })
        };
        $scope.getRooms();

    }])
    .controller('RoomProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, AuthenticationService) {
        AuthenticationService.CheckCredentials();
        $scope.baseURL = 'api/public/rooms';
        $scope.categories = [];
        $scope.roomusages = [];
        $scope.configs = [];
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

        if (!$routeParams.roomId) {
            $scope.item = {
                name: "",
                address: "",
                building: "",
                floor: "",
                status: "",
                active: "",
                destroyed: "",
                nonexist: "",
                capasity: "",
                width: "",
                height: "",
                xoros: "",
                exams_capasity: "",
                capasity_categ: "",
                tm_owner: "",
                dt: "",
                stat_comm: "",
                conf_id: "",
                category: "",
                use_id: ""
            };
        } else {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.roomId, function (results) {
                $scope.item = results.data;
            });
        }
        $scope.updateRoom = function (item) {
            api.apiCall('PUT', $scope.baseURL + "/" + item.id, function (results) {
                api.apiCall('POST', $scope.baseURL + '/' + results.data.id + '/usages', function (results) {
                    console.log(results | JSON);
                }, undefined, $scope.selectedUsages.map(function (value) {
                    return value.id
                }));
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Η εγγραφή της αίθουσας ανανεώθηκε.', 1);
                history.back();
            }, undefined, item)
        };

        $scope.saveRoom = function (item) {
            api.apiCall('POST', $scope.baseURL, function (results) {
                api.apiCall('POST', $scope.baseURL + '/' + results.data.id + '/usages', function (results) {
                    console.log(results | JSON);
                }, undefined, $scope.selectedUsages.map(function (value) {
                    return value.id
                }));
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Νεα εγγραφή αίθουσας δημιουργήθηκε.', 1);
                history.back();
            }, undefined, item)
        }
    }
    ])
    .component('roomProfile', {
        restrict: 'EA',
        templateUrl: 'modules/rooms/rviews/rprofile.html',
        scope: {
            method: '='
        },
        controller: 'RoomProfileController'
    })
;