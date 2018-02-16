'use strict';

angular.module('Tms', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication'
]).controller('TmsController', ['$scope', '$routeParams', 'api', 'MakeModal', 'orderByFilter', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, orderBy, AuthenticationService) {
    AuthenticationService.CheckCredentials();

    $scope.dp = [];
    $scope.item = {};
    $scope.method = '';
    $scope.baseURL = 'api/public/tms';

    $scope.getTms = function () {
        api.apiCall('GET', $scope.baseURL, function (results) {
            $scope.dp = results.data;
            $scope.totalItems = $scope.dp.length;
        });
    };

    $scope.deleteTm = function (item) {
        api.apiCall('DELETE', $scope.baseURL + "/" + item.id, function (results) {
            $scope.dp.splice($scope.dp.indexOf(item), 1);
            $scope.item = {};
            MakeModal.generalInfoModal('sm', 'Info', 'info', 'Η εγγραφή του τμήματος διαγράφηκε.', 1)
        });
    };

    $scope.propertyName = 'tm_code';
    $scope.reverse = true;
    $scope.sorttable = orderBy($scope.dp, $scope.propertyName, $scope.reverse);

    $scope.sortBy = function (propertyName) {
        $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
            ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.getTms();


}])

    .controller('TmProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, AuthenticationService) {
        AuthenticationService.CheckCredentials();
        $scope.baseURL = 'api/public/tms';

        if (!$routeParams.tmId) {
            $scope.item = {
                tm_code: "",
                descr: "",
                title: "",
                sxoli: ""
            };
        } else {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.tmId, function (results) {
                $scope.item = results.data;
            });
        }
        $scope.updateTm = function (item) {
            api.apiCall('PUT', $scope.baseURL + "/" + item.id, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Η εγγραφή του τμήματος ανανεώθηκε.', 1);
                history.back();
            }, undefined, item)

        };

        $scope.saveTm = function (item) {
            api.apiCall('POST', $scope.baseURL, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Νέα εγγραφή τμήματος.', 1);
                history.back();
            }, undefined, item)
        }

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
