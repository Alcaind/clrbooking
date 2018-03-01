'use strict';

angular.module('Requests')

    .controller('ReqGuestsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams) {

        $scope.ctrl = makeController.mainController('/requests/' + $routeParams.id + '/guests', 'reqguestsTableConf', 'Συμμετέχοντες');
    $scope.ctrl.init();

}])
    .controller('ReqGuestsProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api) {
        $scope.ctrl = makeController.profileController('/requests/' + $routeParams.id + '/guests', 'reqguestsTableConf');
        $scope.ctrl.init();


    }])
    .component('reqGuestsProfile', {
        restrict: 'EA',
        templateUrl: 'modules/requests/reqviews/requests_guests/requestsguestsviews/profile.html',
        scope: {
            method: '='
        },
        controller: 'ReqGuestsProfileController'
    })
;