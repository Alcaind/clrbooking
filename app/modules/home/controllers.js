'use strict';

angular.module('Home',[
    'Authentication',
    'Admin',
    'ui.bootstrap'
])
.controller('HomeController', ['$scope','$interval', '$rootScope', '$location', function ($scope, $interval,$rootScope,$location) {
    if ((!$rootScope.globals || !$rootScope.globals.item || ($rootScope.globals.item && !$rootScope.globals.item.user)) && !$rootScope.inAuthentication) {
        $location.path('/login');
    }
}])
    .run(['$rootScope', '$location', '$cookies', '$http','AuthenticationService',
        function ($rootScope, $location, $cookies, $http, AuthenticationService) {

            /*if ($rootScope.app) {
                window.location('app.livepraktoreio.gr/'+$rootScope.app);
                return;
            }
            if ($rootScope.globals && $rootScope.globals.item) {
                return;
            }

            $rootScope.inAuthentication = true;

            AuthenticationService.Login('', '', function(response) {
                $rootScope.inAuthentication = false;
                if (response === 'fail') {
                    $rootScope.globals = {item: null};
                    $location.path('/login');
                    return;
                }

                if (!response.data.success || typeof response.data.success !== 'object'){
                    $rootScope.errorString ='Δεν υπάρχει ενεργό login στην Υπηρεσία! Προσπαθήστε ΞΑΝΑ!';
                    $rootScope.globals = {item: null};
                    $location.path('/login');
                    return;
                }

                $rootScope.globals = {item: {}};
                $rootScope.globals.item = response.data.success;
                $rootScope.user = $rootScope.globals.item.user;
            })*/
        }
    ]);