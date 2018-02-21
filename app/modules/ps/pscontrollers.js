'use strict';

angular.module('Ps', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication'
]).controller('PsController', ['$scope', 'MakeModal', 'api', 'orderByFilter', 'AuthenticationService', function ($scope, MakeModal, api, orderBy, AuthenticationService) {
    AuthenticationService.CheckCredentials();
    $scope.dp = [];
    $scope.item = {};
    $scope.method = '';
    $scope.baseURL = 'api/public/ps';

    $scope.getPs = function () {
        api.apiCall('GET', $scope.baseURL, function (results) {
            $scope.dp = results.data;
            $scope.totalItems = $scope.dp.length;
        });
    };

    $scope.deletePs = function (item) {
        api.apiCall('DELETE', $scope.baseURL + "/" + item.id, function (results) {
            $scope.dp.splice($scope.dp.indexOf(item), 1);
            $scope.item = {};
            MakeModal.generalInfoModal('sm', 'Info', 'info', 'Το πρόγραμμα σπουδών διαγράφηκε.', 1)
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

    $scope.getPs();

}])
    .controller('PsProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, AuthenticationService) {
        AuthenticationService.CheckCredentials();
        $scope.baseURL = 'api/public/ps';

        if (!$routeParams.psId) {
            $scope.item = {
                tm_code: "",
                tm_per: "",
                pm: "",
                tma_code: "",
                tma_per: "",
                ps_ex: "",
                ps_dm: "",
                ps_km: "",
                teacher: "",
                conf_id: ""
            };
        } else {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.psId, function (results) {
                $scope.item = results.data;
            });
        }
        $scope.updatePs = function (item) {
            api.apiCall('PUT', $scope.baseURL + "/" + item.id, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Το πρόγραμμα σπουδών ανανεώθηκε.', 1);
                history.back();
            }, undefined, item)

        };

        $scope.savePs = function (item) {
            api.apiCall('POST', $scope.baseURL, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Νεο πρόγραμμα σπουδών δημιουργήθηκε.', 1);
                history.back();
            }, undefined, item)
        }


    }])
    .component('psProfile', {
        restrict: 'EA',
        templateUrl: 'modules/ps/psviews/psprofile.html',
        scope: {
            method: '='
        },
        controller: 'PsProfileController'
    })

;