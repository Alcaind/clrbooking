'use strict';

angular.module('Users', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
])
    .controller('UsersController', ['$scope', 'MakeModal', '$http', 'api', 'orderByFilter', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, MakeModal, $http, api, orderBy, AuthenticationService, makeController, globalVarsSrv) {
        AuthenticationService.CheckCredentials();

        $scope.ctrl = makeController.mainController('/users', 'usersTableConf');
        $scope.ctrl.init();

    }])

    .controller('ProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, AuthenticationService) {
        AuthenticationService.CheckCredentials();
        $scope.tms = {};
        $scope.ucategories = {};
        $scope.baseURL = 'api/public/users';

        api.apiCall('GET', 'api/public/tms', function (results) {
            $scope.tms = results.data;
        });

        api.apiCall('GET', 'api/public/userscategories', function (results) {
            $scope.ucategories = results.data;
        });

        if (!$routeParams.id) {
            $scope.item = {
                tm_id: "",
                fname: "",
                sname: "",
                phone: "",
                em_main: "",
                em_sec: "",
                em_pant: "",
                cat_id: "",
                comments: "",
                user: "",
                hash: ""
            };
        } else {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.id, function (results) {
                $scope.item = results.data;
            });
        }

        $scope.updateUser = function (item) {
            api.apiCall('PUT', $scope.baseURL + "/" + item.id, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Η εγγραφή του χρήστη ανανεώθηκε.', 1);
                history.back();
            }, undefined, item)

        };

        $scope.saveUser = function (item) {
            api.apiCall('POST', $scope.baseURL, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Νέα εγγραφή χρήστη δημιουργήθηκε.', 1);
                history.back();
            }, undefined, item)
        };
    }])

    .component('usersProfile', {
        restrict: 'EA',
        templateUrl: 'modules/users/uviews/profile.html',
        scope: {
            //itemId: '=itemId',
            method: '=method'
        },
        controller: 'ProfileController'
    })

    .directive('pwCheck', [function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.pwCheck;
                elem.add(firstPassword).on('keyup', function () {
                    scope.$apply(function () {
                        ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                    });
                });
            }
        }
    }])
;
