'use strict';

angular.module('Periods', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication'
]).controller('PeriodsController', ['$scope', 'MakeModal', 'api', 'orderByFilter', 'AuthenticationService', function ($scope, MakeModal, api, orderBy, AuthenticationService) {
    AuthenticationService.CheckCredentials();
    $scope.dp = [];
    $scope.item = {};
    $scope.method = '';
    $scope.baseURL = 'api/public/periods';

    $scope.getPeriod = function () {
        api.apiCall('GET', $scope.baseURL, function (results) {
            $scope.dp = results.data;
            $scope.totalItems = $scope.dp.length;
        });
    };

    $scope.deletePeriod = function (item) {
        api.apiCall('DELETE', $scope.baseURL + "/" + item.id, function (results) {
            $scope.dp.splice($scope.dp.indexOf(item), 1);
            $scope.item = {};
            MakeModal.generalInfoModal('sm', 'Info', 'info', 'Η ακαδημαϊκή περίοδος διαγράφηκε.', 1)
        });
    };

    $scope.propertyName = 'descr';
    $scope.reverse = true;
    $scope.sorttable = orderBy($scope.dp, $scope.propertyName, $scope.reverse);

    $scope.sortBy = function (propertyName) {
        $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
            ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.getPeriod();

}])
    .controller('PeriodProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, AuthenticationService) {
        AuthenticationService.CheckCredentials();
        $scope.baseURL = 'api/public/periods';

        if (!$routeParams.periodId) {
            $scope.item = {
                id: "",
                descr: "",
                synt: "",
                fromd: "",
                tod: "",
                comments: "",
                conf_id: "",
                porder: "",
                status: ""
            };
        } else {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.periodId, function (results) {
                $scope.item = results.data;
            });
        }
        $scope.updatePeriod = function (item) {
            api.apiCall('PUT', $scope.baseURL + "/" + item.id, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Η ακαδημαϊκή περίοδος ανανεώθηκε.', 1);
                history.back();
            }, undefined, item)

        };

        $scope.savePeriod = function (item) {
            api.apiCall('POST', $scope.baseURL, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Νεα ακαδημαϊκή περίοδος δημιουργήθηκε.', 1);
                history.back();
            }, undefined, item)
        }

    }])
    .component('periodProfile', {
        restrict: 'EA',
        templateUrl: 'modules/periods/periodviews/perprofile.html',
        scope: {
            method: '='
        },
        controller: 'PeriodProfileController'
    })

;