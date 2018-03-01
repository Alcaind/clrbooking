'use strict';

angular.module('ReqGuests', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'

]).controller('reqGuestsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv) {

    $scope.ctrl = makeController.mainController('/reqguests', 'reqguestsTableConf', 'Συμμετέχοντες');
    $scope.ctrl.init();

}])
    .controller('ReqGuestsProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api) {
        $scope.ctrl = makeController.profileController('/reqguests', 'reqguestsTableConf');
        $scope.ctrl.init();

        $scope.requests = {};

        api.apiCall('GET', 'api/public/requests', function (results) {
            $scope.requests = results.data;
        });

    }])
    .component('reqGuestsProfile', {
        restrict: 'EA',
        templateUrl: 'modules/requests_guests/requestsguestsviews/profile.html',
        scope: {
            method: '='
        },
        controller: 'ReqGuestsProfileController'
    })
;