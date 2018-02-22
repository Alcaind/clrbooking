'use strict';

angular.module('Requests', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'

]).controller('RequestsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv) {
    AuthenticationService.CheckCredentials();

    $scope.ctrl = makeController.mainController('/requests', 'requestsTableConf');
    $scope.ctrl.init();

}])
    .controller('RequestProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, AuthenticationService) {
        AuthenticationService.CheckCredentials();
        $scope.baseURL = 'api/public/requests';
        $scope.users = {};
        $scope.periods = {};

        api.apiCall('GET', 'api/public/users', function (results) {
            $scope.users = results.data;
        });
        api.apiCall('GET', 'api/public/periods', function (results) {
            $scope.periods = results.data;
        });

        if (!$routeParams.id) {
            $scope.item = {
                id: "",
                req_dt: "",
                user_id: "",
                descr: "",
                period: "",
                ps_id: "",
                class_use: "",
                links: "",
                fromdt: "",
                todt: "",
                protocol_id: "",
                req_status: "",
                fromd: "",
                tod: "",
                date_index: "",
                admin: ""
            };
        } else {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.id, function (results) {
                $scope.item = results.data;
            });
        }
        $scope.updateRequest = function (item) {
            api.apiCall('PUT', $scope.baseURL + "/" + item.id, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Το αίτημα ανανεώθηκε.', 1);
                history.back();
            }, undefined, item)

        };

        $scope.saveRequest = function (item) {
            api.apiCall('POST', $scope.baseURL, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Νεο αίτημα δημιουργήθηκε.', 1);
                history.back();
            }, undefined, item)
        }
    }])
    .component('requestsProfile', {
        restrict: 'EA',
        templateUrl: 'modules/requests/reqviews/profile.html',
        scope: {
            method: '='
        },
        controller: 'RequestProfileController'
    })
;