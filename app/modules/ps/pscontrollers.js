'use strict';

angular.module('Ps', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
]).controller('PsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, api) {

    $scope.ctrl = makeController.mainController('/ps', 'psTableConf', 'Πρόγραμμα Σπουδών');
    $scope.ctrl.init();
    $scope.tms = [];
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

}])
    .controller('PsProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, $routeParams, api, MakeModal, AuthenticationService, makeController, globalVarsSrv) {
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
                $scope.ctrl = makeController.profileController('/ps', 'psTableConf');
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