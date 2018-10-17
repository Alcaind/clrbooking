'use strict';

angular.module('ItemType', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
]).controller('ItemTypeController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv) {

    $scope.ctrl = makeController.mainController('/itemtype', 'itemtypeTableConf', 'Κατάλογος Τύπων Εξοπλισμού');
    $scope.ctrl.init();

}])
    .controller('ItemTypeProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api) {
        $scope.ctrl = makeController.profileController('/itemtype', 'itemtypeTableConf');
        $scope.ctrl.init();

        $scope.type = {};

        api.apiCall('GET', 'api/public/itemtype', function (results) {
            $scope.type = results.data;
        });

    }])
    .component('itemtypeProfile', {
        restrict: 'EA',
        templateUrl: 'modules/item_type/itemtypeviews/profile.html',
        scope: {
            method: '='
        },
        controller: 'ItemTypeProfileController'
    })
;