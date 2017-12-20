'use strict';

angular.module('MainComponents', [
    'Authentication',
    'ui.bootstrap'
])

    .controller('MainComponentsController', ['$scope', '$interval', '$rootScope', '$location', function ($scope, $interval, $rootScope, $location) {
        if ((!$rootScope.globals || !$rootScope.globals.currentUser || ($rootScope.globals.currentUser && !$rootScope.globals.currentUser.user)) && !$rootScope.inAuthentication) {
            $location.path('/login');
        }
    }])

    .run(['$rootScope', '$location', '$cookies', '$http', 'AuthenticationService',
        function ($rootScope, $location, $cookies, $http, AuthenticationService) {

            if ($rootScope.app) {
                window.location('app.livepraktoreio.gr/' + $rootScope.app);
                return;
            }
            if ($rootScope.globals && $rootScope.globals.currentUser) {
                return;
            }

            $rootScope.inAuthentication = true;

            AuthenticationService.Login('', '', function (response) {
                $rootScope.inAuthentication = false;
                if (response === 'fail') {
                    $rootScope.globals = {currentUser: null};
                    $location.path('/login');
                    return;
                }

                if (!response.data.success || typeof response.data.success !== 'object') {
                    $rootScope.errorString = 'Δεν υπάρχει ενεργό login στην Υπηρεσία! Προσπαθήστε ΞΑΝΑ!';
                    $rootScope.globals = {currentUser: null};
                    $location.path('/login');
                    return;
                }

                $rootScope.globals = {currentUser: {}};
                $rootScope.globals.currentUser = response.data.success;
                $rootScope.user = $rootScope.globals.currentUser.user;
            })
        }
    ])
    .directive('navmenu', function () {
        return {
            restrict: "EA",
            controller: 'NavmenuController',
            templateUrl: 'modules/mainComponents/views/navmenu.html'
        }
    })
    .controller('NavmenuController', ['$scope', '$interval', '$rootScope', '$location', function ($scope, $interval, $rootScope, $location) {
    }])

    .directive('footer', function () {
        return {
            restrict: "EA",
            controller: 'FooterController',
            templateUrl: 'modules/mainComponents/views/footer.html'
        }
    })
    .controller('FooterController', ['$scope', '$interval', '$rootScope', '$location', function ($scope, $interval, $rootScope, $location) {
    }])

    .factory("MakeModal", ['$uibModal', function ($uibModal) {

        var factory = {};

        factory.defaultModal = function (size, okCallback, cancelCallback, scope) {

            var $myModalInstance = $uibModal.open({
                templateUrl: 'modules/mainComponents/views/popup.html',
                controller: 'PopupController',
                scope: scope,
                size: size
            });

            function ok(result) {
                alert(result);
            }

            function cancel(result) {
                alert(result);
            }

            $myModalInstance.result.then(ok, cancel);


            return $myModalInstance
        };

        factory.okModal = function () {
        };

        return factory;
    }])


    .controller("PopupController", ['$scope', '$uibModalInstance', '$rootScope', '$location', function ($scope, $uibModalInstance, $rootScope, $location) {
        $scope.ok = function () {
            $uibModalInstance.close('ok');
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }])

// .directive("popup", function () {
//     return {
//         restrict: "E",
//         scope: true,
//         transclude: true,
//         templateUrl: 'modules/mainComponents/views/popupholder.html',
//         controller: 'PopupHolderController'
//     }
// })






;


