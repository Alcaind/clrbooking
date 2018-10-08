'use strict';

angular.module('RoomUse', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
]).controller('RoomUseController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv) {

    $scope.ctrl = makeController.mainController('/roomuse', 'roomuseTableConf', 'Χρήσεις Αιθουσών');
    $scope.ctrl.init();

}])
    .controller('RoomUseProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api) {
        $scope.ctrl = makeController.profileController('/roomuse', 'roomuseTableConf');
        $scope.ctrl.init();

    }])
    .component('roomUseProfile', {
        restrict: 'EA',
        templateUrl: 'modules/roomUse/ruseviews/ruprofile.html',
        scope: {
            method: '='
        },
        controller: 'RoomUseProfileController'
    })
;