'use strict';

angular.module('Home', []);
//angular.module('Login');
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
angular.module('ItemType', []);
angular.module('RoomCategory', []);
angular.module('RoomUse', []);
angular.module('RoomBook', []);
angular.module('PsStats', []);

// Declare app level module which depends on views, and components
angular.module('clrBooking', [
    'pascalprecht.translate',
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
    'ItemType',
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

    .config(['$locationProvider', '$routeProvider', '$httpProvider', 'jwtOptionsProvider', 'jwtInterceptorProvider', '$translateProvider',
        function ($locationProvider, $routeProvider, $httpProvider, jwtOptionsProvider, jwtInterceptorProvider, $translateProvider) {

            $translateProvider
                .useStaticFilesLoader({
                    //prefix: '/panteion/config/', //localhost
                    prefix: '/panteion/app/config/', //GERMANY server
                    //prefix: '/config/', //PANTEIO's server
                    suffix: '.json'
                })
                .useSanitizeValueStrategy(null)
                .useMissingTranslationHandler();


            $routeProvider
                .when('/', {
                    title: 'Αιθουσολόγιο - Διαχείριση',
                    controller: 'HomeController',
                    templateUrl: 'modules/home/views/home.html'
                })
                .when('/admin', {
                    title: "Αρχική",
                    controller: 'HomeController',
                    templateUrl: 'modules/home/views/home.html'
                })
                .when('/login', {
                    title: "Είσοδος",
                    controller: 'LoginController',
                    templateUrl: 'modules/login/views/login.html'
                })
                .when('/home', {
                    title: "Αρχική",
                    controller: 'HomeController',
                    templateUrl: 'modules/home/views/home.html'
                })
                .when('/config', {
                    title: 'Config',
                    controller: 'ConfigController',
                    templateUrl: 'modules/config/confviews/configs.html'
                })
                .when('/config/create', {
                    title: 'Δημιουργία configuration',
                    template: '<config-profile></config-profile>'
                })
                .when('/config/:id', {
                    title: 'Επεξεργασία configuration',
                    template: '<config-profile></config-profile>'
                })
                .when('/config/:id/ps', {
                    title: 'Πρόγραμμα σπουδών ',
                    controller: 'ConfigPsController',
                    templateUrl: 'modules/ps/psviews/ps.html'
                })
                .when('/items', {
                    title: 'Εξοπλισμός',
                    controller: 'ItemsController',
                    templateUrl: 'modules/items/itemviews/items.html'
                })
                .when('/items/create', {
                    title: 'Δημιουργία Εξοπλισμου',
                    template: '<items-profile></items-profile>'
                })
                .when('/items/:id', {
                    title: 'Επεξεργασία Εξοπλισμού',
                    template: '<items-profile></items-profile>'
                })
                .when('/items/:id/rooms', {
                    title: 'Εξοπλισμός - Αίθουσες',
                    controller: 'ItemsRoomsController',
                    templateUrl: 'modules/items/itemviews/rooms/ItemRoom.html'
                })
                .when('/itemtype', {
                    title: 'Τύπος-είδος εξοπλισμού',
                    controller: 'ItemTypeController',
                    templateUrl: 'modules/items/itemviews/items.html'
                })
                .when('/itemtype/create', {
                    title: 'Δημιουργία τύπου-είδους εξοπλισμού',
                    template: '<itemtype-profile></itemtype-profile>'
                })
                .when('/itemtype/:id', {
                    title: 'Επεξεργασία τύπου-είδους εξοπλισμού',
                    template: '<itemtype-profile></itemtype-profile>'
                })
                // .when('/kats', {
                //     title: 'Κατευθύνσεις',
                //     controller: 'KatController',
                //     templateUrl: 'modules/kat/katsviews/kats.html'
                // })
                // .when('/kats/create', {
                //     title: 'Δημιουργία κατευθύνσης',
                //     template: '<kat-profile></kat-profile>'
                // })
                // .when('/kats/:id', {
                //     title: 'Επεξεργασία κατευθύνσης',
                //     template: '<kat-profile></kat-profile>'
                // })
                .when('/periods', {
                    title: 'Ακαδημαϊκή Περίοδος',
                    controller: 'PeriodsController',
                    templateUrl: 'modules/periods/periodviews/periods.html'
                })
                .when('/periods/create', {
                    title: 'Δημιουργία ακαδημαϊκής περιόδου',
                    template: '<period-profile></period-profile>'
                })
                .when('/periods/:id', {
                    title: 'Επεξεργασία ακαδημαϊκής περιόδου',
                    template: '<period-profile></period-profile>'
                })
                .when('/ps', {
                    title: 'Πρόγραμμα Σπουδών',
                    controller: 'PsController',
                    templateUrl: 'modules/ps/psviews/ps.html'
                })
                .when('/ps/conf/:cid/create', {
                    title: 'Δημιουργία προγράμματος σπουδών',
                    template: '<ps-profile></ps-profile>'
                })
                .when('/ps/:id', {
                    title: 'Επεξεργασία προγράμματος σπουδών',
                    template: '<ps-profile></ps-profile>'
                })
                .when('/ps/:id/teachers', {
                    title: 'Πρόγραμμα Σπουδών - Καθηγητές',
                    controller: 'TeachersController',
                    templateUrl: 'modules/ps/teachers/TeachersPs.html'
                })
                .when('/requests', {
                    title: 'Αιτήματα',
                    controller: 'RequestsController',
                    templateUrl: 'modules/requests/reqviews/requests.html'
                })
                .when('/requests/config/:cid/create', {
                    title: 'Δημιουργία αιτήματος',
                    template: '<requests-profile></requests-profile>'
                })
                .when('/requests/:id', {
                    title: 'Επεξεργασία αιτήματος',
                    template: '<requests-profile></requests-profile>'
                })
                .when('/requests/:id/rooms', {
                    title: 'Αίτημα - Αίθουσα',
                    controller: 'RequestsRoomsController',
                    templateUrl: 'modules/requests/reqviews/rooms/mainn2n.html'
                })
                .when('/requests/:id/guests', {
                    title: 'Αίτημα - Συμμετέχων Τηλεδιάσκεψης',
                    controller: 'ReqGuestsController',
                    templateUrl: 'modules/requests/reqviews/requests_guests/requestsguestsviews/requestsguests.html'
                })
                .when('/requests/:rid/guests/create', {
                    title: 'Αίτημα - Δημιουργία Συμμετέχων Τηλεδιάσκεψης',
                    template: '<req-guests-profile></req-guests-profile>'
                })
                .when('/requests/:rid/guests/:id', {
                    title: 'Αίτημα - Επεξεργασία Συμμετέχων Τηλεδιάσκεψης',
                    template: '<req-guests-profile></req-guests-profile>'
                })
                .when('/roles', {
                    title: 'Ρόλοι',
                    controller: 'RolesController',
                    templateUrl: 'modules/roles/views/roles.html'
                })
                .when('/roles/create', {
                    title: 'Δημιουργία ρόλου',
                    template: '<roles-profile></roles-profile>'
                })
                .when('/roles/:id', {
                    title: 'Επεξεργασία ρόλου',
                    template: '<roles-profile></roles-profile>'
                })
                .when('/roles/:id/users', {
                    title: 'Ρόλος - Χρήστης',
                    controller: 'RolesUserController',
                    templateUrl: 'modules/roles/views/rolesusers.html'
                })
                .when('/roomcategory', {
                    title: 'Κατηγορίες Αίθουσών',
                    controller: 'RoomCategoryController',
                    templateUrl: 'modules/roomCategory/rcviews/rcategories.html'
                })
                .when('/roomcategory/create', {
                    title: 'Δημιουργία κατηγορίας αίθουσας',
                    template: '<room-category-profile></room-category-profile>'
                })
                .when('/roomcategory/:id', {
                    title: 'Επεξεργασία κατηγορίας αίθουσας',
                    template: '<room-category-profile></room-category-profile>'
                })
                .when('/roomuse', {
                    title: 'Χρήσεις Αιθουσών',
                    controller: 'RoomUseController',
                    templateUrl: 'modules/roomUse/ruseviews/roomuse.html'
                })
                .when('/roomuse/create', {
                    title: 'Δημιουργία χρήσης αίθουσας',
                    template: '<room-use-profile></room-use-profile>'
                })
                .when('/roomuse/:id', {
                    title: 'Επεξεργασία χρήσης αίθουσας',
                    template: '<room-use-profile></room-use-profile>'
                })
                .when('/rooms', {
                    title: 'Αίθουσες',
                    controller: 'RoomsController',
                    templateUrl: 'modules/rooms/rviews/rooms.html'
                })
                .when('/rooms/create', {
                    title: 'Δημιουργία αίθουσας',
                    template: '<room-profile></room-profile>'
                })
                .when('/rooms/:id', {
                    title: 'Επεξεργασία αίθουσας',
                    template: '<room-profile></room-profile>'
                })
                .when('/rooms/:id/roomuse', {
                    title: 'Αίθουσα - Χρήσεις Αίθουσας',
                    controller: 'RoomsUsagesController',
                    templateUrl: 'modules/rooms/rviews/UCroom.html'
                })
                .when('/rooms/:id/items', {
                    title: 'Αίθουσα - Εξοπλισμός',
                    controller: 'RoomsItemsController',
                    templateUrl: 'modules/rooms/rviews/items/ItemRoom.html'
                })
                .when('/rooms/:id/tms', {
                    title: 'Αίθουσα - Τμήμα',
                    controller: 'RoomsTmsController',
                    templateUrl: 'modules/rooms/rviews/tms/TmsRoom.html'
                })
                .when('/rooms/:id/requests', {
                    title: 'Αίθουσα - Αίτήματα',
                    controller: 'RoomRequestsController',
                    templateUrl: 'modules/requests/reqviews/requests.html'
                })
                .when('/rooms/:rid/requests/create', {
                    title: 'Αίθουσα - Δημιουργία Αίτήματος',
                    template: '<req-rooms-profile></req-rooms-profile>'
                })
                .when('/rooms/:rid/requests/:id', {
                    title: 'Αίθουσα - Επεξεργασία Αίτήματος',
                    template: '<req-rooms-profile></req-rooms-profile>'
                })
                .when('/tms', {
                    title: 'Τμήματα',
                    controller: 'TmsController',
                    templateUrl: 'modules/tm/tmviews/tms.html'
                })
                .when('/tm/create', {
                    title: 'Δημιουργία τμήματος',
                    template: '<tm-profile></tm-profile>'
                })
                .when('/tms/:id', {
                    title: 'Επεξεργασία τμήματος',
                    template: '<tm-profile></tm-profile>'
                })
                .when('/userscategories', {
                    title: 'Κατηγοριές Χρηστών',
                    controller: 'UsersCategoriesController',
                    templateUrl: 'modules/usersCategories/ucviews/ucategories.html'
                })
                .when('/userscategories/create', {
                    title: 'Δημιουργία κατηγορίας χρήστη',
                    template: '<users-categories-profile></users-categories-profile>'
                })
                .when('/userscategories/:id', {
                    title: 'Επεξεργασία κατηγορίας χρήστη',
                    template: '<users-categories-profile></users-categories-profile>'
                })
                .when('/userscategories/:id/users', {
                    title: 'Κατηγορία χρήστη - Χρήστης',
                    controller: 'UcategoriesUsersController',
                    templateUrl: 'modules/users/uviews/users.html'
                })
                .when('/users', {
                    title: 'Χρήστες',
                    controller: 'UsersController',
                    templateUrl: 'modules/users/uviews/users.html'
                })
                .when('/users/create', {
                    title: 'Δημιουργία χρήστη',
                    template: '<users-profile></users-profile>'
                })
                .when('/users/:id', {
                    title: 'Επεξεργασία χρήστη',
                    template: '<users-profile></users-profile>'
                })
                .when('/users/:id/requests', {
                    title: 'Χρήστης - Αιτήματα',
                    controller: 'URequestsController',
                    templateUrl: 'modules/requests/reqviews/requests.html'
                })
                .when('/users/:id/roles', {
                    title: 'Χρήστης - Ρόλοι',
                    controller: 'URolesController',
                    templateUrl: 'modules/users/uviews/urole.html'
                })
                .when('/users/:id/tms', {
                    title: 'Χρήστης - Τμήματα',
                    controller: 'UsersTmsController',
                    templateUrl: 'modules/users/utms/userTms.html'
                })
                .when('/users/:id/rooms', {
                    title: 'Χρήστης - Αίθουσα',
                    controller: 'UsersRoomsController',
                    templateUrl: 'modules/users/rooms/ItemRoom.html'
                })
                // .when('/psstats', {
                //     title: 'Στατιστικά',
                //     controller: 'PsStatsController',
                //     templateUrl: 'modules/ps_stats/psstatsviews/psstats.html'
                // })
                // .when('/psstats/create', {
                //     title: 'Δημιουργία στατιστικών',
                //     template: '<ps-stats-profile></ps-stats-profile>'
                // })
                // .when('/psstats/:id', {
                //     title: 'Επεξεργασία στατιστικών',
                //     template: '<ps-stats-profile></ps-stats-profile>'
                // })
                .when('/roombook', {
                    title: 'Διαθεσιμότητα',
                    controller: 'BookController',
                    templateUrl: 'modules/bookview/bookView.html'
                })
                .when('/roombook/dates', {
                    title: 'Διαθεσιμότητα',
                    controller: 'BookController',
                    templateUrl: 'modules/bookview/bookView.html'
                })
                .when('/usercreaterequests', {
                    title: 'Αίτημα Δέσμευσης',
                    controller: 'CreateFormController',
                    templateUrl: 'modules/requests/createUserRequest/createForm.html'
                })
                .when('/usercreaterequests/:id', {
                    title: 'Επεξεργασία Αιτήματος Δέσμευσης',
                    controller: 'CreateFormController',
                    templateUrl: 'modules/requests/createUserRequest/createForm.html'
                })
                .when('/dashboard', {
                    title: 'Πίνακας Ελέγχου',
                    controller: 'UserViewController',
                    templateUrl: 'modules/userView/userHome/uhome.html'
                })
                // .when('/publicroombook', {
                //     title: 'publicuserroombook',
                //     controller: 'BookController',
                //     templateUrl: 'modules/bookview/bookView.html'
                // })
                .when('/utilities', {
                    title: 'Αντιγραφή Περιόδου',
                    controller: 'UtilitiesController',
                    templateUrl: 'modules/adminUtilities/copyPeriod.html'
                })
                // .when('/copyday', {
                //     title: 'Αντιγραφή Ημέρας',
                //     controller: 'CopyDayController',
                //     templateUrl: 'modules/adminUtilities/copyDay.html'
                // })
                .when('/checkpending', {
                    title: 'Διαγραφή Ληγμένων',
                    controller: 'UtilitiesController',
                    templateUrl: 'modules/adminUtilities/copyPeriod.html'
                })
                .when('/holidayhold', {
                    title: 'Ορισμός Αργιών',
                    controller: 'UtilitiesController',
                    templateUrl: 'modules/adminUtilities/setHoliday.html'
                })
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
                        if (!refreshPromise) var refreshPromise = null;
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
                            //var refreshToken = store.get('rwt');
                            // This is a promise of a JWT id_token
                            refreshPromise = $http({
                                url: 'http://localhost/panteion/api/public/refresh-token',
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
                            }, function (reason) {
                                // alert(reason.toString());
                                $location.path('/login');
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
    .controller('Controller', ['$scope', 'jwtHelper', 'store', 'globalVarsSrv', '$window', 'AuthenticationService', '$translate', function Controller($scope, jwtHelper, store, globalVarsSrv, $window, AuthenticationService, $translate) {
        $scope.close = function () {
            globalVarsSrv.cookieSave();
        };
        console.log('in App ctrl');
        //$window.onclose =  $scope.close();
    }])
    .run(['$rootScope', '$location', '$http', 'globalVarsSrv', 'AuthenticationService', '$route', 'ClrStatusSrv', '$translate',
        function ($rootScope, $location, $http, globalVarsSrv, AuthenticationService, $route, ClrStatusSrv, $translate) {
            var usr = null;
            if (usr = AuthenticationService.CheckCredentials()) {
                // globalVarsSrv.appInit('config/appConfig.json', usr);
                globalVarsSrv.appInit('appConfig', usr);
            }
            $rootScope.$on('$routeChangeSuccess', function () {
                //document.title = $route.current.title;
                document.title = $translate.instant($route.current.title);
            });
            console.log('in App Run');
            ClrStatusSrv.getStatus('roomStatus');
        }]);

