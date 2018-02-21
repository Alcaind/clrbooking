'use strict';

angular.module('Home',[
    'Authentication',
    'Admin',
    'ui.bootstrap'
])
    .controller('HomeController', ['$scope', '$interval', '$rootScope', '$location', 'AuthenticationService', function ($scope, $interval, $rootScope, $location, AuthenticationService) {
        if ((!$rootScope.globals || !$rootScope.globals.item || ($rootScope.globals.item && !$rootScope.globals.item.user)) && !$rootScope.inAuthentication) {
            $location.path('/login');
        }
        AuthenticationService.CheckCredentials();
    }])
    .run(['$rootScope', '$location', '$cookies', '$http','AuthenticationService',
        function ($rootScope, $location, $cookies, $http, AuthenticationService) {

        }
    ]);