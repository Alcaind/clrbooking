'use strict';

angular.module('MainComponents', [
    'Authentication',
    'ui.bootstrap',
    'GlobalVarsSrvs'
])

    .controller('MainComponentsController', ['$scope', '$interval', '$rootScope', '$location', function ($scope, $interval, $rootScope, $location) {
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
        }
    ])

    .controller('NavmenuController', ['$scope', '$interval', 'AuthenticationService', 'globalVarsSrv', '$location', 'api', '$routeParams', '$translate', function ($scope, $interval, AuthenticationService, globalVarsSrv, $location, api, $routeParams, $translate) {
        function roleMenuListener(nval, oval) {
            if (!nval) {
                $scope.adminColums = [];
                return;
            }
            var nv = globalVarsSrv.getGlobalVar('menuRole');
            $scope.adminColums = globalVarsSrv.getGlobalVar('menuRole') ? globalVarsSrv.getGlobalVar(nv === 'admin' ? 'homeButtonAdminTableConf' : nv === null ? '' : 'homeButtonUserTableConf') : [];
        }

        if (globalVarsSrv.getGlobalVar('appStarted') && globalVarsSrv.getGlobalVar('menuRole')) roleMenuListener();
        globalVarsSrv.addListener('appStarted', roleMenuListener);
        globalVarsSrv.addListener('appLoggedIn', roleMenuListener);
        globalVarsSrv.addListener('menuRole', roleMenuListener);
        $scope.toggleDropdown = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.isopen = !$scope.status.isopen;
        };

        $scope.getProfile = function () {
            var user = globalVarsSrv.getGlobalVar('auth');
            $scope.curUser = user.authdata.roles[0].id;
            $location.path('/users/' + $scope.curUser);

        };

        $scope.logout = function () {
            AuthenticationService.ClearCredentials();
        };

        $scope.closeWithCookie = function () {
            globalVarsSrv.cookieSave();
        };

        $scope.updateLanguage = function (lang) {
            $translate.use(lang);
            globalVarsSrv.setGlobalVar('lang', lang);
            globalVarsSrv.cookieSave();
            //globalVarsSrv.initFromFile(globalVarsSrv.cookieGet(globalVarsSrv.getGlobalVar('auth')));
        }

    }])

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

        factory.guestModal = function (url, size, type, title, data, buttons, okCallback, cancelCallback) {
            var $myModalInstance = $uibModal.open({
                templateUrl: url,
                controller: 'guestModalController',
                size: size ? size : 'sm',
                resolve: {
                    config: function () {
                        return {title: title, data: data, type: type, buttons: buttons, size: size}
                    }
                }
            });
            $myModalInstance.result.then(okCallback, cancelCallback);
            return $myModalInstance
        };


        factory.generalInfoModal = function (size, type, title, message, buttons, okCallback, cancelCallback) {
            var $myModalInstance = $uibModal.open({
                templateUrl: 'modules/mainComponents/views/genpopup.html',
                controller: 'gneralInfoPopupController',
                size: size ? size : 'sm',
                resolve: {
                    config: function () {
                        return {title: title, message: message, type: type, buttons: buttons, size: size}
                    }
                }
            });
            $myModalInstance.result.then(okCallback, cancelCallback);
            return $myModalInstance
        };

        factory.generalModal = function (url, size, type, title, data, buttons, okCallback, cancelCallback) {
            var $myModalInstance = $uibModal.open({
                templateUrl: url,
                controller: 'generalModalController',
                size: size ? size : 'sm',
                resolve: {
                    config: function () {
                        return {title: title, data: data, type: type, buttons: buttons, size: size}
                    }
                }
            });
            $myModalInstance.result.then(okCallback, cancelCallback);
            return $myModalInstance
        };

        factory.infoBookRoom = function (reqID, okCallback, cancelCallback) {
            var $myModalInstance = $uibModal.open({
                templateUrl: 'modules/mainComponents/views/infoFormPopUp.html',
                controller: 'infoFormPopUpController',
                size: 'lg',
                resolve: {
                    config: function () {
                        return {reqID: reqID}
                    }
                }
            });
            $myModalInstance.result.then(okCallback, cancelCallback);
            return $myModalInstance;
        };

        return factory;
    }
    ])
    .controller("PopupController", ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
        $scope.ok = function () {
            $uibModalInstance.close('ok');
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
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
            $uibModalInstance.dismiss('cancel');
        };
    }])
    .controller("generalModalController", ['$scope', '$uibModalInstance', 'config', function ($scope, $uibModalInstance, config) {
        $scope.title = config.title ? config.title : "Info";
        $scope.data = config.data;
        $scope.buttons = config.buttons ? config.buttons : 1;

        $scope.ok = function () {
            $uibModalInstance.close($scope.data);

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
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

    .controller('PaginationController', ['$scope', function ($scope) {
        $scope.pageThresholds = [{th: 1}, {th: 3}, {th: 5}, {th: 10}, {th: 20}, {th: 50}, {th: 'all'}];
        $scope.currentPage = 1;
        $scope.maxSize = 5;
        $scope.itemsPerPage = 10;

        //$scope.setItemsPerPage($scope.pageThresholds[6].th);

        $scope.$watch('totalItems', function (newVal, oldVal) {
            $scope.itemsPerPage = newVal;
        });

        //$scope.setItemsPerPage($scope.pageThresholds[6].th);
        $scope.numPages = $scope.totalItems / $scope.itemsPerPage;


        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.setItemsPerPage = function (num) {
            $scope.itemsPerPage = num === 'all' ? $scope.totalItems : num;
            $scope.currentPage = 1; //reset to first page
            $scope.numPages = $scope.totalItems / $scope.itemsPerPage;
            // $scope.selectedItem=$scope.itemsPerPage.num;
            // return $scope.selectedItem;
        };

    }])

    .controller('showHideOptionsController', ['$scope', function ($scope) {
        $scope.optionsVisible = false;

        $scope.hideShowOptions = function () {
            $scope.optionsVisible = !$scope.optionsVisible;
        };
        $scope.changeColumnVisibility = function (column, state) {
            column.visible = state ? state : !column.visible;
        };
    }])

    .directive('showHide', function ($http) {
        function link(scope, element, attrs) {
            scope.collapsed = true;
            scope.title = attrs.shTitle;

            scope.toggle = function collapsibleToggle(e) {
                e.preventDefault();
                scope.collapsed = !scope.collapsed;
            };

            scope.$watch('sh', function (newVal, oldVal) {
                if (!newVal) scope.collapsed = true;
            });
        }

        return {
            scope: {sh: '='},
            restrict: 'E',
            transclude: true,
            templateUrl: 'modules/mainComponents/views/showHide.html',
            link: link
        }
    })

    .controller('configController', ['$scope', 'api', '$location', function ($scope, api, $location) {
        $scope.configuration = {};
        if (!$scope.year) $scope.year = "1";

        $scope.init = function () {
            api.apiCall('GET', 'api/public/config/' + $scope.year, function (result) {
                $scope.configuration = result.data;
                $scope.configuration.s = false;
                $scope.configuration.totalDays = calcDaysDiff($scope.configuration.tod, $scope.configuration.fromd);

                for (var i = 0; i < $scope.configuration.periods.length; i++) {
                    $scope.configuration.periods[i].totalDays = calcDaysDiff($scope.configuration.periods[i].tod, $scope.configuration.periods[i].fromd);
                    $scope.configuration.periods[i].fdIndex = calcDaysDiff($scope.configuration.fromd, $scope.configuration.periods[i].fromd);
                    $scope.configuration.periods[i].tdIndex = $scope.configuration.periods[i].fdIndex + $scope.configuration.periods[i].totalDays;
                    $scope.configuration.periods[i].s = false;
                }
            })
        };

        function calcDaysDiff(from, to) {
            return Math.ceil(Math.abs(new Date(from) - new Date(to)) / (1000 * 3600 * 24));
        }

        $scope.setPeriod = function (period) {
            if ($scope.periodsActive === true) {
                if (period.status !== 0) {
                    $scope.selectedPeriod.s = false;
                    period.s = true;
                    $scope.selectedPeriod = period;
                }
            } else {
                $scope.selectedPeriod.s = false;
                period.s = true;
                $scope.selectedPeriod = period;
            }

        };

        $scope.$watch('year', function (newVal) {
            $scope.init();
        });

    }])
    .directive('configBookGraph', function () {
        return {
            restrict: "EA",
            scope: {
                selectedPeriod: "=",
                year: "=",
                periodsActive: "="
            },
            controller: "configController",
            templateUrl: 'modules/mainComponents/config/configGraph.html'
        }
    })

    .directive('fromToDatePicker', function () {
        return {
            restrict: "EA",
            scope: {fromd: "=", tod: "="},
            templateUrl: 'modules/mainComponents/views/datetime/fromtodate.html'
        }
    })
    .directive('fromToTimePicker', function () {
        return {
            restrict: "EA",
            scope: {fromt: "=", tot: "="},
            templateUrl: 'modules/mainComponents/views/datetime/fromtotime.html'
        }
    })
    .directive('ifLoading', function ($http) {
        return {
            restrict: 'A',
            link: function (scope, elem) {
                scope.isLoading = isLoading;

                scope.$watch(scope.isLoading, toggleElement);

                function toggleElement(loading) {
                    if (loading) {
                        elem.show();
                    } else {
                        elem.hide();
                    }
                }

                function isLoading() {
                    return $http.pendingRequests.length > 0;
                }
            }
        }
    })

    .directive('testTransclude', function () {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'modules/mainComponents/views/showHide.html'
        }
    })
    .directive('navmenu', function () {
        return {
            restrict: "EA",
            controller: 'NavmenuController',
            templateUrl: 'modules/mainComponents/views/navmenu.html'
        }
    })
    .directive('deleteRowButton', function () {
        return {
            restrict: "EA",
            templateUrl: 'modules/mainComponents/views/deleteRowButton.html'
        }
    })
    .directive('dmTitle', function () {
        return {
            restrict: "EA",
            templateUrl: 'modules/mainComponents/views/dmTitle.html'
        }
    })
    .directive('tableTools', function () {
        return {
            restrict: "EA",
            templateUrl: 'modules/mainComponents/views/tableTools.html'
        }
    })
    .directive('operations', function () {
        return {
            restrict: "EA",
            scope: {
                hr: "@",
                content: "@",
                gicon: "@",
                place: "@",
                item: "<"
            },
            templateUrl: 'modules/mainComponents/views/buttonPopUp.html'
        }
    })
    .directive('dmTh', function () {
        return {
            restrict: "EA",
            templateUrl: 'modules/mainComponents/views/dmth.html'
        }
    })
    //little pop-up mouse-over
    .directive('toggle', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if (attrs.toggle == "tooltip") {
                    $(element).tooltip();
                }
                if (attrs.toggle == "popover") {
                    $(element).popover();
                }
            }
        };
    })
    .directive('footer', function () {
        return {
            restrict: "EA",
            templateUrl: 'modules/mainComponents/views/footer.html'
        }
    })
    .directive('pagination', function () {
        return {
            restrict: "EA",
            scope: {
                currentPage: "=",
                totalItems: "=",
                itemsPerPage: "=",
                numPages: "="
            },
            templateUrl: 'modules/mainComponents/views/pagination.html',
            controller: "PaginationController"
        }
    })
    .directive('showHideColumns', function () {
        return {
            restrict: "EA",
            scope: {
                columsVisibility: "="
            },
            templateUrl: 'modules/mainComponents/views/showHideColumns.html',
            controller: "showHideOptionsController"
        }
    })
;
