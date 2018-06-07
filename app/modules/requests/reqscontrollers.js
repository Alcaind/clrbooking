'use strict';

angular.module('Requests', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
]).controller('RequestsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', 'ClrStatusSrv', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, ClrStatusSrv, api) {
    $scope.configs = {};

    //$scope.url = null;

    //$scope.config_id = 1;
    //$scope.url = 'api/public/requests/config/1';
    $scope.$watch('config_id', function (newVal) {
        $scope.urlr = '/requests/config/' + newVal;
        $scope.ctrl.setUrl($scope.urlr);
    });

    api.apiCall('GET', 'api/public/config', function (results) {
        $scope.configs = results.data;
        $scope.configs.map(function (cfg) {
            if (cfg.status === 1) $scope.config_id = cfg.id;
        });
        $scope.urlr = '/requests/config/' + $scope.config_id;
        $scope.ctrl = makeController.mainController('', 'requestsTableConf', 'Κατάλογος Αιτημάτων');
        $scope.ctrl.setUrl($scope.urlr);
        $scope.ctrl.init();

        $scope.THLbutton = function (item) {
            $scope.ctrl.operations[2].ifVisible = true;
            if (item.room_use.id !== 7) {
                $scope.ctrl.operations[2].ifVisible = false;
            }
        };
    });


    $scope.statusOptions = globalVarsSrv.getGlobalVar('requestStatus');
    $scope.weekOptions = globalVarsSrv.getGlobalVar('weekdaysTableDateIndex');


}])
    .controller('RequestProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', '$filter', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api, $filter) {
        $scope.ctrl = makeController.profileController('/requests', 'requestsTableConf');
        $scope.ctrl.init();

        // function afterInit(res) {
        //     res.fromd = new Date($filter('date')(res.fromd, "yyyy-MM-dd")); // $filter('date')(res.fromd, "yyyy-MM-dd");
        //     res.tod = $filter('date')(res.tod, "yyyy-MM-dd");
        // }

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };

        $scope.popup1 = {
            opened: false
        };
        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };

        $scope.popup2 = {
            opened: false
        };

        $scope.users = {};

        api.apiCall('GET', 'api/public/users', function (results) {
            $scope.users = results.data;
        });

        $scope.room_use = {};

        api.apiCall('GET', 'api/public/roomuse', function (results) {
            $scope.room_use = results.data;
        });

        $scope.tms = {};

        api.apiCall('GET', 'api/public/tms', function (results) {
            $scope.tms = results.data;
        });

        $scope.ps = {};

        api.apiCall('GET', 'api/public/ps', function (results) {
            $scope.ps = results.data;
        });

        $scope.configs = {};
        $scope.periods = {};

        $scope.$watch('ctrl.item.conf_id', function (newVal, oldVal) {
            $scope.configs.map(function (value) {
                if (value.id === newVal) {
                    $scope.periods = value.periods;
                }
            });
        });

        api.apiCall('GET', 'api/public/config', function (results) {
            $scope.configs = results.data;
            var curConf = {};
            $scope.configs.map(function (value) {
                if (value.status === 1) {
                    curConf = value;
                    $scope.periods = value.periods;
                }
            });
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

    }
    ])

    .component('requestsProfile', {
        restrict: 'EA',
        templateUrl: 'modules/requests/reqviews/profile.html',
        scope: {
            method: '='
        },
        controller: 'RequestProfileController'
    });
