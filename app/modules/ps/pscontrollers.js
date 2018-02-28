'use strict';

angular.module('Ps', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
]).controller('PsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv) {

    $scope.ctrl = makeController.mainController('/ps', 'katTableConf', ' Πρόγραμμα Σπουδων ');
    $scope.ctrl.init();
}])
    .controller('PsProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api) {
        $scope.ctrl = makeController.profileController('/kats', 'katTableConf');
        $scope.ctrl.init();
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