// 'use strict';
//
// angular.module('RoomBook', [
//     'MainComponents',
//     'ui.bootstrap',
//     'ApiModules',
//     'Authentication',
//     'GlobalVarsSrvs'
// ]).controller('RoomBookController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, globalVarsSrv) {
//
//     $scope.ctrl = makeController.mainController('/booking', 'rooombookTableConf', 'Κλείσε μια αίθουσα τωρα');
//     $scope.ctrl.init();
//
// }])
//     .controller('RoomBookProfileController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', '$routeParams', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, $routeParams, api) {
//         $scope.ctrl = makeController.profileController('/booking', 'rooombookTableConf');
//         $scope.ctrl.init();
//     }])
//     .component('roomBookProfile', {
//         restrict: 'EA',
//         templateUrl: 'modules/booking/roombookviews/rbprofile.html',
//         scope: {
//             method: '='
//         },
//         controller: 'RoomBookProfileController'
//     })
//
// ;