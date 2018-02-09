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
    'RoomBook',
    'PsStats'
])

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
                .when('/roles', {
                    title: 'roles',
                    controller: 'RolesController',
                    templateUrl: 'modules/roles/views/roles.html'
                })
                .when('/roles/create', {
                    title: 'role create',
                    template: '<roles-profile></roles-profile>'
                })
                .when('/roles/:roleId', {
                    title: 'role',
                    template: '<roles-profile></roles-profile>'
                })
                .when('/roles/:roleId/users', {
                    title: 'role',
                    template: '<roles-users></roles-users>'
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
                .when('/users/:userId', {
                    title: 'user',
                    template: '<users-profile></users-profile>'
                })
                .when('/users/:userId/requests', {
                    title: 'user request',
                    controller: 'URequestsController',
                    templateUrl: 'modules/users/uviews/urequest.html'
                })
                .when('/users/:userId/roles', {
                    title: 'user role',
                    controller: 'URolesController',
                    templateUrl: 'modules/users/uviews/urole.html'
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
                .when('/rooms/:roomId', {
                    title: 'rooms',
                    template: '<room-profile></room-profile>'
                })

                .when('/rooms/:roomId/usages', {
                    title: 'user request',
                    controller: 'RoomsUsagesController',
                    templateUrl: 'modules/rooms/rviews/UCroom.html'
                })
                .when('/rooms/:roomId/items', {
                    title: 'room items',
                    controller: 'RoomsItemsController',
                    templateUrl: 'modules/rooms/rviews/items/ItemRoom.html'
                })


                .when('/rooms/:roomId/tms', {
                    title: 'room tms',
                    controller: 'RoomsTmsController',
                    templateUrl: 'modules/rooms/rviews/tms/TmsRoom.html'
                })
                .when('/rooms/:roomId/requests', {
                    title: 'room requests',
                    controller: 'RoomRequestsController',
                    templateUrl: 'modules/rooms/rviews/request/urequest.html'
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
                .when('/tms/:tmId', {
                    title: 'tm',
                    template: '<tm-profile></tm-profile>'
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
                .when('/kats/:katId', {
                    title: 'kat',
                    template: '<kat-profile></kat-profile>'
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
                .when('/requests/:requestId', {
                    title: 'requests',
                    template: '<requests-profile></requests-profile>'
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
                .when('/userscategories/:userscategoryId', {
                    title: 'users categories',
                    template: '<users-categories-profile></users-categories-profile>'
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
                .when('/config/:configId', {
                    title: 'configuration',
                    template: '<config-profile></config-profile>'
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
                .when('/ps/:psId', {
                    title: 'curroculum',
                    template: '<ps-profile></ps-profile>'
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
                .when('/periods/:periodId', {
                    title: 'academic period',
                    template: '<period-profile></period-profile>'
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
                .when('/items/:itemId', {
                    title: 'items',
                    template: '<items-profile></items-profile>'
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
                .when('/roomcategory/:roomcategoryId', {
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
                .when('/roomuse/:roomuseId', {
                    title: 'room use',
                    template: '<room-use-profile></room-use-profile>'
                })

                .when('/booking', {
                    title: 'booking',
                    controller: 'roomBookController',
                    templateUrl: 'modules/booking/roombookviews/roombook.html'
                })
                .when('/booking/create', {
                    title: 'booking create',
                    template: '<room-book-profile></room-book-profile>'
                })
                .when('/booking/:roombookId', {
                    title: 'booking',
                    template: '<room-book-profile></room-book-profile>'
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
                .when('/psstats/:psstatId', {
                    title: 'statistics',
                    template: '<ps-stats-profile></ps-stats-profile>'
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
    .controller('Controller', ['jwtHelper', 'store', function Controller(jwtHelper, store) {

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

                    $rootScope.globals.item = response.data;
                    $location.path('/home');

                }, function (response) {
                    console.log(response.status);
                    $rootScope.globals.item = '';
                    $location.path('/login');
                });*/
        }])
;