'use strict';

angular.module('RoomBook', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules'
])
    .controller('BookController', ['$scope', 'AuthenticationService', 'makeController', 'globalVarsSrv', 'api', function ($scope, AuthenticationService, makeController, globalVarsSrv, api) {
        $scope.periods = [];
        // $scope.calendar = [];
        $scope.headerTitle = [];
        //$scope.users = [];
        $scope.selectedPeriod = {};
        // $scope.item = {fromd: "2018-01-01", tod: "2018-01-01"};

        $scope.openCalendar = function () {
            api.apiCall('GET', 'api/public/roombook', function (result) {
                $scope.book = result.data;
                $scope.plotBook($scope.periods, $scope.book);
                /* Plot the book data to the calendar array */
            }, undefined);
        };

        function init() {
            // api.apiCall('GET', 'api/public/rooms', function (result) {
            //     $scope.rooms = result.data;
            // });
            api.apiCall('GET', 'api/public/periods', function (result) {
                $scope.periods = result.data;
            });
            // api.apiCall('GET', 'api/public/users', function (result) {
            //     $scope.users = result.data;
            // });
        }

        /**
         * Plotting the given book at the calendar array
         *
         * @param book is the array with the data
         * @param calendar is the calendar array for view
         *
         */
        $scope.plotBook = function (book, calendar) {
            var fromd = new Date($scope.periods.fromd.getTime());
            var dateIndex = new Date($scope.periods.fromd.getTime());
            var tod = new Date($scope.periods.tod.getTime());
            var days = Math.ceil(Math.abs(tod - fromd) / (1000 * 3600 * 24));
            $scope.calendar = [];

            /*
            * plotting the data
            * headerDays parsing (careful i is from 0 to diff the true date if holded in the dateIndex var ;)*/
            for (var i = 0; i < days; i++) {
                calendar[i] = [];
                /* search the book */
                for (var j = 0; j < book.length; j++) {
                    /* get book dates */
                    var bDays = findBookDates(book[j]);
                    book[j].tooltip = '';
                    for (var r = 0; r < book[j].rooms.length; r++) {
                        book[j].tooltip = " Αιθουσα " + book[j].rooms[r].name + ", "
                    }
                    book[j].tooltip += "\n" + book[j].fromt + "-" + book[j].tot;
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
            book.fDay = new Date(book.fromd + 'T' + $scope.book.fromt);
            book.tDay = new Date(book.tod + 'T' + $scope.book.fromt);
            book.h = (new Date(book.fromd + 'T' + $scope.book.tot) - book.fDay) / (1000 * 60) / 3;
            book.dist = (Math.abs(book.fDay - new Date(book.fromd + 'T00:00:00')) / (1000 * 60) - 420) / 3;
            return {
                fDay: new Date(book.fromd + 'T' + $scope.book.fromt),
                tDay: new Date(book.tod + 'T' + $scope.book.fromt)
            }
        }

        //
        // $scope.$watch('selectedPeriod', function (newVal, oldVal, scope) {
        //     if (!newVal.fromd) return;
        //     scope.periods.fromd = new Date(newVal.fromd);
        //     scope.periods.tod = new Date(newVal.tod);
        // });

        // init();
    }]);


