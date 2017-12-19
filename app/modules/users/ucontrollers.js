'use strict';

angular.module('Users', [
    'MainComponents',
    'ui.bootstrap'
]).controller('UsersController', ['$scope', '$http', function ($scope, $http) {

    $scope.users = [];
    $scope.currentUser = {};


    $scope.getUsers = function () {
        $http({
            method: 'GET',
            url: 'api/public/users'
        }).then(function successCallback(response) {
            $scope.users = response.data;
            MainComponents.PopupHolderController.mymodal();
        }, function errorCallBack(response) {
            alert(response.message);
        });
    };

    $scope.getUser = function () {
        $http({
            method: 'GET',
            url: 'api/public/users/' + $scope.currentUser.id
        }).then(function successCallback(response) {
            $scope.currentUser = response.data;

        }, function errorCallBack(response) {
            alert(response.message);
        });
    };

    $scope.deleteUser = function (user) {
        $http({
            method: 'DELETE',
            url: 'api/public/users/' + user.id
        }).then(function successCallUserBack(response) {
            $scope.users.splice($scope.users.indexOf(user), 1)
        }, function errorCallBack(response) {
            alert(response.message);
        });
    };

    $scope.insertUser = function () {
        $http({
            method: 'POST',
            url: 'api/public/users',
            data: JSON.stringify($scope.currentUser)
        }).then(function successCallBack(response) {
            $scope.users.push(response.data);
        }, function errorCallBack(response) {
            alert(response.message);
        })
    };

    $scope.updateUser = function () {
        $http({
            method: 'PUT',
            url: 'api/public/users/' + $scope.currentUser["id"],
            data: JSON.stringify($scope.currentUser)
        }).then(function successCallBack(response) {
            //????
        }, function errorCallBack(response) {
            alert(response.message);
        });
    };

    $scope.selectUser = function (user) {
        $scope.currentUser = user;
    };

    $scope.newUser = function () {
        $scope.currentUser = {
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