'use strict';

angular.module('Admin', ['DB'])
    .controller('AdminController',
        ['$scope', '$http', '$rootScope', 'DBService',
            function ($scope, $http, $rootScope, DBService) {

                //var xoros = [{w:10,h5}, {w:10,h5}, {w:1,h10}, {w:10,h5}, {w:10,h5}, {w:10,h5}];
                $scope.devices = [{name: "d1"}, {name: "d2"}];
                //$scope.matchesSet = [{label: "Όλο το Κουπόνι"}, {label: "Νέα Παιχνίδια"}, {label: "Αρχικό Κουπόνι"}];
                $scope.appid = 7;
                $scope.appAlias = '';
                $scope.myDevices = false;
                $scope.appLocked = $rootScope.globals.item.role[DBService.findAppRole($scope.appAlias)];

                $scope.getApps = function () {
                    DBService.apps({user: $scope.user}, function (response) {
                        $scope.appProvider = response.data;
                    }, 'GET');
                };
                $scope.getApps();

                $scope.setFilterOptions = function (item) {
                    $scope.appid = item.id * 1;
                    $rootScope.appid = $scope.appid;
                    $scope.appAlias = item.app;

                    $scope.appLocked = $rootScope.globals.item.role[DBService.findAppRole($scope.appAlias)];

                    $scope.appName = item.descr;
                    $scope.myDevices = false;
                };
            }])
    .directive('admin', function () {
        return {
            restrict: "EA",
            templateUrl: 'modules/admin/views/admin.html',
            controller: 'AdminController'
        }
    })
    .directive('adminHeader', function () {
        return {
            restrict: "EA",
            templateUrl: 'modules/admin/views/admin-header.html'
        }
    })
    .directive('adminFooter', function () {
        return {
            restrict: "EA",
            templateUrl: 'modules/admin/views/admin-footer.html'
        }
    })
    .directive('appOptions', function () {
        return {
            restrict: "EA",
            templateUrl: 'modules/admin/views/app-options.html',
            controller: 'appOptionsController'
        }
    })
    .directive('userApplications', function () {
        return {
            restrict: "EA",
            templateUrl: 'modules/admin/views/user-applications.html'
        }
    })
    .directive('devices', function () {
        return {
            restrict: "EA",
            templateUrl: 'modules/admin/views/devices.html'
        }
    });