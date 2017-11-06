'use strict';

angular.module('Home', []);
angular.module('Login', []);
angular.module('Admin', []);
angular.module('Authentication', []);
angular.module('DB', []);

// Declare app level module which depends on views, and components
angular.module('lp4000App', [
    'Authentication',
    'Admin',
    'Home',
    'ngRoute',
    'ngCookies',
    'Login',
    'DB',
    'angular-jwt',
    'angular-storage'
])
    .config(['$locationProvider', '$routeProvider', '$httpProvider', 'jwtOptionsProvider', 'jwtInterceptorProvider',
        function($locationProvider, $routeProvider,  $httpProvider, jwtOptionsProvider, jwtInterceptorProvider) {

    $routeProvider
        .when('/', {
            controller: 'HomeController',
            templateUrl: 'modules/home/views/home.html'
        })
        .when('/admin', {
            controller: 'HomeController',
            templateUrl: 'modules/home/views/home.html'
        })
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'modules/login/views/login.html'
        })
        .when('/home', {
            controller: 'HomeController',
            templateUrl: 'modules/home/views/home.html'
        })
        /*.when('/', {
            controller: 'HomeController',
            templateUrl: 'modules/home/views/home.html'
        })
        .when('/', {
            controller: 'HomeController',
            templateUrl: 'modules/home/views/home.html'
        })*/
        .otherwise({ redirectTo: '/login' });
        /*$locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });*/

        var getUrlParameter = function getUrlParameter(sParam) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        };

        /*jwtOptionsProvider.tokenGetter = function(store) {
            return store.get('jwt');
        }*/

        jwtOptionsProvider.config({
            tokenGetter: ['options', 'store', 'jwtHelper', '$http', '$rootScope', '$location',
                function(options, store, jwtHelper, $http, $rootScope, $location) {
                // Skip authentication for any requests ending in .html
                if (options.url.substr(options.url.length - 5) == '.html') {
                    return null;
                }
                if (options.url.indexOf("refresh-token") > -1) {
                    return null
                }

                if (refreshPromise) {
                    return refreshPromise;
                }

                //var expToken = store.get('jwt').token;
                var idToken = store.get('jwt') && store.get('jwt').token != 'undefined'?store.get('jwt').token:null;
                var rfToken = store.get('rwt') && store.get('rwt').token != 'undefined'?store.get('rwt').token:null;

                /*
                if (!expToken) return null;
                var date = jwtHelper.getTokenExpirationDate(expToken);
                var tokenPayload = jwtHelper.decodeToken(expToken);
                var bool = jwtHelper.isTokenExpired(expToken);
                */

                if (idToken && jwtHelper.isTokenExpired(idToken)) {
                    if  (!rfToken || (rfToken && jwtHelper.isTokenExpired(rfToken))) {
                        if (rfToken) store.remove('rwt');
                        if (idToken) store.remove('jwt');
                        $rootScope.errorString ='Δεν υπάρχει ενεργό login στην Υπηρεσία! Προσπαθήστε ΞΑΝΑ!';
                        $rootScope.globals = {currentUser:null};
                        $location.path('/login');
                        return null;
                    }
                    var refreshToken = store.get('rwt');
                    // This is a promise of a JWT id_token
                    var refreshPromise = $http({
                        url: 'http://app.livepraktoreio.gr/api/public/refresh-token',
                        // This makes it so that this request doesn't send the JWT
                        //skipAuthorization: true,
                        headers: {
                            'Authorization': 'Bearer '+rfToken
                        },
                        method: 'POST',
                        data: {
                            refreshToken: rfToken
                        }
                    }).then(function(response) {
                        var newToken = response.data;
                        store.set('jwt', newToken);
                        refreshPromise = null;
                        return newToken.token;
                    });
                    return refreshPromise;
                } else {
                    return idToken;
                }
                //return store.get('jwt').token;
            }]
        });

        $httpProvider.interceptors.push('jwtInterceptor');
        //$rootScope.app =  getUrlParameter('app');
}])
    .controller('Controller', ['jwtHelper','store',function Controller(jwtHelper, store) {

    }])
    .run(['$rootScope', '$location', '$cookieStore', '$http',
        function ($rootScope, $location, $cookieStore, $http) {

        /*
            $rootScope.globals = {};
            var QueryString = function () {
                var query_string = {};
                var query = window.location.search.substring(1);
                var vars = query.split("&");
                for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    // If first entry with this name
                    if (typeof query_string[pair[0]] === "undefined") {
                        query_string[pair[0]] = decodeURIComponent(pair[1]);
                        // If second entry with this name
                    } else if (typeof query_string[pair[0]] === "string") {
                        var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
                        query_string[pair[0]] = arr;
                        // If third or later entry with this name
                    } else {
                        query_string[pair[0]].push(decodeURIComponent(pair[1]));
                    }
                }
                return query_string;
            }();

            //$cookieStore.put('globals', $rootScope.globals)

            $http({method: 'GET', url: './ws/login.php?usr='+QueryString.usr}).then(function (response) {
                if (response.data === 'error-') {
                    $location.path('/login');
                    return;
                }

                $rootScope.globals.currentUser = response.data;
                $location.path('/home');

            }, function (response) {
                console.log(response.status);
                $rootScope.globals.currentUser = '';
                $location.path('/login');
            });*/
        }]);
