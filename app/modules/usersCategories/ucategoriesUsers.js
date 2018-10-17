angular.module('UsersCategories')
    .controller('UcategoriesUsersController', ['$scope', 'AuthenticationService', 'makeController', '$routeParams', 'api', 'globalVarsSrv', '$translate',
        function ($scope, AuthenticationService, makeController, $routeParams, api, globalVarsSrv, $translate) {
            var ucategory = {};
            $scope.fromAnotherPage = true;

            api.apiCall('GET', globalVarsSrv.getGlobalVar('appUrl') + '/userscategories/' + $routeParams.id, function (results) {
                ucategory = results.data;
                $scope.ctrl = makeController.mainController('/users/userscategories/' + $routeParams.id, 'usersTableConf', $translate.instant("Κατοχυρωμένοι χρήστες στον ρόλο") + " " + ucategory.comment);
                $scope.ctrl.init();
            });
        }])
;
