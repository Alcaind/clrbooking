'use strict';

angular.module('MainComponents')
    .factory('ClrStatusSrv', function ($http) {
        var clrStatus = {};

        $http.get('config/appConfig.json')
            .then(function (res) {
                clrStatus = res.data;
            }, function (res) {
                console.log(res | JSON);
            });

        function getStatus(name) {
            return clrStatus[name];
        }

        var srv = {
            getStatus: getStatus
        };

        return srv;
    })
    .directive('statusSelector', function () {
        return {
            restrict: "EA",
            scope: {
                statusTitle: "@",
                options: "@",
                outputValue: "="
            },
            controller: "statusSelectorController",
            templateUrl: 'modules/mainComponents/views/statusSelector.html'
        }
    })
    .controller('statusSelectorController', function ($scope, ClrStatusSrv) {
        $scope.optStatus = ClrStatusSrv.getStatus($scope.options);

    });