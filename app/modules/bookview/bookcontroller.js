'use strict';

angular.module('RoomBook', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
])
    .controller('BookController', ['$scope', 'api', 'ClrStatusSrv', 'globalVarsSrv', '$routeParams', 'AuthenticationService', function ($scope, api, ClrStatusSrv, globalVarsSrv, $routeParams, AuthenticationService) {
        $scope.periods = [];
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
        $scope.steps = [
            {text: "Επιλογή Μαθήματος", active: true},
            {text: "Επιλογή Αίθουσας", active: true},
            {text: "Ελεγχος", active: true}
        ];
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
        $scope.mode = 'reporting';
        $scope.coursesDp = [];

        AuthenticationService.CheckCredentials();

        $scope.dayChecked = function (day) {
            day.s = !day.s;
            $scope.item.date_index = "";
            $scope.selectedDays.map(function (value) {
                if (value.s) {
                    $scope.item.date_index += value.i
                }
            })
        };

        $scope.openRoomCalendar = function () {
            $scope.rooms.map(function (room) {
                $scope.selectedDays.map(function (day) {
                    if (room.checked && day.s) {
                        var nRoom = Object.assign({}, room);
                        nRoom.date_index = day.i;
                        $scope.selectedRooms.push(nRoom);
                    }
                });
            });
            $scope.selectedRooms.map(function (value) {
                if (!$scope.item.rooms.includes(value.id)) $scope.item.rooms.push(value.id)
            });
            api.apiCall('POST', 'api/public/roombook/view/by/room', function (result) {
                $scope.book = result.data;
                $scope.item.active = true;
                $scope.gotoPage(2, $scope.item);
                //$scope.plotBook($scope.periods, $scope.room);
            }, undefined, $scope.item);
        };

        $scope.openCourseCalendar = function () {
            $scope.coursesDp.map(function (course) {
                if (course.selected) {
                    if (!$scope.item.ps.includes(course.id)) $scope.item.ps.push(course.id)
                }
            });
            $scope.item.date_index = '';
            $scope.selectedDays.map(function (day) {
                day.s = true;
                $scope.item.date_index += day.i + '';
            });
            api.apiCall('POST', 'api/public/roombook/view/by/course', function (result) {
                $scope.book = result.data;
                $scope.item.active = true;
                //$scope.plotBook($scope.periods, $scope.room);
                $scope.gotoPage(2, $scope.item);
            }, undefined, $scope.item);
        };

        $scope.reload = function () {
            location.reload();
        };
        $scope.init = function () {
            $scope.book = [];
            if (!$routeParams.id) {
                $scope.selectedPeriod = {};
                $scope.selectedRooms = [];
                $scope.selectedCourse = {};
                $scope.currentPage = 0;
                $scope.book = [];
                $scope.item = {rooms: [], date_index: "", guests: [], ps: []};
            } else {
                api.apiCall('GET', 'api/public/requests/' + $routeParams.id, function (result) {

                    $scope.item = result.data;
                    $scope.selectedPeriod = $scope.item.periods;

                    for (var sr = 0; sr < $scope.item.rooms.length; sr++) {
                        //$scope.roomChecked($scope.item.rooms[sr].pivot);

                        var roomObj = Object.assign({}, $scope.item.rooms[sr]);

                        $scope.item.rooms[sr].pivot.fromt = new Date('1970-01-01T' + $scope.item.rooms[sr].pivot.fromt);
                        $scope.item.rooms[sr].pivot.tot = new Date('1970-01-01T' + $scope.item.rooms[sr].pivot.tot);
                        roomObj = Object.assign(roomObj, $scope.item.rooms[sr].pivot);
                        $scope.selectedRooms.push(roomObj);
                        for (var r = 0; r < $scope.rooms.length; r++) {
                            if ($scope.item.rooms[sr].id === $scope.rooms[r].id) {
                                $scope.roomChecked($scope.rooms[r])
                            }
                        }
                        $scope.item.rooms[sr] = Object.assign($scope.item.rooms[sr], $scope.item.rooms[sr].pivot);
                    }

                    for (var c = 0; c < $scope.courses.ps.length; c++) {
                        if ($scope.courses.ps[c].id === $scope.item.ps.id) {
                            $scope.selectCourse($scope.courses.ps[c]);
                        }
                    }
                });
            }
        };

        $scope.roomChecked = function (room) {
            room.checked = !room.checked;
            if (room.checked) {
                //$scope.selectedRooms.push(room);
                if (!room.fromt) {
                    room.fromt = new Date('1970-01-01T07:58:00');
                    room.tot = new Date('1970-01-01T07:59:00');
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
        $scope.selectCourse = function (course) {
            //$scope.selectedCourse.selected = false;
            course.selected = !course.selected;
            //$scope.selectedCourse = course;
        };
        $scope.fromAnotherPage = true;

        $scope.selectAllCourse = function () {
            $scope.coursesDp.map(function (course) {
                course.selected = true;
            });
        };

        $scope.deselectAllCourse = function () {
            $scope.coursesDp.map(function (course) {
                course.selected = false;
            });
            $scope.item.ps = [];

        };

        $scope.selectAllRoom = function () {
            $scope.rooms.map(function (room) {
                room.checked = true;
            });
        };

        $scope.deselectAllRoom = function () {
            $scope.rooms.map(function (room) {
                room.checked = false;
            });
        };

        $scope.nextPage = function () {
            if ($scope.currentPage === 3) {
                $scope.copyDefaultRoom();
            }
            if ($scope.currentPage === 5) {
                $scope.getBook($scope.item)
            }
            $scope.currentPage++;
        };

        $scope.prevPage = function () {
            if ($scope.currentPage === 3) {
                $scope.copyDefaultRoom();
            }
            $scope.currentPage--;
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

        $scope.$watch('selectedPeriod', function (newVal, oldVal, scope) {
            if (!newVal || !newVal.fromd) return;
            scope.item.fromd = new Date(newVal.fromd);
            scope.item.tod = new Date(newVal.tod);
            scope.item.period = newVal.id;

        });

        api.apiCall('GET', 'api/public/rooms', function (result) {
            $scope.rooms = result.data;
            $scope.tileRooms = $scope.rooms;
        });
        api.apiCall('GET', 'api/public/periods', function (result) {
                $scope.periods = result.data;
            });
        api.apiCall('GET', 'api/public/users', function (result) {
            $scope.users = result.data;
        });
        $scope.tms = [];
        api.apiCall('POST', 'api/public/tms/ps', function (result) {

            result.data.map(function (tm) {
                $scope.tms.push({
                    id: tm.id,
                    per: tm.descr + " - " + tm.ku_per + " - " + tm.mp_per + " - " + tm.mku_per
                });
                tm.ps.map(function (ps) {
                    if (ps.conf_id === 1) $scope.courses.push(ps)
                });
            });
        }, undefined, $scope.user.authdata.roles[0].tm);

        $scope.init();

        $scope.defaultCourseSelection = null;
        $scope.courseFilterObj = {tm: null, km: null, ex: null, pm: null, gen: null};

        $scope.filterCourses = function (filteredArray, inputArray, courseFilterObj) {
            $scope.coursesDp = [];
            inputArray.map(function (course) {
                var exists = true;
                exists = (!courseFilterObj.tm || course.tm_code === courseFilterObj.tm) ? true : false;
                exists = ((!courseFilterObj.psex || courseFilterObj.psex.indexOf(course.ps_ex) >= 0) && exists) ? true : false;
                exists = ((!courseFilterObj.pskm || courseFilterObj.pskm.indexOf(course.ps_km) >= 0) && exists) ? true : false;
                exists = ((!courseFilterObj.pm || courseFilterObj.pm.indexOf(course.pm) >= 0) && exists) ? true : false;

                if (exists) $scope.coursesDp.push(course);
            });
        };
        //$scope.rootFilter ='';

    }])
    .directive('bookView', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/bookview/bookView.html'
        }
    })
    .directive('reqUserNavigation', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/bookview/reqUserNavigation.html'
        }
    })
    .directive('userHeader', function () {
        return {
            restrict: "EA",
            templateUrl: 'modules/bookview/userHeader.html'
        }
    })
;


