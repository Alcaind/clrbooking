'use strict';

angular.module('MainComponents')

    .controller('CalendarContol', ['$scope', function ($scope) {
        $scope.calendarArray = [];
        $scope.calendar = [];
        $scope.weekdays = ['Δ', 'Τ', 'Τ', 'Π', 'Π', 'Σ', 'Κ'];
        $scope.days = [];
        $scope.hours = [];
        $scope.options = {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'};

        $scope.$watch('fromd', init);
        $scope.$watch('tod', init);
        $scope.$watch('dates_index', init);
        $scope.$watch('book', $scope.plotBook);
        

        function init() {
            //if (!$scope.fromd || !$scope.tod || !$scope.dates_index) return;
            /*$scope.calendarArray = [];
            $scope.days = [];*/
            for (var j = 7; j < 24; j++)
                $scope.hours[j - 7] = {ht: j + ":00", booked: false};

            /*var fromd = new Date($scope.fromd);
            var dateIndex = new Date($scope.fromd);
            var tod = new Date($scope.tod);
            var days = Math.abs(tod.getTime() - fromd.getTime());
            days = Math.ceil(days / (1000 * 3600 * 24));
            

            for (var j = 7; j < 24; j++)
                $scope.hours[j-7] = {ht: j + ":00", booked: false};

            for (var i = 0; i <= days; i++) {
                var tdt = dateIndex.getDate();
                if ($scope.dates_index && $scope.dates_index.indexOf(dateIndex.getDay()) >= 0) {
                    $scope.days.push(new Date(dateIndex));
                    $scope.calendarArray[i]=[];
                }
                dateIndex.setDate(tdt + 1);
            }*/
        }

        function findBookDates(book, ifItem) {
            if (!ifItem) {
                book.fDay = new Date(book.fromd + 'T' + book.fromt);
                book.tDay = new Date(book.tod + 'T' + book.fromt);
                book.h = (new Date(book.fromd + 'T' + book.tot) - book.fDay) / (1000 * 60) / 3;
                book.dist = (Math.abs(book.fDay - new Date(book.fromd)) / (1000 * 60) - 420) / 3;

                return {
                    fDay: new Date(book.fromd + 'T' + book.fromt), /* get book from day */
                    tDay: new Date(book.tod + 'T' + book.fromt) /* get book to day */
                }
            } else {
                book.fDay = new Date(book.fromd);
                book.tDay = new Date(book.tod);
                book.h = (book.tot - book.fromt) / (1000 * 60 * 3);
                book.dist = book.tot / (1000 * 60 * 3) - 420 / 3;

                return {
                    fDay: new Date(book.fromd), /* get book from day */
                    tDay: new Date(book.tod) /* get book to day */
                }
            }
        }

        $scope.plotBook = function (book, calendar) {
            if (!$scope.fromd || !$scope.tod || !$scope.dates_index || !book || !calendar) return;

            $scope.calendar = [];
            $scope.days = [];

            var fromd = new Date($scope.fromd.getTime());
            var dateIndex = new Date($scope.fromd.getTime());
            var tod = new Date($scope.tod);
            var days = Math.ceil(Math.abs(tod.getTime() - fromd.getTime()) / (1000 * 3600 * 24));
            for (var i = 0; i < days; i++) {
                var tdt = dateIndex.getDate();
                if ($scope.dates_index && $scope.dates_index.indexOf(dateIndex.getDay()) >= 0) {
                    $scope.days.push(new Date(dateIndex));
                    $scope.calendar.push([]);
                }

                if ($scope.date_index && $scope.fromd && $scope.tod && $scope.fromt && $scope.tot) {
                    $scope.color = '#856565';
                    bDays = findBookDates($scope.item, 1);
                    if ($scope.date_index.indexOf(dateIndex.getDay()) >= 0 && bDays.fDay <= dateIndex && bDays.tDay >= dateIndex) {
                        $scope.new = true;
                        calendar[i].push($scope.item);
                    }
                }

                for (var j = 0; j < book.length; j++) {
                    var bDays = findBookDates(book[j], 0);
                    if (book[j].date_index === dateIndex.getDay() && bDays.fDay <= dateIndex && bDays.tDay >= dateIndex) {
                        for (var r = 0; r < book[j].rooms.length; r++)
                            for (var k = 0; k < $scope.rooms.length; k++) {
                                book[j].color = 'antiquewhite';
                                if (book[j].rooms[r].id === $scope.rooms[k].id && $scope.rooms[k].checked) calendar[i].push(book[j]);
                            }
                    }
                }
                dateIndex.setDate(dateIndex.getDate() + 1);
            }
        };
        //init();
    }])
    .directive('calendarBook', function () {
        return {
            restrict: "EA",
            scope: {
                calendarArray: "=",
                fromd: "=",
                tod: "=",
                dates_index: "=",
                book: "<"
            },
            controller: "CalendarContol",
            templateUrl: 'modules/mainComponents/views/calendar.html'
        }
    })
;
