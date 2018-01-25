'use strict';

angular.module('MainComponents', [
    'Authentication',
    'ui.bootstrap'
])

    .controller('MainComponentsController', ['$scope', '$interval', '$rootScope', '$location', function ($scope, $interval, $rootScope, $location) {
        if ((!$rootScope.globals || !$rootScope.globals.item || ($rootScope.globals.item && !$rootScope.globals.item.user)) && !$rootScope.inAuthentication) {
            $location.path('/login');
        }
    }])

    .run(['$rootScope', '$location', '$cookies', '$http', 'AuthenticationService',
        function ($rootScope, $location, $cookies, $http, AuthenticationService) {

            if ($rootScope.app) {
                window.location('app.livepraktoreio.gr/' + $rootScope.app);
                return;
            }
            if ($rootScope.globals && $rootScope.globals.item) {
                return;
            }

            $rootScope.inAuthentication = true;

            /*AuthenticationService.Login('', '', function (response) {
                $rootScope.inAuthentication = false;
                if (response === 'fail') {
                    $rootScope.globals = {item: null};
                    $location.path('/login');
                    return;
                }

                if (!response.data.success || typeof response.data.success !== 'object') {
                    $rootScope.errorString = 'Δεν υπάρχει ενεργό login στην Υπηρεσία! Προσπαθήστε ΞΑΝΑ!';
                    $rootScope.globals = {item: null};
                    $location.path('/login');
                    return;
                }

                $rootScope.globals = {item: {}};
                $rootScope.globals.item = response.data.success;
                $rootScope.user = $rootScope.globals.item.user;
            })*/
        }
    ])
    .directive('navmenu', function () {
        return {
            restrict: "EA",
            controller: 'NavmenuController',
            templateUrl: 'modules/mainComponents/views/navmenu.html'
        }
    })
    .controller('NavmenuController', ['$scope', '$interval', 'AuthenticationService', '$rootScope', '$location', function ($scope, $interval, AuthenticationService, $rootScope, $location) {
        $scope.toggleDropdown = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.isopen = !$scope.status.isopen;
        };

        $scope.logout = function () {
            AuthenticationService.ClearCredentials();
        }
    }])

    .directive('footer', function () {
        return {
            restrict: "EA",
            templateUrl: 'modules/mainComponents/views/footer.html'
        }
    })


    .factory("MakeModal", ['$uibModal', function ($uibModal) {
        var factory = {};

        factory.defaultModal = function (size, okCallback, cancelCallback, scope, resolve) {
            var $myModalInstance = $uibModal.open({
                templateUrl: 'modules/mainComponents/views/popup.html',
                controller: 'PopupController',
                scope: scope,
                size: size
            });

            $myModalInstance.result.then(okCallback, cancelCallback);
            return $myModalInstance
        };

        factory.okModal = function () {
        };

        factory.infoModal = function (size, infoMessage) {
            var $myModalInstance = $uibModal.open({
                templateUrl: 'modules/mainComponents/views/popup.html',
                controller: 'infoPopupController',
                size: size,
                resolve: {
                    modalMessage: function () {
                        return infoMessage;
                    }
                }
            });
            return $myModalInstance

        }

        factory.generalInfoModal = function (config) {
            var $myModalInstance = $uibModal.open({
                templateUrl: 'modules/mainComponents/views/genpopup.html',
                controller: 'gneralInfoPopupController',
                size: config.size ? config.size : 'sm',
                resolve: {
                    config: function () {
                        return config;
                    }
                }
            });
            return $myModalInstance
        }

        return factory;
    }])
    .controller("PopupController", ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

        $scope.ok = function () {
            $uibModalInstance.close('ok');
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }])
    .controller("infoPopupController", ['$scope', '$uibModalInstance', 'modalMessage', function ($scope, $uibModalInstance, modalMessage) {
        $scope.modalMessage = modalMessage;
        $scope.ok = function () {
            $uibModalInstance.close('ok');
        };
    }])
    .controller("gneralInfoPopupController", ['$scope', '$uibModalInstance', 'config', function ($scope, $uibModalInstance, config) {
        $scope.title = config.title ? config.title : "Info";
        $scope.modalMessage = config.message ? config.message : "message";
        $scope.type = config.type ? config.type : 'info';
        $scope.buttons = config.buttons ? config.buttons : 1;

        $scope.ok = function () {
            $uibModalInstance.close('ok');
        };

        $scope.cancel = function () {
            $uibModalInstance.close('cancel');
        };
    }])

    .directive('backButton', function () {
        return {
            restrict: 'A',

            link: function (scope, element, attrs) {
                element.bind('click', goBack);

                function goBack() {
                    history.back();
                    scope.$apply();
                }
            }
        }
    })

    .directive('pagination', function () {
        return {
            restrict: "EA",
            // controller:"PaginationController",
            templateUrl: 'modules/mainComponents/views/pagination.html'
        }
    })
// .controller('PaginationController', ['$scope', '$interval', '$rootScope', '$location', function ($scope, $interval, $rootScope, $location) {
//     $scope.pageThresholds = [{th: 'all'}, {th: 3}, {th: 5}, {th: 10}, {th: 20}, {th: 50}];
//     $scope.totalItems = 40;
//     $scope.currentPage = 1;
//     $scope.itemsPerPage = 'all';
//     $scope.maxSize = 5; //Number of pager buttons to show
//     //$scope.totalItems = 0;
//
//     $scope.setPage = function (pageNo) {
//         $scope.currentPage = pageNo;
//     };
//
//     $scope.setItemsPerPage = function (num) {
//         $scope.itemsPerPage = num === 'all' ? $scope.totalItems : num;
//         $scope.currentPage = 1; //reset to first page
//     };
//
// }])
;


