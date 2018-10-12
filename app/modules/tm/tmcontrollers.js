'use strict';

angular.module('Tms', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
]).controller('TmsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', 'api', 'MakeModal', function ($scope, AuthenticationService, makeController, globalVarsSrv, api, MakeModal) {
    api.apiCall('GET', 'api/public/tm', function () {
        $scope.urlr = '/tm';
        $scope.ctrl = makeController.mainController('', 'tmsTableConf', 'Κατάλογος Τμημάτων ');
        $scope.ctrl.setUrl($scope.urlr);
        $scope.ctrl.init();
    });

    $scope.deleteTms = function (ps) {
        api.apiCall('DELETE', "api/public/tms/" + ps.id, function (results) {
            $scope.ctrl.dp.splice($scope.ctrl.dp.indexOf(ps), 1);
            MakeModal.generalInfoModal('sm', 'Info', 'info', 'Eπιτυχής διαγραφή', 1)
        });
    };


}])

    .controller('TmProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api) {
        $scope.supervisor = [];
        api.apiCall('GET', 'api/public/users', function (result) {
            result.data.map(function (value) {
                if (value.ucategories.id != 7) {
                    $scope.supervisor.push(value);
                }
            });
            $scope.ctrl = makeController.profileController('/tms', 'tmsTableConf');

            $scope.ctrl.init();
        });
    }])

    .component('tmProfile', {
        restrict: 'EA',
        templateUrl: 'modules/tm/tmviews/profile.html',
        scope: {
            method: '='
        },
        controller: 'TmProfileController'
    })
;
