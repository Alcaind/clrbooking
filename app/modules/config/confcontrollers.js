'use strict';

angular.module('Config', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication'
]).controller('ConfigController', ['$scope', 'MakeModal', 'api', 'orderByFilter', 'AuthenticationService', function ($scope, MakeModal, api, orderBy, AuthenticationService) {

    $scope.dp = [];
    $scope.item = {};
    $scope.method = '';
    $scope.baseURL = 'api/public/config';

    $scope.getConfigs = function () {
        api.apiCall('GET', $scope.baseURL, function (results) {
            $scope.dp = results.data;
            $scope.totalItems = $scope.dp.length;
        });
    };

    $scope.deleteConfig = function (item) {
        api.apiCall('DELETE', $scope.baseURL + "/" + item.id, function (results) {
            $scope.dp.splice($scope.dp.indexOf(item), 1);
            $scope.item = {};
            MakeModal.generalInfoModal('sm', 'Info', 'info', 'Configuration διαγράφηκε.', 1)
        });
    };

    $scope.propertyName = 'year';
    $scope.reverse = true;
    $scope.sorttable = orderBy($scope.dp, $scope.propertyName, $scope.reverse);

    $scope.sortBy = function (propertyName) {
        $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
            ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.getConfigs();

}])
    .controller('ConfigProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, AuthenticationService) {

        $scope.baseURL = 'api/public/config';

        if (!$routeParams.configId) {
            $scope.item = {
                year: "",
                dt: "",
                status: ""
            };
        } else {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.configId, function (results) {
                $scope.item = results.data;
            });
        }
        $scope.updateConfig = function (item) {
            api.apiCall('PUT', $scope.baseURL + "/" + item.id, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Configuration ανανεώθηκε.', 1);
                history.back();
            }, undefined, item)

        };

        $scope.saveConfig = function (item) {
            api.apiCall('POST', $scope.baseURL, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Νεο Configuration δημιουργήθηκε.', 1);
                history.back();
            }, undefined, item)
        }

    }])
    .component('configProfile', {
        restrict: 'EA',
        templateUrl: 'modules/config/confviews/cprofile.html',
        scope: {
            method: '='
        },
        controller: 'ConfigProfileController'
    })

;