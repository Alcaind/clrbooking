'use strict';

angular.module('Kat', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication'
]).controller('KatController', ['$scope', '$routeParams', 'api', 'MakeModal', 'orderByFilter', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, orderBy, AuthenticationService) {
    AuthenticationService.CheckCredentials();

    $scope.dp = [];
    $scope.item = {};
    $scope.method = '';
    $scope.baseURL = 'api/public/kats';

    $scope.getKats = function () {
        api.apiCall('GET', $scope.baseURL, function (results) {
            $scope.dp = results.data;
            $scope.totalItems = $scope.dp.length;
        });
    };

    $scope.deleteKat = function (item) {
        api.apiCall('DELETE', $scope.baseURL + "/" + item.id, function (results) {
            $scope.dp.splice($scope.dp.indexOf(item), 1);
            $scope.item = {};
            MakeModal.generalInfoModal('sm', 'Info', 'info', 'Αίθουσα διαγράφηκε', 1)
        });
    };

    $scope.propertyName = 'tm_id';
    $scope.reverse = true;
    $scope.sorttable = orderBy($scope.dp, $scope.propertyName, $scope.reverse);

    $scope.sortBy = function (propertyName) {
        $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
            ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.getKats();

}])


    .controller('KatProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, AuthenticationService) {
        AuthenticationService.CheckCredentials();
        $scope.baseURL = 'api/public/kats';

        if (!$routeParams.katId) {
            $scope.item =
                {
                    tm_id: "",
                    decr: "",
                    title: "",
                    pm: ""
                };
        } else {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.katId, function (results) {
                $scope.item = results.data;
            });
        }
        $scope.updateKat = function (item) {
            api.apiCall('PUT', $scope.baseURL + "/" + item.id, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Η κατευθυνση ανανεώθηκε', 1);
                history.back();
            }, undefined, item)

        };

        $scope.saveKat = function (item) {
            api.apiCall('POST', $scope.baseURL, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Νεα κατευθυνση', 1);
                history.back();
            }, undefined, item)
        }

    }])
    .component('katProfile', {
        restrict: 'EA',
        templateUrl: 'modules/kat/katsviews/profile.html',
        scope: {
            method: '='
        },
        controller: 'KatProfileController'
    })

;

//
//
//
//
//
//
//     $scope.insertKat = function () {
//         $http({
//             method: 'POST',
//             url: 'api/public/kat',
//             data: JSON.stringify($scope.currentKat)
//         }).then(function successCallback(response) {
//             $scope.kats.push(response.data);
//         }, function errorCallback(response) {
//             alert(response.message);
//         });
//     };
//
//     $scope.updateKat = function () {
//         $http({
//             method: 'PUT',
//             url: 'api/public/kat/' + $scope.currentKat["id"],
//             data: JSON.stringify($scope.currentKat)
//         }).then(function successCallback(response) {
//             //TODO : reply confirmation to user;
//             //$scope.roles = response.data;
//         }, function errorCallback(response) {
//             alert(response);
//         });
//     };
//
//     $scope.selectKat = function (kat) {
//         $scope.currentKat = kat;
//     };
//     $scope.newKat = function () {
//         $scope.currentKat = {tm_id: "", decr: "", title: "", pm: ""};
//     };
// }]);