'use strict';

angular.module('RoomBook', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
])
    .controller('BookController', ['$scope', 'api', 'ClrStatusSrv', 'globalVarsSrv', '$routeParams', 'AuthenticationService', 'MakeModal', '$location', function ($scope, api, ClrStatusSrv, globalVarsSrv, $routeParams, AuthenticationService, MakeModal, $location) {
        $scope.periods = [];
        $scope.tmpDate = new Date();
        $scope.views = [];
        $scope.currentPage = 0;
        $scope.book = [];
        $scope.rooms = [];
        $scope.weekOptions = ClrStatusSrv.getStatus('weekdaysTableDateIndex');
        $scope.user = globalVarsSrv.getGlobalVar('auth');
        $scope.allTeachers = [];
        $scope.courses = [];
        $scope.teachers = [];
        $scope.bookingErrors = [];
        $scope.selectedPeriod = {};
        $scope.selectedRooms = [];
        $scope.selectedCourse = {};
        $scope.selectedUse = {};
        $scope.calendarSelectedDay = null;
        $scope.periodActive = false;
        $scope.steps = [
            {text: "Επιλογή Μαθήματος", active: true},
            {text: "Επιλογή Αίθουσας", active: true},
            {text: "Έλεγχος", active: true}
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
        $scope.roomDP = [];
        $scope.roomscategory = [];
        $scope.dayState = false;
        $scope.config = [];

        api.apiCall('GET', 'api/public/config', function (result) {
            $scope.config = result.data;
        });

        var cnt = 0;
        $scope.adminConfiguration = function () {
            for (var i = 0; i < $scope.user.authdata.roles[0].roles.length; i++) {
                if ($scope.user.authdata.roles[0].roles[i].id === 4) {
                    cnt++;
                    return false;
                }
            }
            if (cnt === 0) {
                return true;
            }
        };


        if ($scope.user) {
            AuthenticationService.CheckCredentials();

            for (var i = 0; i < $scope.user.authdata.roles[0].roles.length; i++) {
                if ($scope.user.authdata.roles[0].roles[i].id === 4) {
                    ClrStatusSrv.getStatus('homeButtonAdminTableConf');
                    break;
                } else {
                    ClrStatusSrv.getStatus('homeButtonUserTableConf');
                }
            }
        } else if (!$scope.user) {
            ClrStatusSrv.getStatus('publicUserTableConf');
        }


        $scope.selectAllDays = function () {
            $scope.item.date_index = '';
            $scope.dayState = !$scope.dayState;
            $scope.selectedDays.map(function (value) {
                value.s = $scope.dayState;
                $scope.item.date_index += value.i;
            });
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

        $scope.openRoomCalendar = function () {
            $scope.toRefresh = $scope.openRoomCalendar;
            $scope.book = [];
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
                if (value.checked) {
                    if (!$scope.item.rooms.includes(value.id)) $scope.item.rooms.push(value.id)
                }
            });

            if (!checkInput('r')) return;
            $scope.deselectAllCourse();
            api.apiCall('POST', 'api/public/roombook/view/by/room', function (result) {
                $scope.book = result.data;
                $scope.item.active = true;
                $scope.gotoPage(2, $scope.item);
                //$scope.plotBook($scope.periods, $scope.room);
            }, undefined, $scope.item);
        };

        function checkInput(type) {
            if (!$scope.item.fromd || $scope.item.fromd === '') {
                MakeModal.generalInfoModal('sm', 'Πληροφορία', '', 'Παρακαλώ συμπληρώστε ημερομηνίες.', 1);
                return false;
            }
            if (type === 'r') {
                if ($scope.item.date_index.length === 0) {
                    MakeModal.generalInfoModal('sm', 'Πληροφορία', '', 'Παρακαλώ επιλέξτε ημέρες.', 1);
                    return false;
                }
                if ($scope.selectedRooms.length === 0) {
                    MakeModal.generalInfoModal('sm', 'Πληροφορία', '', 'Παρακαλώ επιλέξτε αίθουσες.', 1);
                    return false;
                }
            }
            if (type === 'c') {
                if (!$scope.item.ps || $scope.item.ps.length === 0) {
                    MakeModal.generalInfoModal('sm', 'Πληροφορία', '', 'Παρακαλώ επιλέξτε μάθημα.', 1);
                    return false;
                }
            }
            return true
        }

        $scope.mustRefresh = false;
        $scope.toRefresh = {};
        $scope.$watch('mustRefresh', function (newVal) {
            if (newVal) {
                $scope.mustRefresh = false;
                $scope.toRefresh();
            }
        });

        $scope.openCourseCalendar = function () {
            $scope.toRefresh = $scope.openCourseCalendar;
            $scope.courses.map(function (course) {
                if (course.selected) {
                    if (!$scope.item.ps.includes(course.id)) $scope.item.ps.push(course.id)
                }
            });

            $scope.item.date_index = '';
            var daySelected = false;
            $scope.selectedDays.map(function (day) {
                if (day.s) {
                    daySelected = true;
                    $scope.item.date_index += day.i + '';
                }
            });

            if (!daySelected)
                $scope.selectedDays.map(function (day) {
                    day.s = true;
                    $scope.item.date_index += day.i + '';
                });

            if (!checkInput('c')) return;
            $scope.deselectAllRoom();
            api.apiCall('POST', 'api/public/roombook/view/by/course', function (result) {
                $scope.book = result.data;
                $scope.item.active = true;
                //$scope.plotBook($scope.periods, $scope.room);
                $scope.gotoPage(2, $scope.item);
            }, undefined, $scope.item);
        };

        $scope.reload = function () {
            location.reload();
            //$location.path('/roombook');
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
                $scope.selectedRooms.push(room);
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
        $scope.createFormControllerNotV = false;

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
            $scope.roomDP.map(function (room) {
                if (!$scope.room || $scope.room === '') {
                    room.checked = true;
                    return;
                }
                if (JSON.stringify(room).toLowerCase().indexOf($scope.room.toLowerCase()) >= 0)
                    room.checked = true;
            });
        };

        $scope.deselectAllRoom = function () {
            $scope.rooms.map(function (room) {
                room.checked = false;
            });
            $scope.selectedRooms = [];
            $scope.item.rooms = [];
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


        $scope.$watch('item.fromd', function (newVal, oldvalue, scope) {
            if (!scope.item) return;
            if (!scope.item.fromd) return;
            var dayName = scope.item.fromd.getDay();
            if (!scope.selectedDays[dayName].s)
                scope.dayChecked(scope.selectedDays[dayName]);
        });

        $scope.$watch('selectedPeriod', function (newVal, oldVal, scope) {
            if (!newVal || !newVal.fromd) return;
            scope.item.fromd = new Date(newVal.fromd);
            scope.item.tod = new Date(newVal.tod);
            scope.item.tod = new Date(scope.item.tod.getTime() + 86400000);
            scope.item.period = newVal.id;
            scope.dayState = true;
            scope.selectAllDays();
            if (!scope.item) return;
            if (!scope.item.fromd) return;
            var dayName = scope.item.fromd.getDay();
            if (!scope.selectedDays[dayName].s)
                scope.dayChecked(scope.selectedDays[dayName]);

            if (scope.item.tod && scope.item.fromd >= scope.item.tod) {
                scope.item.tod = new Date(scope.item.fromd.getTime() + 86400000);
            }
        });

        $scope.$watch('item.tod', function (newVal, oldvalue, scope) {
            if (!scope.item) return;
            if (!scope.item.tod) return;

            if (scope.item.fromd && scope.item.fromd >= scope.item.tod) {
                scope.item.tod = new Date(scope.item.fromd.getTime() + 86400000);
            }
        });

        api.apiCall('GET', 'api/public/active/rooms', function (result) {
            $scope.rooms = result.data;
            $scope.tileRooms = $scope.rooms;
            $scope.filterRooms($scope.roomDP, $scope.tileRooms, $scope.roomsFilter);
        });

        api.apiCall('GET', 'api/public/periods', function (result) {
            $scope.periods = result.data;
        });

        api.apiCall('GET', 'api/public/users', function (result) {
            result.data.map(function (value) {
                $scope.allTeachers[value.id] = value;
            });
        });

        $scope.$watch('selectedConfig', function (newVal, oldvalue) {
            if (!newVal) return;
            $scope.getCourses(newVal);
        });


        $scope.getCourses = function (selectedConfig) {
            $scope.courses = [];
            $scope.tms = [];

            api.apiCall('GET', 'api/public/ps/conf/' + $scope.selectedConfig, function (result) {
                $scope.courses = result.data;
            });
            api.apiCall('GET', 'api/public/tms', function (result) {
                var tmpTms = [];
                result.data.map(function (tm) {
                    if (tmpTms.indexOf(tm.descr) < 0) {
                        tmpTms.push(tm.descr)
                    }
                });
                $scope.tms = tmpTms;
            })
        };


        $scope.itemsrooms = [];
        $scope.itemtype = [];
        api.apiCall('GET', 'api/public/itemtype', function (result) {
            $scope.itemsrooms = result.data;
            $scope.itemtype = result.data;
            $scope.itemtype.map(function (value) {
                value.title = value.descr;
            })
        });

        $scope.init();

        $scope.defaultCourseSelection = null;
        $scope.courseFilterObj = {tm: null, km: null, ex: null, pm: null, gen: null, tma: null};

        $scope.filterCourses = function (filteredArray, inputArray, courseFilterObj) {
            $scope.coursesDp = [];
            inputArray.map(function (course) {
                var exists = true;
                exists = (!courseFilterObj.tm || course.tm_per == courseFilterObj.tm) ? true : false;
                exists = ((!courseFilterObj.psex || courseFilterObj.psex.indexOf(course.ps_ex) >= 0) && exists) ? true : false;
                exists = ((!courseFilterObj.pskm || courseFilterObj.pskm.indexOf(course.ps_km) >= 0) && exists) ? true : false;
                exists = ((!courseFilterObj.pm || courseFilterObj.pm.indexOf(course.pm) >= 0) && exists) ? true : false;
                exists = ((!courseFilterObj.tma || course.tma_code.indexOf(courseFilterObj.tma) >= 0) && exists) ? true : false;

                if (exists) $scope.coursesDp.push(course);
            });
        };

        $scope.roomsFilter = {room: null, item: null, roomcat: null};
        $scope.filterRooms = function (filteredArray, inputArray, roomsFilter) {
            while ($scope.roomDP.length > 0) $scope.roomDP.pop();
            var typeChecked = 0;
            for (var j = 0; j < $scope.itemtype.length; j++) {
                if ($scope.itemtype[j].visible) typeChecked++
            }
            inputArray.map(function (room) {
                var exists = false;
                var typeCheckedCnt = 0;
                for (var i = 0; i < room.items.length; i++) {
                    for (var j = 0; j < $scope.itemtype.length; j++) {
                        if (room.items[i].id === $scope.itemtype[j].id && $scope.itemtype[j].visible) typeCheckedCnt++
                    }
                    if (typeCheckedCnt === typeChecked) exists = true;
                }
                if (exists || !typeChecked) $scope.roomDP.push(room);
                // $scope.roomTile=$scope.roomDP
            });
        };

        api.apiCall('GET', 'api/public/roomcategory', function (result) {
            $scope.roomscategory = result.data;
            //$scope.filteringRooms($scope.roomDP, $scope.tileRooms, $scope.roomsFilter);
        });

        $scope.filteringRooms = function (filteredArray, inputArray, roomsFilter) {
            $scope.roomDP = [];
            while ($scope.roomDP.length > 0) $scope.roomDP.pop();
            inputArray.map(function (room) {
                var exists = true;
                exists = ((!roomsFilter.room || room.name.indexOf((roomsFilter.room).toUpperCase()) >= 0 || room.address.indexOf((roomsFilter.room).toUpperCase()) >= 0) && exists) ? true : false; //input
                exists = ((!roomsFilter.roomcat || room.capasity_categ === roomsFilter.roomcat) && exists) ? true : false; //select
                if (exists) $scope.roomDP.push(room);
            });
        };


        $scope.$watch('calendarSelectedDay', function (newVal) {
            if (newVal)
                $scope.copyDayRequest(newVal)
        });


        $scope.postCopyDay = function () {
            api.apiCall('POST', 'api/public/requests/copyday', function (results) {
            }, undefined, $scope.reqToPush);
        };


        $scope.reqToPush = [];


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


