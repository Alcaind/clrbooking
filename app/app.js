'use strict';

angular.module('Home', []);
angular.module('Login', []);
angular.module('Admin', []);
angular.module('Authentication', []);
angular.module('DB', []);
angular.module('Roles', []);
angular.module('Users', []);
angular.module('Rooms', []);
angular.module('Tms', []);
angular.module('Kat', []);
angular.module('Requests', []);
angular.module('MainComponents', []);
angular.module('ApiModules', []);
angular.module('UsersCategories', []);
angular.module('Config', []);
angular.module('Ps', []);
angular.module('Periods', []);
angular.module('Items', []);
angular.module('RoomCategory', []);
angular.module('RoomUse', []);
angular.module('RoomBook', []);
angular.module('PsStats', []);
angular.module('RoomBook', []);



// Declare app level module which depends on views, and components
angular.module('clrBooking', [
    'Authentication',
    'Admin',
    'Home',
    'ngRoute',
    'ngCookies',
    'Login',
    'DB',
    'angular-jwt',
    'angular-storage',
    'Roles',
    'Users',
    'Rooms',
    'Tms',
    'Kat',
    'Requests',
    'MainComponents',
    'ApiModules',
    'UsersCategories',
    'Config',
    'Ps',
    'Periods',
    'Items',
    'RoomCategory',
    'RoomUse',
    'PsStats',
    'GlobalVarsSrvs',
    'Authentication',
    'RoomBook'

])
    .config(function ($locationProvider) {
        $locationProvider.html5Mode(false);
        $locationProvider.hashPrefix('');
    })

    .config(['$locationProvider', '$routeProvider', '$httpProvider', 'jwtOptionsProvider', 'jwtInterceptorProvider',
        function ($locationProvider, $routeProvider, $httpProvider, jwtOptionsProvider, jwtInterceptorProvider) {

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
                    title: "LogIn",
                    controller: 'LoginController',
                    templateUrl: 'modules/login/views/login.html'
                })
                .when('/home', {
                    controller: 'HomeController',
                    templateUrl: 'modules/home/views/home.html'
                })
                .when('/config', {
                    title: 'configuration',
                    controller: 'ConfigController',
                    templateUrl: 'modules/config/confviews/configs.html'
                })
                .when('/config/create', {
                    title: 'configuration create',
                    template: '<config-profile></config-profile>'
                })
                .when('/config/:id', {
                    title: 'configuration',
                    template: '<config-profile></config-profile>'
                })
                .when('/items', {
                    title: 'items',
                    controller: 'ItemsController',
                    templateUrl: 'modules/items/itemviews/items.html'
                })
                .when('/items/create', {
                    title: 'items create',
                    template: '<items-profile></items-profile>'
                })
                .when('/items/:id', {
                    title: 'items',
                    template: '<items-profile></items-profile>'
                })
                .when('/kats', {
                    title: 'kat',
                    controller: 'KatController',
                    templateUrl: 'modules/kat/katsviews/kats.html'
                })
                .when('/kats/create', {
                    title: 'kat create',
                    template: '<kat-profile></kat-profile>'
                })
                .when('/kats/:id', {
                    title: 'kat',
                    template: '<kat-profile></kat-profile>'
                })
                .when('/periods', {
                    title: 'academic periods',
                    controller: 'PeriodsController',
                    templateUrl: 'modules/periods/periodviews/periods.html'
                })
                .when('/periods/create', {
                    title: 'academic period create',
                    template: '<period-profile></period-profile>'
                })
                .when('/periods/:id', {
                    title: 'academic period',
                    template: '<period-profile></period-profile>'
                })
                .when('/ps', {
                    title: 'curriculum',
                    controller: 'PsController',
                    templateUrl: 'modules/ps/psviews/ps.html'
                })
                .when('/ps/create', {
                    title: 'curriculum create',
                    template: '<ps-profile></ps-profile>'
                })
                .when('/ps/:id', {
                    title: 'curroculum',
                    template: '<ps-profile></ps-profile>'
                })
                .when('/requests', {
                    title: 'requests',
                    controller: 'RequestsController',
                    templateUrl: 'modules/requests/reqviews/requests.html'
                })
                .when('/requests/create', {
                    title: 'request create',
                    template: '<requests-profile></requests-profile>'
                })
                .when('/requests/:id', {
                    title: 'requests',
                    template: '<requests-profile></requests-profile>'
                })
                .when('/requests/:id/rooms', {
                    title: 'requests rooms',
                    controller: 'RequestsRoomsController',
                    templateUrl: 'modules/requests/reqviews/rooms/mainn2n.html'
                })
                .when('/requests/:id/guests', {
                    title: 'requests guests',
                    controller: 'ReqGuestsController',
                    templateUrl: 'modules/requests/reqviews/requests_guests/requestsguestsviews/requestsguests.html'
                })
                .when('/requests/:rid/guests/create', {
                    title: 'request guests create',
                    template: '<req-guests-profile></req-guests-profile>'
                })
                .when('/requests/:rid/guests/:id', {
                    title: 'request guests',
                    template: '<req-guests-profile></req-guests-profile>'
                })
                .when('/roles', {
                    title: 'roles',
                    controller: 'RolesController',
                    templateUrl: 'modules/roles/views/roles.html'
                })
                .when('/roles/create', {
                    title: 'role create',
                    template: '<roles-profile></roles-profile>'
                })
                .when('/roles/:id', {
                    title: 'role',
                    template: '<roles-profile></roles-profile>'
                })
                .when('/roles/:id/users', {
                    title: 'role user',
                    controller: 'RolesUserController',
                    templateUrl: 'modules/roles/views/rolesusers.html'
                })
                .when('/roomcategory', {
                    title: 'room category',
                    controller: 'RoomCategoryController',
                    templateUrl: 'modules/roomCategory/rcviews/rcategories.html'
                })
                .when('/roomcategory/create', {
                    title: 'room category create',
                    template: '<room-category-profile></room-category-profile>'
                })
                .when('/roomcategory/:id', {
                    title: 'room category',
                    template: '<room-category-profile></room-category-profile>'
                })
                .when('/roomuse', {
                    title: 'room use',
                    controller: 'RoomUseController',
                    templateUrl: 'modules/roomUse/ruseviews/roomuse.html'
                })
                .when('/roomuse/create', {
                    title: 'room use create',
                    template: '<room-use-profile></room-use-profile>'
                })
                .when('/roomuse/:id', {
                    title: 'room use',
                    template: '<room-use-profile></room-use-profile>'
                })
                .when('/rooms', {
                    title: 'rooms',
                    controller: 'RoomsController',
                    templateUrl: 'modules/rooms/rviews/rooms.html'
                })
                .when('/rooms/create', {
                    title: 'room create',
                    template: '<room-profile></room-profile>'
                })
                .when('/rooms/:id', {
                    title: 'rooms',
                    template: '<room-profile></room-profile>'
                })
                .when('/rooms/:id/roomuse', {
                    title: 'user request',
                    controller: 'RoomsUsagesController',
                    templateUrl: 'modules/rooms/rviews/UCroom.html'
                })
                .when('/rooms/:id/items', {
                    title: 'room items',
                    controller: 'RoomsItemsController',
                    templateUrl: 'modules/rooms/rviews/items/ItemRoom.html'
                })
                .when('/rooms/:id/tms', {
                    title: 'room tms',
                    controller: 'RoomsTmsController',
                    templateUrl: 'modules/rooms/rviews/tms/TmsRoom.html'
                })
                .when('/rooms/:id/requests', {
                    title: 'room requests',
                    controller: 'RoomRequestsController',
                    templateUrl: 'modules/requests/reqviews/requests.html'
                })
                .when('/rooms/:rid/requests/create', {
                    title: 'request rooms create',
                    template: '<req-rooms-profile></req-rooms-profile>'
                })
                .when('/rooms/:rid/requests/:id', {
                    title: 'request rooms',
                    template: '<req-rooms-profile></req-rooms-profile>'
                })
                .when('/tms', {
                    title: 'tm',
                    controller: 'TmsController',
                    templateUrl: 'modules/tm/tmviews/tms.html'
                })
                .when('/tms/create', {
                    title: 'tm create',
                    template: '<tm-profile></tm-profile>'
                })
                .when('/tms/:id', {
                    title: 'tm',
                    template: '<tm-profile></tm-profile>'
                })
                .when('/userscategories', {
                    title: 'users categories',
                    controller: 'UsersCategoriesController',
                    templateUrl: 'modules/usersCategories/ucviews/ucategories.html'
                })
                .when('/userscategories/create', {
                    title: 'users categories create',
                    template: '<users-categories-profile></users-categories-profile>'
                })
                .when('/userscategories/:id', {
                    title: 'users categories',
                    template: '<users-categories-profile></users-categories-profile>'
                })
                .when('/users', {
                    title: 'users',
                    controller: 'UsersController',
                    templateUrl: 'modules/users/uviews/users.html'
                })
                .when('/users/create', {
                    title: 'user create',
                    template: '<users-profile></users-profile>'
                })
                .when('/users/:id', {
                    title: 'user',
                    template: '<users-profile></users-profile>'
                })
                .when('/users/:id/requests', {
                    title: 'user request',
                    controller: 'URequestsController',
                    templateUrl: 'modules/requests/reqviews/requests.html'
                })
                .when('/users/:id/roles', {
                    title: 'user role',
                    controller: 'URolesController',
                    templateUrl: 'modules/users/uviews/urole.html'
                })
                .when('/users/:id/tms', {
                    title: 'user tms',
                    controller: 'UsersTmsController',
                    templateUrl: 'modules/users/utms/userTms.html'
                })
                .when('/psstats', {
                    title: 'statistics',
                    controller: 'PsStatsController',
                    templateUrl: 'modules/ps_stats/psstatsviews/psstats.html'
                })
                .when('/psstats/create', {
                    title: 'statistics create',
                    template: '<ps-stats-profile></ps-stats-profile>'
                })
                .when('/psstats/:id', {
                    title: 'statistics',
                    template: '<ps-stats-profile></ps-stats-profile>'
                })
                .when('/roombook', {
                    title: 'roombook',
                    controller: 'BookController',
                    templateUrl: 'modules/bookview/bookview.html'
                })
                .when('/roombook/dates', {
                    title: 'roombook',
                    controller: 'BookController',
                    templateUrl: 'modules/bookview/bookview.html'
                })
                .when('/usercreaterequests', {
                    title: 'user create requests',
                    controller: 'CreateFormController',
                    templateUrl: 'modules/requests/createUserRequest/createForm.html'
                })
                .when('/usercreaterequests/:id', {
                    title: 'user create requests',
                    controller: 'CreateFormController',
                    templateUrl: 'modules/requests/createUserRequest/createForm.html'
                })
                .when('/dashboard', {
                    title: 'user view requests',
                    controller: 'UserViewController',
                    templateUrl: 'modules/userView/userHome/uhome.html'
                })


                /*.when('/', {
                    controller: 'HomeController',
                    templateUrl: 'modules/home/views/home.html'
                })
                .when('/', {
                    controller: 'HomeController',
                    templateUrl: 'modules/home/views/home.html'
                })*/
                .otherwise({redirectTo: '/login'});
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
                    function (options, store, jwtHelper, $http, $rootScope, $location) {
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
                        var idToken = store.get('jwt') && store.get('jwt').token != 'undefined' ? store.get('jwt').token : null;
                        var rfToken = store.get('rwt') && store.get('rwt').token != 'undefined' ? store.get('rwt').token : null;

                        /*
                        if (!expToken) return null;
                        var date = jwtHelper.getTokenExpirationDate(expToken);
                        var tokenPayload = jwtHelper.decodeToken(expToken);
                        var bool = jwtHelper.isTokenExpired(expToken);
                        */

                        if (idToken && jwtHelper.isTokenExpired(idToken)) {
                            if (!rfToken || (rfToken && jwtHelper.isTokenExpired(rfToken))) {
                                if (rfToken) store.remove('rwt');
                                if (idToken) store.remove('jwt');
                                $rootScope.errorString = 'Δεν υπάρχει ενεργό login στην Υπηρεσία! Προσπαθήστε ΞΑΝΑ!';
                                $rootScope.globals = {item: null};
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
                                    'Authorization': 'Bearer ' + rfToken
                                },
                                method: 'POST',
                                data: {
                                    refreshToken: rfToken
                                }
                            }).then(function (response) {
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
    .controller('Controller', ['$scope', 'jwtHelper', 'store', 'globalVarsSrv', '$window', 'AuthenticationService', function Controller($scope, jwtHelper, store, globalVarsSrv, $window, AuthenticationService) {
        $scope.close = function () {
            globalVarsSrv.cookieSave();
        };
        // console.log('in App ctrl');
        //$window.onclose =  $scope.close();
    }])
    .run(['$rootScope', '$location', '$http', 'globalVarsSrv', 'AuthenticationService',
        function ($rootScope, $location, $http, globalVarsSrv, AuthenticationService) {
            var usr = null;
            if (usr = AuthenticationService.CheckCredentials()) {
                globalVarsSrv.appInit('config/appConfig.json', usr);
            }
            // console.log('in App Run');
        }]);

