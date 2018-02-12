'use strict';

angular.module('UsersCategories', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication'
])
    .controller('UsersCategoriesController', ['$scope', 'MakeModal', 'api', 'orderByFilter', 'AuthenticationService', function ($scope, MakeModal, api, orderBy, AuthenticationService) {
        AuthenticationService.CheckCredentials();
        $scope.dp = [];
        $scope.item = {};
        $scope.method = '';
        $scope.baseURL = 'api/public/userscategories';

        $scope.getUsersCategories = function () {
            api.apiCall('GET', $scope.baseURL, function (results) {
                $scope.dp = results.data;
                $scope.totalItems = $scope.dp.length;
            });
        };

        $scope.deleteUsersCategories = function (item) {
            api.apiCall('DELETE', $scope.baseURL + "/" + item.id, function (results) {
                $scope.dp.splice($scope.dp.indexOf(item), 1);
                $scope.item = {};
                MakeModal.generalInfoModal('sm', 'Info', 'info', 'Κατηγορια χρήστη διαγράφηκε', 1)
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

        $scope.getUsersCategories();

    }])
    .controller('UsersCategoriesProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, AuthenticationService) {
        AuthenticationService.CheckCredentials();
        $scope.baseURL = 'api/public/userscategories';

        if (!$routeParams.userscategoryId) {
            $scope.item = {
                descr: "",
                comment: ""
            };
        } else {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.userscategoryId, function (results) {
                $scope.item = results.data;
            });
        }
        $scope.updateUsersCategories = function (item) {
            api.apiCall('PUT', $scope.baseURL + "/" + item.id, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Η κατηγορία χρήστη ανανεώθηκε', 1);
                history.back();
            }, undefined, item)

        };

        $scope.saveUsersCategories = function (item) {
            api.apiCall('POST', $scope.baseURL, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Νεα κατηγορία χρήστη', 1);
                history.back();
            }, undefined, item)
        }
    }])
    .component('usersCategoriesProfile', {
        restrict: 'EA',
        templateUrl: 'modules/usersCategories/ucviews/ucprofile.html',
        scope: {
            method: '='
        },
        controller: 'UsersCategoriesProfileController'
    })
;