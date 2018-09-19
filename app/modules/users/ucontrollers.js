'use strict';

angular.module('Users', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
])
    .controller('UsersController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv) {

        $scope.ctrl = makeController.mainController('/users', 'usersTableConf', 'Κατάλογος Χρηστών');
        $scope.ctrl.init();

    }])

    .controller('ProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, $routeParams, api, MakeModal, AuthenticationService, makeController, globalVarsSrv) {
        var user = globalVarsSrv.getGlobalVar('auth');
        $scope.curUser = user.authdata.roles[0].id;
        if ($scope.curUser != $routeParams.id && globalVarsSrv.getGlobalVar('menuRole') !== 'admin') return;
        $scope.ctrl = makeController.profileController('/users', 'usersTableConf');
        $scope.ctrl.init();
        $scope.tms = {};
        $scope.ucategories = {};

        api.apiCall('GET', 'api/public/tms', function (results) {
            $scope.tms = results.data;
        });

        api.apiCall('GET', 'api/public/userscategories', function (results) {
            $scope.ucategories = results.data;
        });
    }])

    .component('usersProfile', {
        restrict: 'EA',
        templateUrl: 'modules/users/uviews/profile.html',
        scope: {
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
