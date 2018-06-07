'use strict';

angular.module('Requests')
    .controller('CreateFormController', ['$scope', 'api', 'ClrStatusSrv', 'globalVarsSrv', '$routeParams', 'AuthenticationService', 'MakeModal', '$location', function ($scope, api, ClrStatusSrv, globalVarsSrv, $routeParams, AuthenticationService, MakeModal, $location) {
        $scope.tmpDate = new Date();
        $scope.views = [];
        $scope.currentPage = 0;
        $scope.book = [];
        $scope.rooms = [];
        $scope.weekOptions = globalVarsSrv.getGlobalVar('weekdaysTableDateIndex');
        $scope.user = globalVarsSrv.getGlobalVar('auth');
        $scope.teachers = [];
        $scope.allTeachers = [];
        $scope.psTeachers = [];
        $scope.bookingErrors = [];
        $scope.selectedPeriod = {};
        $scope.selectedRooms = [];
        $scope.tms = [];
        $scope.courses = [];
        $scope.selectedCourse = {};
        $scope.coursesDp = [];
        $scope.selectedUse = {selected: false};
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
        $scope.maxLoaders = 4;
        $scope.finishedLoaders = 0;
        $scope.screenState = 'normal';

        AuthenticationService.CheckCredentials();

        $scope.copyDayRequest = function (day) {
            var fd = day;
            var td = new Date(day);
            td = new Date(td.setDate(td.getDate() + 1));

            api.apiCall('POST', 'api/public/roombook/copyday', function (result) {
                // var book = result.data;
                // var toCopyRequests = [];
                // book.map(function (request) {
                //     $scope.selectedRooms =[];
                //     request.rooms.map(function (room) {
                //         if (room.pivot.date_index !== fd.getDay()) return;
                //
                //         var roomObj = Object.assign({}, room);
                //
                //         room.pivot.fromt = new Date('1970-01-01 ' + room.pivot.fromt + ' ');
                //         room.pivot.tot = new Date('1970-01-01 ' + room.pivot.tot);
                //         delete room.pivot.id;
                //         delete room.pivot.req_id;
                //
                //         room.pivot.date_index = $scope.item.date_index * 1;
                //         roomObj = Object.assign(roomObj, room.pivot);
                //         // roomObj.ps = request.ps;
                //         $scope.selectedRooms.push(roomObj);
                //         for (var r = 0; r < $scope.rooms.length; r++) {
                //             if (room.id === $scope.rooms[r].id) {
                //                 $scope.rooms[r].checked = true;
                //                 //$scope.roomChecked($scope.rooms[r])
                //             }
                //         }
                //         room = Object.assign(room, room.pivot);
                //     });
                //
                //     var tmpRequest =  Object.assign({},request);
                //     delete tmpRequest.id;
                //     delete tmpRequest.req_dt;
                //     delete tmpRequest.created_at;
                //     delete tmpRequest.updated_at;
                //     tmpRequest.status = 3;
                //     tmpRequest.conf_id = $scope.item.conf_id;
                //     tmpRequest.period = $scope.item.period;
                //     tmpRequest.rooms = $scope.selectedRooms;
                //
                //     $scope.selectedCourse = {};
                //     $scope.postUserRequest(tmpRequest);
                //     //toCopyRequests.push(tmpRequest);
                // });
                $scope.item.rooms = $scope.selectedRooms;
            }, undefined, {fromd: fd, tod: $scope.item.fromd});
        };

        $scope.reload = function () {
            globalVarsSrv.setGlobalVar('cur', true);
            location.reload();
            $location.path('/usercreaterequests');
        };

        $scope.init = function () {
            //$scope.book = [];
            if (!$routeParams.id) {
                $scope.selectedPeriod = {};
                $scope.selectedRooms = [];
                $scope.selectedCourse = {};
                $scope.selectedUse = {};
                $scope.currentPage = 0;
                $scope.item = {status: 0, rooms: [], date_index: "", guests: [], ps_id: null, class_use: null};
            } else {
                api.apiCall('GET', 'api/public/requests/' + $routeParams.id, function (result) {

                    $scope.screenState = 'edit';
                    $scope.item = result.data;
                    $scope.item.active = true;
                    $scope.selectedPeriod = $scope.item.periods;
                    $scope.item.fromd = new Date($scope.item.fromd + ' 00:00:00');
                    $scope.item.tod = new Date($scope.item.tod + ' 00:00:00');

                    for (var sr = 0; sr < $scope.item.rooms.length; sr++) {
                        //$scope.roomChecked($scope.item.rooms[sr].pivot);

                        //var roomObj = Object.assign({}, $scope.item.rooms[sr]);
                        var roomObj = $scope.item.rooms[sr];

                        $scope.item.rooms[sr].pivot.fromt = new Date('1970-01-01 ' + $scope.item.rooms[sr].pivot.fromt);
                        $scope.item.rooms[sr].pivot.tot = new Date('1970-01-01 ' + $scope.item.rooms[sr].pivot.tot);
                        delete $scope.item.rooms[sr].pivot.id;
                        roomObj = Object.assign(roomObj, $scope.item.rooms[sr].pivot);
                        $scope.selectedRooms.push(roomObj);
                        for (var r = 0; r < $scope.rooms.length; r++) {
                            if ($scope.item.rooms[sr].id === $scope.rooms[r].id) {
                                $scope.rooms[r].checked = true;
                                //$scope.roomChecked($scope.rooms[r])
                            }
                        }
                        $scope.item.rooms[sr] = Object.assign($scope.item.rooms[sr], $scope.item.rooms[sr].pivot);
                    }

                    for (var u = 0; u < $scope.roomUse.length; u++) {
                        if ($scope.roomUse[u].id === $scope.item.room_use.id) {
                            $scope.selectUse($scope.roomUse[u]);
                        }
                    }

                    if ($scope.item.ps)
                        for (var c = 0; c < $scope.courses.length; c++) {
                            if ($scope.courses[c].id === $scope.item.ps.id) {
                                $scope.selectCourse($scope.courses[c]);
                            }
                        }

                    //$scope.gotoPage(4, $scope.item);

                    $scope.item.date_index = '';
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
            {text: "Επιλογή Χρήσης / Περιόδου", active: true},
            {text: "Επιλογή Μαθήματος", active: true},
            {text: "Επιλογή Αίθουσας", active: true},
            {text: "Ορισμός Παρευρισκομένων", active: false},
            {text: "Ελεγχος Διαθεσιμότητας", active: true}
        ];

        function checkState() {
            if ($scope.maxLoaders === $scope.finishedLoaders) $scope.init();
        }

        function checkInput(type) {
            if (!$scope.item.fromd || $scope.item.fromd === '') {
                MakeModal.generalInfoModal('sm', 'info', '', 'Παρακαλώ συμπληρώστε ημερομηνίες.', 1);
                return false;
            }
            if (type === 'a') {
                if ($scope.item.date_index.length === 0) {
                    MakeModal.generalInfoModal('sm', 'info', '', 'Παρακαλώ επιλέξτε ημέρες.', 1);
                    return false;
                }
                if (!$scope.selectedUse.selected) {
                    MakeModal.generalInfoModal('sm', 'info', '', 'Παρακαλώ επιλέξτε χρήση αίθουσας.', 1);
                    return false;
                }
                if ($scope.coursesDp.length === 0 && '4912'.indexOf($scope.selectedUse.id) >= 0) {
                    MakeModal.generalInfoModal('sm', 'info', '', 'Παρακαλώ επιλέξτε μάθημα.', 1);
                    return false;
                }
                if ($scope.selectedRooms.length === 0) {
                    MakeModal.generalInfoModal('sm', 'info', '', 'Παρακαλώ επιλέξτε αίθουσες.', 1);
                    return false;
                }
            }
            if (type === 'r') {
                if ($scope.item.date_index.length === 0) {
                    MakeModal.generalInfoModal('sm', 'info', '', 'Παρακαλώ επιλέξτε ημέρες.', 1);
                    return false;
                }
                if ($scope.selectedRooms.length === 0) {
                    MakeModal.generalInfoModal('sm', 'info', '', 'Παρακαλώ επιλέξτε αίθουσες.', 1);
                    return false;
                }
            }
            return true;
        }

        api.apiCall('GET', 'api/public/rooms', function (result) {
            $scope.rooms = result.data;
            for (var i = 0; i < result.data.length; i++) {
                $scope.rooms[i].checked = false;
            }
            $scope.tileRooms = $scope.rooms;
            $scope.finishedLoaders++;
            checkState();

        });
        var auth = globalVarsSrv.getGlobalVar('auth');
        $scope.personalTms = auth.authdata.roles[0].tm;

        api.apiCall('GET', 'api/public/roomuse', function (result) {
            $scope.roomUse = result.data;
            $scope.finishedLoaders++;
            checkState();

            $scope.roomUse.map(function (use) {
                var cnt = 0;
                for (var i = 0; i < auth.authdata.roles[0].roles.length; i++) {
                    if (auth.authdata.roles[0].roles[i].id !== 4 && use.synt === "Αργ") {
                        use.useVisibility = true;
                        cnt++;
                    }
                }
                if (cnt === 1) {
                    use.useVisibility = false;
                }
            })
        });

        api.apiCall('POST', 'api/public/user/tms/ps', function (result) {

            result.data.map(function (tm) {
                if (!$scope.tms.includes({
                        id: tm.tm_code,
                        per: tm.descr
                    }))
                    $scope.tms.push({
                        id: tm.tm_code,
                        per: tm.descr
                    });
                tm.ps.map(function (ps) {
                    var tmpPs = Object.assign({}, tm);
                    tmpPs.tmID = tmpPs.id;
                    tmpPs = Object.assign(tmpPs, ps);
                    delete tmpPs.ps;
                    if (ps.conf_id === 1) $scope.courses.push(Object.assign(tmpPs))
                });
            });
            $scope.finishedLoaders++;
            checkState();
        }, undefined, $scope.user.authdata.roles[0].tm);

        api.apiCall('GET', 'api/public/users', function (results) {
            for (var i = 0; i < results.data.length; i++) {
                if (results.data[i].cat_id === 7) $scope.allTeachers.push(results.data[i]);
            }
            $scope.finishedLoaders++;
            checkState();
        });


        $scope.newUserRequest = function () {
            globalVarsSrv.setGlobalVar('cur', true);
            $scope.selectedRooms = [];
            $scope.selectedCourse.selected = false;
            $scope.selectedCourse = {};
            $scope.book = [];
            for (var i = 0; i < $scope.rooms.length; i++) {
                $scope.rooms[i].checked = false;
            }
        };

        $scope.postUserRequest = function (item) {
            item.conf_id = 1;
            item.status = !item.status ? 0 : item.status;
            item.user_id = $scope.user.authdata.roles[0].id;
            item.req_dt = new Date();
            item.pivot = [];
            item.ps_id = $scope.selectedCourse.id ? $scope.selectedCourse.id : null;
            item.class_use = $scope.selectedUse.id;
            item.descr = item.descr ? item.descr : '';
            item.period = item.period ? item.period : -1;
            item.rooms.map(function (value) {
                var newPivot = {
                    comment: value['comment'] ? value['comment'] : null,
                    date_index: value['date_index'],
                    // fromt: new Date(value['fromt'].getTime() + Math.abs(value['fromt'].getTimezoneOffset() * 1000 * 60)),
                    fromt: value['fromt'].getMinutes() < 10 ? value['fromt'].getHours() + ':0' + value['fromt'].getMinutes() + ':00' : value['fromt'].getHours() + ':' + value['fromt'].getMinutes() + ':00',
                    teacher: value['teacher'] ? value['teacher'] : null,
                    // tot: new Date(value['tot'].getTime() + Math.abs(value['tot'].getTimezoneOffset() * 1000 * 60))
                    tot: value['tot'].getMinutes() < 10 ? value['tot'].getHours() + ':0' + value['tot'].getMinutes() + ':00' : value['tot'].getHours() + ':' + value['tot'].getMinutes() + ':00'
                };
                item.pivot.push(newPivot);
            });

            api.apiCall($routeParams.id ? 'PUT' : 'POST', 'api/public/requests/userrequest', function (result) {
                // alert('Το αίτημά σας καταχωρήθηκε με επιτυχία.');
                MakeModal.generalInfoModal('sm', 'info', '', 'Το αίτημά σας καταχωρήθηκε με επιτυχία.', 1);
                //$scope.reload()
            }, undefined, item)
        };

        $scope.getTeacher = function (teacherId) {
            for (var i = 0; i < $scope.teachers.length; i++) {
                if ($scope.teachers[i].id === teacherId) return $scope.teachers[i].user;
            }
        };

        $scope.selectCourse = function (course) {
            if (!course.selected) {
                $scope.selectedCourse.selected = false;
                course.selected = true;
                $scope.selectedCourse = course;
                api.apiCall('GET', 'api/public/ps/' + $scope.selectedCourse.id + '/teacher', function (results) {
                    $scope.teachers = results.data.users;
                });
            } else {
                $scope.selectedCourse.selected = false;
                $scope.teachers = $scope.allTeachers;
            }

        };


        $scope.selectUse = function (use) {
            use.useVisibility = false;
            $scope.selectedUse.selected = false;
            use.selected = true;
            $scope.selectedUse = use;
            $scope.steps[3].active = false;
            if ($scope.selectedUse.synt === 'ΤΗΛ') $scope.steps[3].active = true;

            //TODO : uncomment to filter rooms
            /*$scope.tileRooms = [];
            $scope.rooms.map(function (tile) {
                tile.room_use.map(function (use) {
                    if (use.id === $scope.selectedUse.id) $scope.tileRooms.push(tile)
                });
            })*/
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
                        $scope.item.rooms.splice($scope.item.rooms.indexOf($scope.selectedRooms[i]), 1);
                        $scope.selectedRooms.splice(i, 1);
                    }
                }
                //$scope.item.rooms = [];
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

        $scope.getBook = function (item) {
            api.apiCall('POST', 'api/public/roombook/dates', function (result) {
                /*result.data.map(function (req) {
                    if (req.class_use === '12') {
                        req.tod = new Date(req.fromd);
                        req.tod.setDate(req.tod.getDate() + 1);
                    }
                });*/
                $scope.book = result.data;


            }, undefined, item);
        };
        $scope.checkBookIsClicked = false;
        $scope.showMyBook = function () {

            if (!checkInput('a')) return;
            $scope.checkBookIsClicked = true;

            $scope.book = [];
            $scope.getBook($scope.item);
        };

        if (globalVarsSrv.getGlobalVar('cur') === 'undefined') globalVarsSrv.setGlobalVar('cur', true);

        $scope.enablePost = function () {
            if (!$scope.item || !globalVarsSrv.getGlobalVar('cur') || !$scope.checkBookIsClicked) return false;
            return true;
        };

        var user = globalVarsSrv.getGlobalVar('auth');
        var cnt = 0;
        $scope.adminConfiguration = function () {
            for (var i = 0; i < user.authdata.roles[0].roles.length; i++) {
                if (user.authdata.roles[0].roles[i].id === 4) {
                    cnt++;
                    return false;
                }
            }
            if (cnt === 0) {
                return true;
            }
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
            if (scope.screenState === 'edit') {
                scope.screenState = 'normal';
                scope.item.period = newVal.id;
                return;
            }
            scope.item.fromd = new Date(newVal.fromd);
            scope.item.tod = new Date(newVal.tod);
            scope.item.period = newVal.id;

            if (!scope.item) return;
            if (!scope.item.fromd) return;
            var dayName = scope.item.fromd.getDay();
            if (!scope.selectedDays[dayName].s)
                scope.dayChecked(scope.selectedDays[dayName]);

        });
        /*$scope.$watch('item', function (newVal, oldVal, scope) {
            if (!scope.item) return;
            if (scope.item.date_index && scope.item.fromd && scope.item.tod && scope.item.fromt && scope.item.tot) {
                scope.plotBook(scope.book, scope.calendar);
            }
        });*/

        $scope.coursesDp = [];

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
                exists = ((!courseFilterObj.tma || course.tma_code.indexOf(courseFilterObj.tma) >= 0) && exists) ? true : false;

                if (exists) $scope.coursesDp.push(course);
            });
        };
//$scope.init();
    }])
    .controller('RoomSelectController', function ($scope) {
        $scope.defaultRoomSelection = {fromt: null, tot: null, comment: null, teacher: null};
        $scope.filterObj = {tm: null, km: null, ex: null, pm: null, gen: null};

        $scope.removeSelectedRoom = function (room) {
            $scope.item.rooms.splice($scope.item.rooms.indexOf(room), 1);
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

