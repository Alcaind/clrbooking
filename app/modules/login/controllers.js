'use strict';
angular.module('Login', ['Authentication', 'MainComponents'])
    .controller('LoginController',
        ['$scope', '$http', '$rootScope', '$location', '$cookies', '$cookieStore', 'AuthenticationService', 'jwtHelper', 'store',
            function ($scope, $http, $rootScope, $location, $cookies, $cookieStore, AuthenticationService, jwtHelper, store) {

                $scope.errorString = 'Εισάγετε τα στοιχεία σας για να συνδεθείτε!';
                $scope.login = function () {
                    $scope.errorString = null;
                    AuthenticationService.Login($scope.usr, $scope.pswd, function (response) {

                        if (response === 'fail') {
                            $rootScope.globals = {item: null};
                            //$location.path('/login');
                            return;
                        }

                        if (response.status === 401) {
                            $scope.errorString = 'Λάθος Στοιχεία Σύνδεσης! Προσπαθήστε ΞΑΝΑ!';
                            $rootScope.globals = {item: null};
                            return;
                        }

                        var expToken = response.data.token;
                        var tokenPayload = jwtHelper.decodeToken(expToken);

                        //$rootScope.globals = {item: tokenPayload.curlResults};
                        $rootScope.user = $scope.usr;

                        $cookies.put('user', $rootScope.globals.item);
                        $cookieStore.put('user', $rootScope.globals.item);

                        if ($rootScope.app) {
                            window.location('app.livepraktoreio.gr/' + $rootScope.app);
                            return;
                        }
                        $location.path('/home');
                    });
                }
            }]);