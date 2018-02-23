'use strict';

angular.module('Rooms', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication'
])
    .controller('RoomsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv) {
        AuthenticationService.CheckCredentials();


        $scope.ctrl = makeController.mainController('/rooms', 'roomsTableConf');
        $scope.ctrl.init();

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
                dt: "",
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