'use strict';

angular.module('Ps', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
]).controller('PsController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv) {

    $scope.ctrl = makeController.mainController('/ps', 'psTableConf', ' Πρόγραμμα Σπουδων ');
    $scope.ctrl.init();


}])
// .controller('PsProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, $routeParams, api, MakeModal, AuthenticationService, makeController, globalVarsSrv) {
//     $scope.ctrl = makeController.profileController('/ps', 'psTableConf');
//     $scope.ctrl.init();
//
//     $scope.tms = {};
//     $scope.configs = {};
//     $scope.teachers = [];
//
//
//     api.apiCall('GET', 'api/public/tms', function (results) {
//         $scope.tms = results.data;
//     });
//
//     api.apiCall('GET', 'api/public/users', function (results) {
//         for (var i = 0; i < results.data.length; i++) {
//             if (results.data[i].cat_id === 7) $scope.teachers.push(results.data[i]);
//         }
//     });
//
//     api.apiCall('GET', 'api/public/config', function (results) {
//         $scope.configs = results.data;
//     });
// }])
//
// .component('psProfile', {
//     restrict: 'EA',
//     templateUrl: 'modules/ps/psviews/psprofile.html',
//     scope: {
//         method: '='
//     },
//     controller: 'PsProfileController'
// })
;