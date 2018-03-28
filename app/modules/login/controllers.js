'use strict';
angular.module('Login', ['Authentication', 'MainComponents', 'GlobalVarsSrvs'])
    .controller('LoginController',
        ['$scope', '$http', '$rootScope', '$location', '$cookies', '$cookieStore', 'AuthenticationService', 'jwtHelper', 'store', 'globalVarsSrv',
            function ($scope, $http, $rootScope, $location, $cookies, $cookieStore, AuthenticationService, jwtHelper, store, globalVarsSrv) {

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
                        globalVarsSrv.setGlobalVar('token', tokenPayload);

                        globalVarsSrv.setGlobalVar('menuRole', 'user');
                        for (var i = 0; i < tokenPayload.roles[0].roles.length; i++) {
                            if (tokenPayload.roles[0].roles[i].role === 'admin') {
                                globalVarsSrv.setGlobalVar('menuRole', 'admin');
                                $location.path('/users');
                                return;
                                break;
                            }
                        }
                        $location.path('/home');

                    });
                }
            }]);