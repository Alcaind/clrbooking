'use strict';

angular.module('RoomBook', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules'
])
    .controller('BookController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, api) {
        $scope.rooms = [];
        $scope.periods = [];
        $scope.users = [];
        $scope.selectedPeriod = {};
        $scope.item = {fromd: "2018-01-01", tod: "2018-01-01"};

        $scope.openCalendar = function (item) {
            api.apiCall('POST', 'api/public/roombook/dates', function (result) {
                $scope.book = result.data;
                $scope.plotBook($scope.book, $scope.calendar);
                /* Plot the book data to the calendar array */
            }, undefined, item);
        };

        function init() {
            api.apiCall('GET', 'api/public/rooms', function (result) {
                $scope.rooms = result.data;
            });

            api.apiCall('GET', 'api/public/periods', function (result) {
                $scope.periods = result.data;
            });

            api.apiCall('GET', 'api/public/users', function (result) {
                $scope.users = result.data;
            });
        }

        /**
         * Plotting the given book at the given calendar array
         *
         * @param book is the array with the data
         * @param calendar is the calendar array for view
         *
         */
        $scope.plotBook = function (book, calendar) {
            var fromd = new Date($scope.item.fromd.getTime());
            var dateIndex = new Date($scope.item.fromd.getTime());
            var tod = new Date($scope.item.tod);
            var days = Math.ceil(Math.abs(tod.getTime() - fromd.getTime()) / (1000 * 3600 * 24));
            /* calculating the DIFF in days between fromd and tod */

            /*
            * plotting the data
            * days parsing (cerful i is from 0 to diff the true date if holded in the dateIndex var ;)*/
            for (var i = 0; i < days; i++) {
                calendar[i] = [];
                /* search the book */
                for (var j = 0; j < book.length; j++) {
                    /* get book dates */
                    var bDays = findBookDates(book[j]);
                    /* check if we have booking for this day and */
                    if (book[j].date_index === dateIndex.getDay() && bDays.fDay <= dateIndex && bDays.tDay >= dateIndex) {
                        /* show it at the correct hour !! */
                        //calendar[i][bDays.fDay.getHours()].push(book[j]);
                        calendar[i].push(book[j]);
                    }
                }
                /* go to the next calendar day ;) */
                dateIndex.setDate(dateIndex.getDate() + 1);
            }
        };

        function findBookDates(book) {
            book.fDay = new Date(book.fromd + 'T' + book.fromt);
            book.tDay = new Date(book.tod + 'T' + book.fromt);

            book.h = (new Date(book.fromd + 'T' + book.tot) - book.fDay) / (1000 * 60);
            book.dist = (book.fDay - new Date(book.fromd)) / (1000 * 60);

            return {
                fDay: new Date(book.fromd + 'T' + book.fromt), /* get book from day */
                tDay: new Date(book.tod + 'T' + book.fromt) /* get book to day */
            }
        }

        $scope.$watch('selectedPeriod', function (newVal, oldVal, scope) {
            if (!newVal.fromd) return;
            scope.item.fromd = new Date(newVal.fromd);
            scope.item.tod = new Date(newVal.tod);
        });

        init();
    }])
;
