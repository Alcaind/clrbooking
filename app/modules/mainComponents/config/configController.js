'use strict';

angular.module('MainComponents')
    .controller('configController', ['$scope', 'api', function ($scope, api) {
        $scope.configuration = {};
        api.apiCall('GET', 'api/public/config/1', function (result) {
            $scope.configuration = result.data;
            $scope.configuration.totalDays = calcDaysDiff($scope.configuration.tod, $scope.configuration.fromd);
            for (var i = 0; i < $scope.configuration.periods.length; i++) {
                $scope.configuration.periods[i].totalDays = calcDaysDiff($scope.configuration.periods[i].tod, $scope.configuration.periods[i].fromd);
                $scope.configuration.periods[i].fdIndex = calcDaysDiff($scope.configuration.fromd, $scope.configuration.periods[i].fromd);
                $scope.configuration.periods[i].tdIndex = $scope.configuration.periods[i].fdIndex + $scope.configuration.periods[i].totalDays;
            }
        });

        function calcDaysDiff(from, to) {
            return Math.ceil(Math.abs(new Date(from) - new Date(to)) / (1000 * 3600 * 24));
        }

        $scope.setPeriod = function (period) {
            $scope.selectedPeriod = period;
        }
    }])
    .directive('configBookGraph', function () {
        return {
            restrict: "EA",
            scope: {selectedPeriod: "="},
            controller: "configController",
            templateUrl: 'modules/mainComponents/config/configGraph.html'
        }
    });
