'use strict';

angular.module('Home',[
    'Authentication',
    'Admin',
    'ui.bootstrap'
])
    .controller('HomeController', ['$scope', '$interval', '$rootScope', '$location', 'AuthenticationService', function ($scope, $interval, $rootScope, $location, AuthenticationService) {
        AuthenticationService.CheckCredentials();
    }])
    .run(['$rootScope', '$location', '$cookies', '$http','AuthenticationService',
        function ($rootScope, $location, $cookies, $http, AuthenticationService) {

        }
    ]);