'use strict';
angular.module('Login', ['Authentication', 'MainComponents', 'GlobalVarsSrvs', 'pascalprecht.translate'])
    .controller('LoginController',
        ['$scope', '$http', '$rootScope', '$location', '$cookies', '$cookieStore', 'AuthenticationService', 'jwtHelper', 'store', 'globalVarsSrv',
            function ($scope, $http, $rootScope, $location, $cookies, $cookieStore, AuthenticationService, jwtHelper, store, globalVarsSrv) {
                $scope.errorString = 'Εισάγετε τα στοιχεία σας για να συνδεθείτε!';
                $scope.login = function () {
                    $scope.errorString = null;
                    globalVarsSrv.setGlobalVar('menuRole', 'public');
                    globalVarsSrv.setGlobalVar('appLoggedIn', false);
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

                        globalVarsSrv.appInit('appConfig', tokenPayload.sub, function () {
                            for (var i = 0; i < tokenPayload.roles[0].roles.length; i++) {
                                if (tokenPayload.roles[0].roles[i].role === 'admin') {
                                    globalVarsSrv.setGlobalVar('menuRole', 'admin');
                                    $location.path('/home');
                                    return;
                                    break;
                                }
                            }
                            if (!globalVarsSrv.getGlobalVar('menuRole')) globalVarsSrv.setGlobalVar('menuRole', 'user');
                            globalVarsSrv.setGlobalVar('appLoggedIn', true);

                            $location.path('/dashboard');
                        });
                    });
                };

                $scope.unAuthUser = function () {
                    $location.path('/roombook');
                }
            }]);