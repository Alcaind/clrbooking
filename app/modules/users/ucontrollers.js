'use strict';

angular.module('Users', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules'
]).controller('UsersController', ['$scope', 'MakeModal', '$http', 'api', function ($scope, MakeModal, $http, api) {

    $scope.dp = [];
    $scope.item = {};
    $scope.method = '';

    $scope.vasilis = function () {

    }
    $scope.usersApi = function (url, method, data) {

        method = typeof method !== 'undefined' ? method : 'GET';
        data = typeof data !== 'undefined' ? data : null;
        url = typeof url !== 'undefined' ? url : 'api/public/users';
        $scope.method = method;
        $scope.item = data;
        return api.apiCall(method, url, $scope.successCallback, $scope.errorCallback, data, $scope.dp, $scope)
    }

    $scope.successCallback = function (results) {
        switch ($scope.method) {
            case 'DELETE' :
                $scope.dp.splice($scope.dp.indexOf($scope.item), 1);
                $scope.item = {};
                $scope.modalMessage = "User Deleted";
                var modalInstance = MakeModal.defaultModal('lg', null, null, $scope);
                break;
            case 'PUT' :
                $scope.modalMessage = "User Updated";
                var modalInstance = MakeModal.defaultModal('lg', null, null, $scope);
                break;
            case 'POST' :
                $scope.dp.push(results.data);
                $scope.modalMessage = "User Inserted";
                var modalInstance = MakeModal.defaultModal('lg', null, null, $scope);
                break;
            case 'GET' :
                $scope.dp = results.data;
                break;
            default :
                $scope.dp = results.data;
                break
        }
    }
    $scope.errorCallback = function (results) {

    }

    $scope.selectUser = function (user) {
        $scope.item = user;
    };

    $scope.newUser = function () {
        $scope.item = {
            tm_id: "",
            fname: "",
            sname: "",
            phone: "",
            em_main: "",
            em_sec: "",
            em_pant: "",
            cat_id: "",
            comments: "",
            user: "",
            hash: ""
        }
    };
}]);