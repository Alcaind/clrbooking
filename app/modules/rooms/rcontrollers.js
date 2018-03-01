'use strict';

angular.module('Rooms', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
])
    .controller('RoomsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv) {

        $scope.ctrl = makeController.mainController('/rooms', 'roomsTableConf', 'Κατάλογος Αιθουσών');
        $scope.ctrl.init();

    }])

    .controller('RoomProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, AuthenticationService) {

        $scope.baseURL = 'api/public/rooms';
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

        if (!$routeParams.id) {
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
                stat_comm: "",
                conf_id: "",
                category: ""
            };
        } else {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.id, function (results) {
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