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
            $scope.calendarArray = [];
            $scope.days = [];

            var fromd = new Date($scope.fromd);
            var dateIndex = new Date($scope.fromd);
            var tod = new Date($scope.tod);
            var days = Math.abs(tod.getTime() - fromd.getTime());
            days = Math.ceil(days / (1000 * 3600 * 24));

            var options = {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'};

            for (var j = 0; j < 24; j++) {
                $scope.hours[j] = j;
            }

            for (var i = 0; i <= days; i++) {
                $scope.calendarArray[i] = [];
                var tdt = dateIndex.getDate();
                //$scope.days.push(dateIndex.toDateString());
                $scope.days.push(dateIndex.toLocaleDateString('gr-GR', options));
                $scope.calendarArray[i] = [];
                dateIndex.setDate(tdt + 1);
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
