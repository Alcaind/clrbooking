'use strict';

angular.module('RoomCategory', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
]).controller('RoomCategoryController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv) {
    AuthenticationService.CheckCredentials();
    $scope.ctrl = makeController.mainController('/roomcategory', 'roomcategoryTableConf', 'Κατηγορίες Αιθουσών');
    $scope.ctrl.init();

    $scope.userview = true;
    var auth = globalVarsSrv.getGlobalVar('auth');
    auth.authdata.roles[0].roles.map(function (value) {
        if (value.id === 4) {
            $scope.userview = false;
        }
    });

}])
    .controller('RoomCategoryProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api) {
        $scope.ctrl = makeController.profileController('/roomcategory', 'roomcategoryTableConf');
        $scope.ctrl.init();

    }])
    .component('roomCategoryProfile', {
        restrict: 'EA',
        templateUrl: 'modules/roomCategory/rcviews/rcprofile.html',
        scope: {
            method: '='
        },
        controller: 'RoomCategoryProfileController'
    })
;