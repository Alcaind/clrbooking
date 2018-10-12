'use strict';

angular.module('Ps', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
]).controller('PsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', 'api', 'MakeModal', function ($scope, AuthenticationService, makeController, globalVarsSrv, api, MakeModal) {
    $scope.configs = {};
    $scope.conf_id = 8;
    $scope.tms = [];

    $scope.$watch('conf_id', function (newVal) {
        if (!newVal) return;
        $scope.urlr = '/ps/conf/' + newVal;
        if ($scope.ctrl) $scope.ctrl.setUrl($scope.urlr);
    });

    api.apiCall('GET', 'api/public/config', function (results) {
        $scope.configs = results.data;
        $scope.configs.map(function (cfg) {
            if (cfg.status === 1) $scope.conf_id = cfg.id;
        });
        $scope.urlr = '/ps/conf/' + $scope.conf_id;
        $scope.ctrl = makeController.mainController('', 'psTableConf', 'Πρόγραμμα Σπουδών');
        $scope.ctrl.setUrl($scope.urlr);
        $scope.ctrl.init();


        api.apiCall('GET', 'api/public/tms', function (results) {
            $scope.tms = results.data;
        });

        $scope.$watch('ctrl.dp', function (n, o) {
            if (n.length) {
                for (var column in $scope.ctrl.filter) {
                    if (n[column] === $scope.ctrl.filter[column]) {
                        // return true
                        ctrl.getAll();

                        // api.apiCall('GET', 'api/public/ps', function (result) {
                        //     ctrl.dp = result.data;
                        // })
                    }
                }

            }
        });
    });
    $scope.deletePs = function (ps) {
        api.apiCall('DELETE', "api/public/ps/" + ps.id, function (results) {
            $scope.ctrl.dp.splice($scope.ctrl.dp.indexOf(ps), 1);
            MakeModal.generalInfoModal('sm', 'Info', 'info', 'Eπιτυχής διαγραφή', 1)
        });
    };



}])
    .controller('PsProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, $routeParams, api, MakeModal, AuthenticationService, makeController, globalVarsSrv) {
        $scope.ctrl = makeController.profileController('/ps', 'psTableConf');
        $scope.tms = [];
        $scope.configs = [];
//        $scope.teachers = [];
        // $scope.users = [];
        //
        // api.apiCall('GET', 'api/public/users', function (results) {
        //     $scope.users = results.data;
        // });

        $scope.$watch('ctrl.item.tm', function (newVal) {
            if (!newVal) return;
            $scope.ctrl.item.tm_code = newVal.id;
            $scope.ctrl.item.tm_per = newVal.descr;

        });


        api.apiCall('GET', 'api/public/config', function (results) {
            $scope.configs = results.data;
            api.apiCall('GET', 'api/public/tms', function (results) {
                $scope.tms = results.data;
                // api.apiCall('GET', 'api/public/users', function (results) {
                //     for (var i = 0; i < results.data.length; i++) {
                //         if (results.data[i].cat_id === 7) $scope.teachers.push(results.data[i]);
                //     }

                $scope.ctrl.init();
                //  $scope.ctrl.item.tm = [];
                // });
            });
        });
    }])

    .component('psProfile', {
        restrict: 'EA',
        templateUrl: 'modules/ps/psviews/psprofile.html',
        scope: {
            method: '='
        },
        controller: 'PsProfileController'
    })
;