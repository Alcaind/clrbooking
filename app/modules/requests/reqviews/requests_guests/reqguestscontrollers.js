'use strict';

angular.module('Requests')

    .controller('ReqGuestsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams) {

        $scope.ctrl = makeController.mainController('/requests/' + $routeParams.id + '/guests', 'reqguestsTableConf', 'Συμμετέχοντες');
        $scope.ctrl.init();

    }])
    .controller('ReqGuestsProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api) {
        $scope.ctrl = makeController.profileController('/requests/guests', 'reqguestsTableConf');
        $scope.ctrl.init();
        $scope.ctrl.item['req_id'] = $routeParams.rid;


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