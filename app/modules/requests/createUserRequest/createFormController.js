'use strict';

angular.module('Requests')
    .controller('CreateFormController', ['$scope', 'api', 'ClrStatusSrv', function ($scope, api, ClrStatusSrv) {
        $scope.item = {};
        $scope.views = [];
        $scope.currentPage = 0;
        $scope.book = [];
        $scope.rooms = [];
        $scope.selectedPeriod = {};
        $scope.selectedDays = [
            {
                "d": "Κυριακή",
                "i": 0,
                "s": false
            },
            {
                "d": "Δευτέρα",
                "i": 1,
                "s": false
            },
            {
                "d": "Τρίτη",
                "i": 2,
                "s": false
            },
            {
                "d": "Τετάρτη",
                "i": 3,
                "s": false
            },
            {
                "d": "Πέμπτη",
                "i": 4,
                "s": false
            },
            {
                "d": "Παρασκευή",
                "i": 5,
                "s": false
            },
            {
                "d": "Σάββατο",
                "i": 6,
                "s": false
            }
        ];

        $scope.weekOptions = ClrStatusSrv.getStatus('weekdaysTableDateIndex');

        $scope.init = function () {
            $scope.currentPage = 0;
            api.apiCall('GET', 'api/public/rooms', function (result) {
                $scope.rooms = result.data;
                for (var i = 0; i < result.data.length; i++) {
                    $scope.rooms[i].checked = false;
                }
            });
        };

        $scope.roomChecked = function (room) {
            room.checked = !room.checked;
        };

        $scope.dayChecked = function (day) {
            $scope.item.date_index = "";
            day.s = !day.s;
            $scope.selectedDays.map(function (value) {
                if (value.s) {
                    $scope.item.date_index += value.i
                }
            })
        };

        $scope.nextPage = function () {
            if ($scope.currentPage === 0) {
                $scope.getBook($scope.item)
            }
            $scope.currentPage++;
        };

        $scope.getBook = function (item) {
            api.apiCall('POST', 'api/public/roombook/dates', function (result) {
                $scope.book = result.data;
            }, undefined, item);
        };

        /*$scope.plotBook = function (book, calendar) {
            var fromd = new Date($scope.item.fromd.getTime());
            var dateIndex = new Date($scope.item.fromd.getTime());
            var tod = new Date($scope.item.tod);
            var days = Math.ceil(Math.abs(tod.getTime() - fromd.getTime()) / (1000 * 3600 * 24));
            for (var i = 0; i < days; i++) {
                calendar[i] = [];

                if ($scope.item.date_index && $scope.item.fromd && $scope.item.tod && $scope.item.fromt && $scope.item.tot) {
                    $scope.item.color = '#856565';
                    bDays = findBookDates($scope.item, 1);
                    if ($scope.item.date_index.indexOf(dateIndex.getDay()) >= 0 && bDays.fDay <= dateIndex && bDays.tDay >= dateIndex) {
                        $scope.item.new = true;
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
        };*/

        $scope.showMyBook = function () {
            $scope.getBook($scope.item)
        };

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

        $scope.$watch('selectedPeriod', function (newVal, oldVal, scope) {
            if (!newVal.fromd) return;
            scope.item.fromd = new Date(newVal.fromd);
            scope.item.tod = new Date(newVal.tod);
        });
        $scope.$watch('item', function (newVal, oldVal, scope) {
            if (scope.item.date_index && scope.item.fromd && scope.item.tod && scope.item.fromt && scope.item.tot) {
                scope.plotBook(scope.book, scope.calendar);
            }
        });

        $scope.init();

    }])
;
