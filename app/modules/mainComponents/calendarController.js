'use strict';

angular.module('MainComponents')

    .controller('CalendarContol', ['$scope', function ($scope) {
        $scope.calendarArray = [];
        $scope.weekdays = ['Δ', 'Τ', 'Τ', 'Π', 'Π', 'Σ', 'Κ'];
        $scope.days = [];
        $scope.hours = [];

        $scope.$watch('fromd', init);
        $scope.$watch('tod', init);

        function init() {
            if (!$scope.fromd || !$scope.tod) return;

            var fromd = new Date($scope.fromd);
            var dateIndex = new Date($scope.fromd);
            var tod = new Date($scope.tod);
            var days = Math.abs(tod.getTime() - fromd.getTime());
            days = Math.ceil(days / (1000 * 3600 * 24));
            $scope.calendarArray = [];

            for (var i = 0; i < days; i++) {
                $scope.calendarArray[i] = [];
                //$scope.days.push($scope.weekdays[(fromd.getDay() + i) % $scope.weekdays.length]);
                var tdt = dateIndex.getDate();
                dateIndex.setDate(tdt + 1);
                $scope.days.push(dateIndex.getDate());

                //$scope.days.push(dateIndex.setDate(dateIndex.getDate() + 1).getDate());
                //$scope.days.push(fromd+i);
                for (var j = 0; j < 24; j++) {
                    $scope.hours[j] = j;
                    //$scope.calendarArray[i][j] = Math.random() > .5 ? 0 : 1;
                    $scope.calendarArray[i][j] = 0;
                }
            }
        }

        init();
    }])
    .directive('calendarBook', function () {
        return {
            restrict: "EA",
            scope: {
                calendarArray: "=",
                fromd: "=",
                tod: "="
            },
            controller: "CalendarContol",
            templateUrl: 'modules/mainComponents/views/calendar.html'
        }
    })
;
