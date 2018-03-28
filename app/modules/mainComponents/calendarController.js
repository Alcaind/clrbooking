'use strict';

angular.module('MainComponents')

    .controller('CalendarContol', ['$scope', 'MakeModal', function ($scope, MakeModal) {
        $scope.calendar = [];
        $scope.weekdays = ['Δ', 'Τ', 'Τ', 'Π', 'Π', 'Σ', 'Κ'];
        $scope.days = [];
        $scope.hours = [];
        $scope.options = {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'};

        $scope.$watch('book', plotBook);

        $scope.popup = function (reqID) {
            MakeModal.infoBookRoom(reqID)
        };

        function init() {
            for (var j = 7; j < 24; j++)
                $scope.hours[j - 7] = {ht: j + ":00", booked: false, i: j};
        }

        function findBookDates(book) {
            if (!book.fromd || !book.tod || !book.fromt || !book.tot) return null;
            if (!book.new) {
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

        function plotBook(book, calendar) {
            if (!$scope.fromd || !$scope.tod || !$scope.datesIndex || !book || !calendar) return;

            $scope.calendar = [];
            $scope.days = [];

            var fromd = new Date($scope.fromd.getTime());
            var dateIndex = new Date($scope.fromd.getTime());
            var tod = new Date($scope.tod);
            var days = Math.ceil(Math.abs(tod.getTime() - fromd.getTime()) / (1000 * 3600 * 24));
            for (var i = 0; i < days; i++) {
                var tdt = dateIndex.getDate();
                var cal = null;
                if ($scope.datesIndex && $scope.datesIndex.indexOf(dateIndex.getDay()) >= 0) {
                    $scope.days.push(new Date(dateIndex));
                    cal = $scope.calendar.push([]);
                    var bDays = findBookDates($scope.item);
                    if (bDays && bDays.fDay <= dateIndex && bDays.tDay >= dateIndex) {
                        $scope.item.new = true;
                        var bDays = findBookDates($scope.item);
                        $scope.calendar[cal - 1].push($scope.item);
                    }
                }

                for (var j = 0; j < book.length; j++) {
                    var bDays = findBookDates(book[j]);
                    if (book[j].date_index === dateIndex.getDay() && bDays.fDay <= dateIndex && bDays.tDay >= dateIndex) {
                        for (var r = 0; r < book[j].rooms.length; r++)
                            for (var k = 0; k < $scope.rooms.length; k++) {
                                book[j].color = 'antiquewhite';
                                if (book[j].rooms[r].id === $scope.rooms[k].id && $scope.rooms[k].checked)
                                    $scope.calendar[cal - 1].push(book[j]);
                            }
                    }
                }
                dateIndex.setDate(dateIndex.getDate() + 1);
            }
        };
        init();
    }])
    .directive('calendarBook', function () {
        return {
            restrict: "EA",
            scope: {
                fromd: "=",
                tod: "=",
                datesIndex: "=",
                book: "=",
                item: "<",
                rooms: "<"
            },
            controller: "CalendarContol",
            templateUrl: 'modules/mainComponents/views/calendar.html'
        }
    })
;
