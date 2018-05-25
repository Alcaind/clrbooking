angular.module('UsersCategories')
    .controller('UcategoriesUsersController', ['$scope', 'AuthenticationService', 'makeController', '$routeParams', 'api', 'globalVarsSrv',
        function ($scope, AuthenticationService, makeController, $routeParams, api, globalVarsSrv) {
            var ucategory = {};

            api.apiCall('GET', globalVarsSrv.getGlobalVar('appUrl') + '/userscategories/' + $routeParams.id, function (results) {
                ucategory = results.data;
                $scope.ctrl = makeController.mainController('/users/userscategories/' + $routeParams.id, 'usersTableConf', "Κατοχυρωμένοι χρήστες στον ρόλο " + ucategory.comment);
                $scope.ctrl.init();

            });
        }])
;
