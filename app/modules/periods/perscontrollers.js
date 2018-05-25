'use strict';

angular.module('Periods', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
]).controller('PeriodsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', 'ClrStatusSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv, ClrStatusSrv) {

    $scope.ctrl = makeController.mainController('/periods', 'periodTableConf', 'Κατάλογος Περιόδων Ακαδημαϊκού Έτους');
    $scope.ctrl.init();
    $scope.statusOptions = ClrStatusSrv.getStatus('periodStatus');


}])
    .controller('PeriodProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api) {
        $scope.ctrl = makeController.profileController('/periods', 'periodTableConf');
        $scope.ctrl.init();

        $scope.configs = {};

        api.apiCall('GET', 'api/public/config', function (results) {
            $scope.configs = results.data;
        });

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

    }])
    .component('periodProfile', {
        restrict: 'EA',
        templateUrl: 'modules/periods/periodviews/perprofile.html',
        scope: {
            method: '='
        },
        controller: 'PeriodProfileController'
    })

;