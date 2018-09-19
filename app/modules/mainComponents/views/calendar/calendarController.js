'use strict';

angular.module('MainComponents')

    .controller('CalendarContol', ['$scope', 'MakeModal', '$compile', 'orderByFilter', '$filter', 'api', '$location', function ($scope, MakeModal, $compile, orderBy, $filter, api, $location) {
        $scope.calendar = [];
        $scope.weekdays = ['Δ', 'Τρ', 'Τετ', 'Πεμ', 'Παρ', 'Σ', 'Κ'];
        $scope.errorWeekdays = ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο', 'Κυριακή'];
        $scope.headerDays = [];
        $scope.hours = [];
        $scope.options = {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'};
        $scope.showErrors = $scope.showErrors ? $scope.showErrors : false;
        $scope.programView = false;
        $scope.newCalendar = [];
        $scope.reqPerRoom = {};
        $scope.classUses = [];
        $scope.commentsVisible = false;
        $scope.$watch('book', plotBook);


        $scope.commentsVisibillity = function () {
            $scope.commentsVisible = !$scope.commentsVisible;
        };

        $scope.popup = function (item) {
            if (!item.new)
                var tt = MakeModal.infoBookRoom(item.pivot.id, function (res) {
                    res = JSON.parse(res);
                    if (res.type === 1) {
                        item.book.ps = res.data;
                        item.book.ps_id = res.data.id;
                    }
                    if (res.type === 3) $scope.mustRefresh = true;
                    if (res.type === 0) {
                        item.book.status = 1;
                        item.color = '#287ed2';
                        item.book.ps_id = res.data.id;
                        item.book.ps = res.data;
                    }
                });
        };


        $scope.selectDay = function (day) {
            $scope.selectedDay = day;
        };

        function init() {
            for (var j = 7; j < 24; j++)
                $scope.hours[j - 7] = {ht: j + ":00", booked: false, i: j};
        }

        function findBookDates(book) {
            //if (!book.fromd || !book.tod || !book.fromt || !book.tot) return null;
            if (!book.new) {
                book.fDay = new Date(book.fromd + 'T' + book.pivot.fromt);
                book.tDay = new Date(book.tod + 'T' + book.pivot.fromt);
                book.h = (new Date(book.fromd + 'T' + book.pivot.tot) - book.fDay) / (1000 * 60) / 3;
                book.dist = (Math.abs(book.fDay - new Date(book.fromd + 'T00:00:00')) / (1000 * 60) - 420) / 3;

                book.showTod = (new Date(book.tDay) - new Date(book.fDay) > 86400000);

                return {
                    fDay: new Date(book.fromd + 'T' + book.pivot.fromt), /* get book from day */
                    tDay: new Date(book.tod + 'T' + book.pivot.fromt) /* get book to day */
                }
            } else {
                book.fDay = new Date(book.fromd);
                book.tDay = new Date(book.tod);
                book.h = (book.tot - book.fromt) / (1000 * 60) / 3;

                var tmpDay = new Date(book.fromt);
                tmpDay.setHours(0, 0, 0, 0);
                book.dist = (Math.abs(book.fromt - tmpDay) / (1000 * 60) - 420) / 3;
                book.fromt = new Date(book.fromt - tmpDay);
                book.fromt.setHours(book.fromt.getHours() + book.fromt.getTimezoneOffset() / 60);
                book.tot = new Date(book.tot - tmpDay);
                book.tot.setHours(book.tot.getHours() + book.tot.getTimezoneOffset() / 60);

                book.showTod = (new Date(book.tDay) - new Date(book.fDay) > 86400000);
                //book.dist = ((book.fromt.getTime()) / (1000 * 60) - 420 + Math.abs(book.fromt.getTimezoneOffset())) / 3;
                return {
                    fDay: new Date(book.fromd), /* get book from day */
                    tDay: new Date(book.tod) /* get book to day */
                }
            }
        }

        function addConflict(book) {
            book.fromBookError.map(function (bookError) {
                var newEle = angular.element("<arrow-error from='" + book.did + "' to='" + bookError.did + "'></arrow-error>");
                //var el = $compile( "<arrow-error from='"+book.did+"' to='"+bookError.did+"'></arrow-error>" )( $scope );
                var el = $compile(newEle)($scope);
                //var newEle = angular.element("<div style='background-color: #575757; width: 2px; height: 15px'>"+bookError.did+"</div>");
                var target = document.getElementById('calendarPlot');
                angular.element(target).append(el);
            })
        }

        api.apiCall('GET', 'api/public/roomuse', function (results) {
            results.data.map(function (value) {
                $scope.classUses[value.id] = value;
            });
        });

        function dictionary(book, room) {
            if (!$scope.reqPerRoom[room.name]) $scope.reqPerRoom[room.name] = [];
            if (!$scope.reqPerRoom[room.name].includes(book)) $scope.reqPerRoom[room.name].push(book);
        }


        /**
         * Plotting requests (new & old)
         *
         * @param book have the requests data from the DB
         * @param calendar is the requests for plotting
         */
        function plotBook(book, calendar) {
            // check if all input data is ok
            //if (book.length === 0) {
            $scope.calendar = [];
            $scope.newCalendar = [];
            $scope.reqPerRoom = {};
            $scope.bookingErrors = [];
            $scope.headerDays = [];
            //$scope.datesIndex = '';
            //}
            if (!$scope.fromd || !$scope.tod || !$scope.datesIndex || !book || !calendar) return;
            // init variables
            $scope.calendar = []; // erase all existing data
            $scope.headerDays = [];     // holds the dates for the given inputs (fromd, tod, datesIndex)
            var fromd = new Date($scope.fromd.getTime()); // copy the fromd to a local variable
            var dateIndex = new Date($scope.fromd.getTime()); // copy the fromd to a local variable for parsing perpuses
            var tod = new Date($scope.tod); // copy the tod to a local variable
            var days = Math.ceil(Math.abs(tod.getTime() - fromd.getTime()) / (1000 * 3600 * 24)); // calculate & holds the distance in headerDays between fromd and tod
            var calendarIndex = null; // pointer in the calendar (creation proccess)
            var calObjects = []; // keeps only the new calendar requests per day (checking perpuse)


            for (var i = 0; i < days; i++) {  // loop parsing all holle days
                var newObject = {};  // temporary object to keep the new calendar requests

                // check if current dateIndex exists in gives dates
                if ($scope.datesIndex && $scope.datesIndex.indexOf(dateIndex.getDay()) >= 0) {

                    $scope.headerDays.push(new Date(dateIndex)); // push the current date in the headerDays array to show
                    calendarIndex = $scope.calendar.push([]); // create the holder for the requests for this day and keep the last pushed index into calendarIndex
                    $scope.item.new = true; // declare the input request as new (flag)
                    calObjects = []; // init table to hold new data for this day

                    for (var k = 0; k < $scope.rooms.length; k++) { // parse the rooms from the input request
                        if ($scope.rooms[k].date_index !== dateIndex.getDay()) continue; // Continue if dateIndex is different from room dateIndex
                        $scope.rooms[k].new = true; // flag the request room as new

                        newObject = Object.assign({}, $scope.rooms[k]);  // Copy the room data to newObject (keep clean the real data for the api call !!)
                        // init the dirty Object (newObject) with view & logic data perpuse
                        newObject.book = $scope.item;
                        newObject.color = '#75a575';
                        newObject.fromd = $scope.item.fromd;
                        newObject.tod = $scope.item.tod;
                        newObject.did = "r" + i + '' + k; // the div id for view binding
                        var bDays = findBookDates(newObject); // create the newObject data. calc height, distance and real dates from room input

                        if (bDays && bDays.fDay <= dateIndex && bDays.tDay >= dateIndex) { // check if the parsing date (dateIndsex) is between room dates (fDay, tDay)
                            $scope.calendar[calendarIndex - 1].push(newObject); // push it in the calendar array;

                            for (var m = 0; m < calObjects.length; m++) { // parse existing new rooms for this day to check for conflicts
                                if (((newObject.tot >= calObjects[m].fromt && newObject.tot <= calObjects[m].tot)
                                        || (newObject.fromt >= calObjects[m].fromt && newObject.fromt <= calObjects[m].tot)) && calObjects[m].id === newObject.id)
                                /*|| ((newObject.tot <= calObjects[m].tot && newObject.fromt >= calObjects[m].tot)
                                    || (newObject.fromt <= calObjects[m].fromt && newObject.tot >= calObjects[m].fromt))*/
                                {
                                    newObject.color = "#e4e123";  // if conflict flag new & old rooms with color
                                    calObjects[m].color = "#e4e153"
                                }
                            }
                            calObjects.push(newObject); // push it in the calObjects array (holds the new rooms data);
                        }
                    }

                    for (var j = 0; j < book.length; j++) {
                        //var bDays = findBookDates(book[j]);
                        book[j].showTod = (new Date(book[j].tod + ' 00:00:00') - new Date(book[j].fromd + ' 00:00:00') > 86400000);
                        if (($scope.item.id && book[j].id === $scope.item.id) || ([2, 4, 3].includes(book[j].status))) continue;
                        if (new Date(book[j].fromd + ' 00:00:00') <= dateIndex && new Date(book[j].tod + ' 00:00:00') >= dateIndex) { // check if the parsing date (dateIndsex) is between request dates (fDay, tDay)
                            //if ($scope.item.id && book[j].id === $scope.item.id) return;
                            for (var r = 0; r < book[j].rooms.length; r++) { // parse request rooms
                                if (book[j].rooms[r].pivot.date_index !== dateIndex.getDay()) continue; // Continue if dateIndex is different from room dateIndex
                                if ($scope.rooms.length === 0) plotTile(book[j].rooms[r], book[j], $scope.calendar[calendarIndex - 1], calObjects);
                                for (k = 0; k < $scope.rooms.length; k++) {  // parse selected (input) rooms
                                    if ($scope.rooms[k].date_index !== dateIndex.getDay()) continue; // Continue if dateIndex is different from room dateIndex)
                                    if (book[j].rooms[r].id === $scope.rooms[k].id) {  //requests room if equals with one of the selected rooms

                                        plotTile(book[j].rooms[r], book[j], $scope.calendar[calendarIndex - 1], calObjects);
                                    }
                                }
                            }
                        }
                    }
                    //$scope.calendar[calendarIndex - 1] = orderBy($scope.calendar[calendarIndex - 1], ['id', 'pivot.fromt']); //order already booked

                    if (!$scope.newCalendar[calendarIndex - 1]) $scope.newCalendar[calendarIndex - 1] = {};
                    $scope.calendar[calendarIndex - 1].map(function (book) {
                        if (!$scope.newCalendar[calendarIndex - 1][book.name]) {
                            $scope.newCalendar[calendarIndex - 1][book.name] = [];
                        }
                        $scope.newCalendar[calendarIndex - 1][book.name].push(book);
                        //$scope.newCalendar[calendarIndex - 1][book.name].ln = $scope.newCalendar[calendarIndex - 1][book.name].length;
                    });
                    //  $scope.calendar[calendarIndex - 1] = $scope.newCalendar[calendarIndex - 1];
                }
                dateIndex.setDate(dateIndex.getDate() + 1); // go to the next day
            }
            //  console.log($scope.newCalendar);
        }

        function plotTile(tile, book, cal, calObjects) {
            /*if($scope.calendarFilterObj.tm) {
                if (!(book.tm  && book.tm.descr === $scope.calendarFilterObj.tm)) return;
            }*/

            dictionary(book, tile);
            tile.fromd = book.fromd;  //dirty room takes dates -> transfer requests data to the room data
            tile.tod = book.tod;   //dirty room takes dates -> transfer requests data to the room data
            findBookDates(tile);   // create the room data. calc height, distance and real dates from room
            var bookObj = Object.assign({}, tile); // copy room data to temp Object (bookObj)
            bookObj.book = book;
            bookObj.fromBookError = []; // holds the conflict room objects (book room error table)
            bookObj.color = '#287ed2';
            var totCheck = new Date("1970-01-01T" + bookObj.pivot.tot); // create date datatype from strings (DB)
            var fromCheck = new Date("1970-01-01T" + bookObj.pivot.fromt);
            var ok = false; // flag check for conflict;
            for (var m = 0; m < calObjects.length; m++) {  // parse new req rooms for this day
                //calObjects[m].fromt = new Date("1970-01-01T" + calObjects[m].fromt.getMinutes() < 10 ? calObjects[m].fromt.getHours() + ':0' + calObjects[m].fromt.getMinutes() + ':00' : calObjects[m].fromt.getHours() + ':' + calObjects[m].fromt.getMinutes() + ':00');
                //calObjects[m].tot = new Date("1970-01-01T" + calObjects[m].tot.getMinutes() < 10 ? calObjects[m].tot.getHours() + ':0' + calObjects[m].tot.getMinutes() + ':00' : calObjects[m].tot.getHours() + ':' + calObjects[m].tot.getMinutes() + ':00');
                calObjects[m].fromt.setSeconds(0);
                calObjects[m].tot.setSeconds(0);
                fromCheck.setSeconds(30);
                if ((((totCheck > calObjects[m].fromt && totCheck < calObjects[m].tot)
                        || (fromCheck > calObjects[m].fromt && fromCheck < calObjects[m].tot)
                        || ((totCheck < calObjects[m].tot && fromCheck > calObjects[m].tot)
                            || (fromCheck < calObjects[m].fromt && totCheck > calObjects[m].fromt))) && calObjects[m].id === tile.id)) {

                    // check if we have date conflict and is the same room with existing room
                    ok = true; // raise the conflict flag
                    //bookObj.color = '#dd3030'; // flag the objects with color
                    bookObj.color = '#287ed2';
                    calObjects[m].color = '#e4aba8';
                    bookObj.fromBookError.push(calObjects[m]); // push the conflict new room in book room error table
                    bookObj.did = 'b' + m + calObjects[m].did;  // the div id for view binding
                    $scope.bookingErrors.push(bookObj); // push it in the global errors array
                    //addConflict(bookObj);
                } else {
                    if (ok) { // if conflict, flag with color
                        //TODO: wanna be check room uses levels old requests not new one(yellow)
                        //bookObj.color = '#dd3030'
                        bookObj.color = '#287ed2';
                    } else {
                        bookObj.color = book.status === 5 ? '#d29a46' : book.status === 0 ? '#DC4600' : '#287ed2';
                    }
                }
            }
            $scope.canceledRequestsFromHoliday = {};
            for (var n = 0; n < cal.length; n++) {
                cal[n].book.priorityFlag = false;
                if (cal[n].pivot)
                    if ((((totCheck > new Date("1970-01-01T" + cal[n].pivot.fromt) && totCheck < new Date("1970-01-01T" + cal[n].pivot.tot))
                            || (fromCheck > new Date("1970-01-01T" + cal[n].pivot.fromt) && fromCheck < new Date("1970-01-01T" + cal[n].pivot.tot))
                            || ((totCheck < new Date("1970-01-01T" + cal[n].pivot.tot) && fromCheck > new Date("1970-01-01T" + cal[n].pivot.tot))
                                || (fromCheck < new Date("1970-01-01T" + cal[n].pivot.fromt) && totCheck > new Date("1970-01-01T" + cal[n].pivot.fromt)))) && cal[n].id === bookObj.id)) {
                        if (cal[n].book.priority) {
                            if (bookObj.book.priority > cal[n].book.priority) {
                                cal[n].color = '#2bff05';

                                cal[n].pivot.push($scope.canceledRequestsFromHoliday);


                                //cal.splice(cal.indexOf(cal[n]), 1);
                                cal[n].book.priorityFlag = true;
                            }
                        }
                    }
            }
            cal.push(bookObj);
        }

        // function checkPriority() {
        //     if ($scope.calObjectsPriorities.book.priority > $scope.calPriorities.book.priority) {
        //
        //     }
        // }

        /* $scope.$watch('calendarFilterObj.tm', function (newVal) {
             plotBook($scope.book, $scope.calendar)
         });*/

        $scope.calendarFilterObj = {tm: null};
        $scope.filterBookByTm = function (item) {
            return (!$scope.calendarFilterObj.tm) || (item.book.tm && item.book.tm.descr === $scope.calendarFilterObj.tm) || item.new;
        };

        $scope.filterReportTm = function (item) {
            return (!$scope.calendarFilterObj.tm) || (item.tm && item.tm.descr === $scope.calendarFilterObj.tm);
        };

        if (!$scope.periods || $scope.periods.length === 0) api.apiCall('GET', 'api/public/periods', function (results) {
            $scope.periods = [];
            results.data.map(function (value) {
                $scope.periods[value.id] = value;
            })
        });

        $scope.expFile = function (psVSclass) {
            if (psVSclass === false) {
                makeTextFile(document.getElementById('report2').innerHTML);
            } else {
                makeTextFile(document.getElementById('report').innerHTML);
            }
        };

        function makeTextFile(text) {

            var textFile = window.open('', '_blank', 'location=yes,height=570,width=800,scrollbars=yes,status=1');
            textFile.document.write(text);
            textFile.document.close();

            return textFile;
        }

        init();
    }
    ])
    .directive('calendarBook', function () {
        return {
            restrict: "EA",
            scope: {
                fromd: "=",
                tod: "=",
                datesIndex: "=",
                book: "=",
                item: "<",
                rooms: "<",
                bookingErrors: "=",
                selectedDay: '=',
                showErrors: '<',
                mustRefresh: '=',
                tms: '=',
                comingFromBookController: '<',
                teachers: '=',
                periods: '='
            },
            controller: "CalendarContol",
            templateUrl: 'modules/mainComponents/views/calendar/calendar.html'
        }
    })
    .directive('arrowError', function () {
        return {
            restrict: "EA",
            scope: {
                from: "=",
                to: "="
            },
            //controller: "ArrErrController",
            templateUrl: 'modules/mainComponents/views/arrowError.html',
            link: function (scope, element, attrs) {

                var fromDom = angular.element(document.getElementById(attrs.from));
                var toDom = angular.element(document.getElementById(attrs.to));
                var fOffset = fromDom.position();
                var tOffset = toDom.position();
                var theta = Math.atan2(tOffset.top - fOffset.top, fOffset.left - tOffset.left);
                theta *= 180 / Math.PI;

                var elemCSS = {
                    "background-color": "red",
                    position: "absolute",
                    top: tOffset.top + 'px',
                    left: tOffset.left + 'px',
                    width: (fOffset.left - tOffset.left) + 'px',
                    transform: "rotate(" + theta + "deg)"
                };

                element.css(elemCSS);
                //element.rotate(fromDom.top - toDom.top);
            }
        }
    })
    .directive('reportsError', function () {
        return {
            restrict: "EA",
            templateUrl: 'modules/mainComponents/views/calendar/reportsError.html'
        }
    })
    .directive('reportErrors', function () {
        return {
            restrict: "EA",
            templateUrl: 'modules/mainComponents/views/calendar/reportErrors.html'
        }
    })
    .directive('reportCalendar', function () {
        return {
            restrict: "EA",
            templateUrl: 'modules/mainComponents/views/calendar/reportCalendar.html'
        }
    })
    .directive('reportCanceled', function () {
        return {
            restrict: "EA",
            templateUrl: 'modules/mainComponents/views/calendar/reportCanceled.html'
        }
    })
;
