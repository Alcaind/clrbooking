'use strict';

angular.module('Requests')
    .controller('CreateFormController', ['$scope', 'api', 'ClrStatusSrv', 'globalVarsSrv', '$routeParams', function ($scope, api, ClrStatusSrv, globalVarsSrv, $routeParams) {

        $scope.tmpDate = new Date();
        $scope.views = [];
        $scope.currentPage = 0;
        $scope.book = [];
        $scope.rooms = [];
        $scope.weekOptions = ClrStatusSrv.getStatus('weekdaysTableDateIndex');
        $scope.user = globalVarsSrv.getGlobalVar('auth');
        $scope.courses = [];
        $scope.teachers = [];
        $scope.bookingErrors = [];
        $scope.selectedPeriod = {};
        $scope.selectedRooms = [];
        $scope.selectedCourse = {};
        $scope.selectedUse = {};
        $scope.calendarSelectedDay = null;
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
        $scope.mode = 'inserting';



        $scope.copyDayRequest = function (day) {
            var fd = day;
            var td = new Date(day);
            var td = new Date(td.setDate(td.getDate() + 1));

            api.apiCall('POST', 'api/public/roombook/dates', function (result) {
                var book = result.data;
                var toCopyRooms = [];
                book.map(function (request) {
                    request.rooms.map(function (room) {
                        if (room.pivot.date_index !== fd.getDay()) return;

                        var roomObj = Object.assign({}, room);

                        room.pivot.fromt = new Date('1970-01-01 ' + room.pivot.fromt + ' ');
                        room.pivot.tot = new Date('1970-01-01 ' + room.pivot.tot);
                        delete room.pivot.id;
                        delete room.pivot.req_id;

                        room.pivot.date_index = $scope.item.date_index * 1;
                        roomObj = Object.assign(roomObj, room.pivot);
                        $scope.selectedRooms.push(roomObj);
                        for (var r = 0; r < $scope.rooms.length; r++) {
                            if (room.id === $scope.rooms[r].id) {
                                $scope.roomChecked($scope.rooms[r])
                            }
                        }
                        room = Object.assign(room, room.pivot);
                    })
                });
                $scope.item.rooms = $scope.selectedRooms;
            }, undefined, {fromd: fd, tod: td});
        };

        $scope.init = function () {
            if (!$routeParams.id) {
                $scope.selectedPeriod = {};
                $scope.selectedRooms = [];
                $scope.selectedCourse = {};
                $scope.selectedUse = {};
                $scope.currentPage = 0;
                $scope.item = {rooms: [], date_index: "", guests: []};
            } else {
                api.apiCall('GET', 'api/public/requests/' + $routeParams.id, function (result) {

                    $scope.item = result.data;
                    $scope.item.active = true;
                    $scope.selectedPeriod = $scope.item.periods;

                    for (var sr = 0; sr < $scope.item.rooms.length; sr++) {
                        //$scope.roomChecked($scope.item.rooms[sr].pivot);

                        var roomObj = Object.assign({}, $scope.item.rooms[sr]);

                        $scope.item.rooms[sr].pivot.fromt = new Date('1970-01-01T' + $scope.item.rooms[sr].pivot.fromt);
                        $scope.item.rooms[sr].pivot.tot = new Date('1970-01-01T' + $scope.item.rooms[sr].pivot.tot);
                        delete $scope.item.rooms[sr].pivot.id;
                        roomObj = Object.assign(roomObj, $scope.item.rooms[sr].pivot);
                        $scope.selectedRooms.push(roomObj);
                        for (var r = 0; r < $scope.rooms.length; r++) {
                            if ($scope.item.rooms[sr].id === $scope.rooms[r].id) {
                                $scope.roomChecked($scope.rooms[r])
                            }
                        }
                        $scope.item.rooms[sr] = Object.assign($scope.item.rooms[sr], $scope.item.rooms[sr].pivot);
                    }

                    for (var u = 0; u < $scope.roomUse.length; u++) {
                        if ($scope.roomUse[u].id === $scope.item.room_use.id) {
                            $scope.selectUse($scope.roomUse[u]);
                        }
                    }

                    for (var c = 0; c < $scope.courses.length; c++) {
                        if ($scope.courses[c].id === $scope.item.ps.id) {
                            $scope.selectCourse($scope.courses[c]);
                        }
                    }

                    $scope.gotoPage(5, $scope.item);

                    for (var i = 0; i < $scope.item.rooms.length; i++) {
                        for (var j = 0; j < $scope.selectedDays.length; j++) {
                            if (j === $scope.item.rooms[i].pivot.date_index) {
                                $scope.selectedDays[j].s = true;
                                $scope.item.date_index += j + '';
                            }
                        }
                    }

                    $scope.getBook($scope.item);
                });
            }
        };

        $scope.steps = [
            {text: "Επιλογή Χρήσης", active: true},
            {text: "Επιλογή Περιόδου", active: true},
            {text: "Επιλογή Μαθήματος", active: true},
            {text: "Επιλογή Αίθουσας", active: true},
            {text: "Ορισμός Παρευρισκομένων", active: false},
            {text: "Ελεγχος Διαθεσιμότητας", active: true}
        ];

        api.apiCall('GET', 'api/public/rooms', function (result) {
            $scope.rooms = result.data;
            for (var i = 0; i < result.data.length; i++) {
                $scope.rooms[i].checked = false;
            }
        });

        api.apiCall('GET', 'api/public/roomuse', function (result) {
            $scope.roomUse = result.data;
        });

        api.apiCall('POST', 'api/public/tms/ps', function (result) {
            result.data.map(function (tm) {
                tm.ps.map(function (ps) {
                    $scope.courses.push(ps)
                });
            });
        }, undefined, $scope.user.authdata.roles[0].tm);

        api.apiCall('GET', 'api/public/users', function (results) {
            for (var i = 0; i < results.data.length; i++) {
                if (results.data[i].cat_id === 7) $scope.teachers.push(results.data[i]);
            }
        });

        $scope.postUserRequest = function (item) {
            item.conf_id = 1;
            item.status = !item.status ? 0 : item.status;
            item.user_id = $scope.user.authdata.roles[0].id;
            item.req_dt = new Date();
            item.pivot = [];
            item.ps_id = $scope.selectedCourse.id;
            item.class_use = $scope.selectedUse.id;
            item.descr = item.descr ? item.descr : '';
            item.period = item.period ? item.period : -1;
            item.rooms.map(function (value) {
                var newPivot = {
                    comment: value['comment'],
                    date_index: value['date_index'],
                    // fromt: new Date(value['fromt'].getTime() + Math.abs(value['fromt'].getTimezoneOffset() * 1000 * 60)),
                    fromt: value['fromt'].getMinutes() < 10 ? value['fromt'].getHours() + ':0' + value['fromt'].getMinutes() + ':00' : value['fromt'].getHours() + ':' + value['fromt'].getMinutes() + ':00',
                    teacher: value['teacher'],
                    // tot: new Date(value['tot'].getTime() + Math.abs(value['tot'].getTimezoneOffset() * 1000 * 60))
                    tot: value['tot'].getMinutes() < 10 ? value['tot'].getHours() + ':0' + value['tot'].getMinutes() + ':00' : value['tot'].getHours() + ':' + value['tot'].getMinutes() + ':00'
                };
                item.pivot.push(newPivot);
            });
            api.apiCall('POST', 'api/public/requests/userrequest', function (result) {
                alert('ok');
            }, undefined, item)
        };

        $scope.getTeacher = function (teacherId) {
            for (var i = 0; i < $scope.teachers.length; i++) {
                if ($scope.teachers[i].id === teacherId) return $scope.teachers[i].user;
            }
        };

        $scope.selectCourse = function (course) {
            $scope.selectedCourse.selected = false;
            course.selected = true;
            $scope.selectedCourse = course;
        };

        $scope.selectUse = function (use) {
            $scope.selectedUse.selected = false;
            use.selected = true;
            $scope.selectedUse = use;
            $scope.steps[4].active = false;
            if ($scope.selectedUse.synt === 'ΤΗΛ') $scope.steps[4].active = true;
        };

        $scope.newGuest = function () {
            var newGuest = {
                name: "",
                uni: "",
                email: "",
                phone: "",
                comment: ""
            };
            $scope.item.guests.push(newGuest);
        };

        $scope.deleteGuest = function (guest) {
            $scope.item.guests.splice($scope.item.guests.indexOf(guest), 1);
        };

        $scope.roomChecked = function (room) {
            room.checked = !room.checked;
            if (room.checked) {
                if (!room.fromt) {
                    room.fromt = new Date().setTime(0);
                    room.tot = new Date().setTime(0);
                }

            } else {
                for (var i = $scope.selectedRooms.length - 1; i >= 0; i--) {
                    if ($scope.selectedRooms[i].id === room.id) {
                        $scope.selectedRooms.splice(i, 1);
                    }
                }
                $scope.item.rooms = [];
            }
        };

        $scope.dayChecked = function (day) {
            day.s = !day.s;
            $scope.item.date_index = "";
            $scope.selectedDays.map(function (value) {
                if (value.s) {
                    $scope.item.date_index += value.i
                }
            })
        };

        $scope.nextPage = function () {
            if ($scope.currentPage === 3) {
                $scope.copyDefaultRoom();
            }
            if ($scope.currentPage === 5) {
                $scope.getBook($scope.item)
            }
            $scope.currentPage++;
            if ($scope.currentPage === 4 && $scope.selectedUse.synt !== 'ΤΗΛ') $scope.currentPage++;
        };

        $scope.prevPage = function () {
            if ($scope.currentPage === 3) {
                $scope.copyDefaultRoom();
            }
            $scope.currentPage--;
            if ($scope.currentPage === 4 && $scope.selectedUse.synt !== 'ΤΗΛ') $scope.currentPage--;
        };

        $scope.gotoPage = function (p, item) {
            if ($scope.currentPage === 3) {
                $scope.copyDefaultRoom();
            }
            if (item && !item.active) return;
            $scope.currentPage = p;
        };

        $scope.getBook = function (item) {
            api.apiCall('POST', 'api/public/roombook/dates', function (result) {
                $scope.book = result.data;
            }, undefined, item);
        };

        $scope.showMyBook = function () {
            $scope.getBook($scope.item)
        };
        $scope.$watch('selectedPeriod', function (newVal, oldVal, scope) {
            if (!newVal || !newVal.fromd) return;
            scope.item.fromd = new Date(newVal.fromd);
            scope.item.tod = new Date(newVal.tod);
            scope.item.period = newVal.id;

        });
        $scope.$watch('item', function (newVal, oldVal, scope) {
            if (!scope.item) return;
            if (scope.item.date_index && scope.item.fromd && scope.item.tod && scope.item.fromt && scope.item.tot) {
                scope.plotBook(scope.book, scope.calendar);
            }
        });

        $scope.init();
    }])
    .controller('RoomSelectController', function ($scope) {

        $scope.defaultRoomSelection = null;

        $scope.removeSelectedRoom = function (room) {
            $scope.selectedRooms.splice($scope.selectedRooms.indexOf(room), 1);
        };

        $scope.copyDefaultRoom = function () {
            if (!$scope.defaultRoomSelection) return;
            $scope.defaultRoomSelection.fromt = $scope.defaultRoomSelection.fromt !== 0 ? $scope.defaultRoomSelection.fromt : new Date('1970-01-01T07:58:00');
            $scope.defaultRoomSelection.tot = $scope.defaultRoomSelection.tot !== 0 ? $scope.defaultRoomSelection.tot : new Date('1970-01-01T07:59:00');

            $scope.selectedRooms.map(function (selectedRoom) {
                selectedRoom.fromt = selectedRoom.fromt === 0 ? $scope.defaultRoomSelection.fromt : selectedRoom.fromt;
                selectedRoom.tot = selectedRoom.tot === 0 ? $scope.defaultRoomSelection.tot : selectedRoom.tot;
                selectedRoom.comment = !selectedRoom.comment ? $scope.defaultRoomSelection.comment : selectedRoom.comment;
                selectedRoom.teacher = !selectedRoom.teacher ? $scope.defaultRoomSelection.teacher : selectedRoom.teacher;
            })
        };

        $scope.roomDaySelect = function (room, day) {
            if (!$scope.defaultRoomSelection) {
                $scope.defaultRoomSelection = Object.assign({}, room);
                $scope.defaultRoomSelection.date_index = day.i;
            }
            var roomObj = Object.assign({}, room);
            roomObj.date_index = day.i;
            $scope.selectedRooms.push(roomObj);
            $scope.item.rooms.push(roomObj);
        };
    })
    .directive('userRequestHeader', function () {
        return {
            restrict: "EA",
            templateUrl: 'modules/requests/createUserRequest/urHeader.html'
        }
    })
    .directive('courseSelect', function () {
        return {
            restrict: "EA",
            templateUrl: 'modules/requests/createUserRequest/courseSelect.html'
        }
    })
    .directive('roomSelect', function () {
        return {
            restrict: "EA",
            controller: 'RoomSelectController',
            templateUrl: 'modules/requests/createUserRequest/roomSelect.html'

        }
    })
    .directive('bookCheck', function () {
        return {
            restrict: "EA",
            templateUrl: 'modules/requests/createUserRequest/bookCheck.html'
        }
    })
    .directive('roomTile', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/requests/createUserRequest/roomTile.html'
        }
    })
    .directive('selectedRoomTile', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/requests/createUserRequest/selectedRoomTile.html'
        }
    })
    .directive('defaultRoomTile', function () {
        return {
            restrict: 'EA',
            scope: {room: '='},
            templateUrl: 'modules/requests/createUserRequest/defaultRoomTile.html'
        }
    })
    .directive('daySelect', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/requests/createUserRequest/daySelect.html'
        }
    })
    .directive('useSelect', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/requests/createUserRequest/useSelect.html'
        }
    })
    .directive('reqNavigation', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/requests/createUserRequest/reqNavigation.html'
        }
    })
    .directive('selectGuest', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/requests/createUserRequest/selectGuest.html'
        }
    })
;

