'use strict';

angular.module('Items', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication'
]).controller('ItemsController', ['$scope', 'MakeModal', 'api', 'orderByFilter', 'AuthenticationService', function ($scope, MakeModal, api, orderBy, AuthenticationService) {
    AuthenticationService.CheckCredentials();
    $scope.dp = [];
    $scope.item = {};
    $scope.method = '';
    $scope.baseURL = 'api/public/items';

    $scope.getItem = function () {
        api.apiCall('GET', $scope.baseURL, function (results) {
            $scope.dp = results.data;
            $scope.totalItems = $scope.dp.length;
        });
    };

    $scope.deleteItem = function (item) {
        api.apiCall('DELETE', $scope.baseURL + "/" + item.id, function (results) {
            $scope.dp.splice($scope.dp.indexOf(item), 1);
            $scope.item = {};
            MakeModal.generalInfoModal('sm', 'Info', 'info', 'Αντικείμενο/εξοπλισμός διαγράφηκε.', 1)
        });
    };

    $scope.propertyName = 'code';
    $scope.reverse = true;
    $scope.sorttable = orderBy($scope.dp, $scope.propertyName, $scope.reverse);

    $scope.sortBy = function (propertyName) {
        $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
            ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.getItem();

}])
    .controller('ItemProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, AuthenticationService) {
        AuthenticationService.CheckCredentials();
        $scope.baseURL = 'api/public/items';

        if (!$routeParams.itemId) {
            $scope.item = {
                descr: "",
                comments: "",
                code: "",
                status: ""
            };
        } else {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.itemId, function (results) {
                $scope.item = results.data;
            });
        }
        $scope.updateItem = function (item) {
            api.apiCall('PUT', $scope.baseURL + "/" + item.id, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Ο εξοπλισμός ανανεώθηκε.', 1);
                history.back();
            }, undefined, item)

        };

        $scope.saveItem = function (item) {
            api.apiCall('POST', $scope.baseURL, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Νεο αντικείμενο εξοπλισμού δημιουργήθηκε.', 1);
                history.back();
            }, undefined, item)
        }


    }])
    .component('itemsProfile', {
        restrict: 'EA',
        templateUrl: 'modules/items/itemviews/iprofile.html',
        scope: {
            method: '='
        },
        controller: 'ItemProfileController'
    })

;