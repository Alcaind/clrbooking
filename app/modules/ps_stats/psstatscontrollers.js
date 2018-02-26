'use strict';

angular.module('PsStats', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication'
]).controller('PsStatsController', ['$scope', 'MakeModal', 'api', 'orderByFilter', 'AuthenticationService', function ($scope, MakeModal, api, orderBy, AuthenticationService) {

    $scope.dp = [];
    $scope.item = {};
    $scope.method = '';
    $scope.baseURL = 'api/public/psstats';

    $scope.getPsStats = function () {
        api.apiCall('GET', $scope.baseURL, function (results) {
            $scope.dp = results.data;
            $scope.totalItems = $scope.dp.length;
        });
    };

    $scope.deletePsStats = function (item) {
        api.apiCall('DELETE', $scope.baseURL + "/" + item.id, function (results) {
            $scope.dp.splice($scope.dp.indexOf(item), 1);
            $scope.item = {};
            MakeModal.generalInfoModal('sm', 'Info', 'info', 'Τα στατιστίκα του προγράμματος σπουδών διαγράφηκε.', 1)
        });
    };

    $scope.propertyName = 'ps_id';
    $scope.reverse = true;
    $scope.sorttable = orderBy($scope.dp, $scope.propertyName, $scope.reverse);

    $scope.sortBy = function (propertyName) {
        $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
            ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.getPsStats();

}])
    .controller('PsStatsProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, AuthenticationService) {

        $scope.baseURL = 'api/public/psstats';
        $scope.ps = {};

        api.apiCall('GET', 'api/public/ps', function (results) {
            $scope.ps = results.data;
        });

        if (!$routeParams.psstatId) {
            $scope.item = {
                id: "",
                ps_id: "",
                diloseis: "",
                exetaseis: ""
            };
        } else {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.psstatId, function (results) {
                $scope.item = results.data;
            });
        }
        $scope.updatePsStats = function (item) {
            api.apiCall('PUT', $scope.baseURL + "/" + item.id, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Τα στατιστίκα του προγράμματος σπουδών ανανεώθηκε.', 1);
                history.back();
            }, undefined, item)

        };

        $scope.savePsStats = function (item) {
            api.apiCall('POST', $scope.baseURL, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Νεα στατιστίκα προγράμματος σπουδών δημιουργήθηκαν.', 1);
                history.back();
            }, undefined, item)
        }
    }])
    .component('psStatsProfile', {
        restrict: 'EA',
        templateUrl: 'modules/ps_stats/psstatsviews/profile.html',
        scope: {
            method: '='
        },
        controller: 'PsStatsProfileController'
    })

;