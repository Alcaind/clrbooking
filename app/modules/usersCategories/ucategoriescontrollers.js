'use strict';

angular.module('UsersCategories', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'

])
    .controller('UsersCategoriesController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv) {

        $scope.ctrl = makeController.mainController('/userscategories', 'userscategoriesTableConf', 'Κατηγορίες Χρηστών');
        $scope.ctrl.init();

    }])
    .controller('UsersCategoriesProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api) {

        $scope.ctrl = makeController.profileController('/userscategories', 'userscategoriesTableConf');
        $scope.ctrl.init();

    }])
    .component('usersCategoriesProfile', {
        restrict: 'EA',
        templateUrl: 'modules/usersCategories/ucviews/ucprofile.html',
        scope: {
            method: '='
        },
        controller: 'UsersCategoriesProfileController'
    })
;