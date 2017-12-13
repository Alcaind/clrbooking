'use strict';
angular.module('Login', ['Authentication'])
    .controller('LoginController',
        ['$scope', '$http', '$rootScope', '$location', '$cookies', '$cookieStore', 'AuthenticationService', 'jwtHelper', 'store',
            function ($scope, $http, $rootScope, $location, $cookies, $cookieStore, AuthenticationService, jwtHelper, store) {
                $scope.login = function () {
                    $scope.errorString = null;
                    AuthenticationService.Login($scope.usr, $scope.pswd, function (response) {

                        if (response === 'fail') {
                            $rootScope.globals = {currentUser: null};
                            //$location.path('/login');
                            return;
                        }

                        if (response.status === '401') {
                            $scope.errorString = 'Λάθος Στοιχεία Σύνδεσης! Προσπαθήστε ΞΑΝΑ!';
                            return;
                        }

                        var expToken = response.data.token;
                        var tokenPayload = jwtHelper.decodeToken(expToken);

                        $rootScope.globals = {currentUser: tokenPayload.curlResults};
                        $rootScope.user = $scope.usr;

                        $cookies.put('user', $rootScope.globals.currentUser);
                        $cookieStore.put('user', $rootScope.globals.currentUser);

                        if ($rootScope.app) {
                            window.location('app.livepraktoreio.gr/' + $rootScope.app);
                            return;
                        }
                        $location.path('/roles');
                    });
                }
            }]);