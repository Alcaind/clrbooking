'use strict';

angular.module('Periods', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
]).controller('PeriodsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv) {

    $scope.ctrl = makeController.mainController('/periods', 'periodTableConf', 'Κατάλογος Περιόδων Ακαδημαϊκού Έτους');
    $scope.ctrl.init();

}])
    .controller('PeriodProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api) {
        $scope.ctrl = makeController.profileController('/periods', 'periodTableConf');
        $scope.ctrl.init();

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