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
        $scope.itemtype = [];
        $scope.allTeachers = [];
        $scope.psTeachers = [];
        $scope.bookingErrors = [];
        $scope.selectedPeriod = {};
        $scope.selectedRooms = [];
        $scope.personalTms = [];
        $scope.tms = [];
        $scope.filtertms = [];
        $scope.courses = [];
        $scope.selectedCourse = {};
        $scope.coursesDp = [];
        $scope.roomDP = [];
        $scope.selectedUse = {selected: false};
        $scope.calendarSelectedDay = null;
        $scope.fromAnotherPage = false;
        $scope.createFormControllerNotV = true;
        $scope.roomscategory = [];
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
        $scope.toRefresh = {};
        $scope.coursesDp = [];
        AuthenticationService.CheckCredentials();
        $scope.config = [];
        $scope.periodActive = true;

        api.apiCall('GET', 'api/public/config', function (result) {
            $scope.config = result.data;
        });


        $scope.simpleManager = true;
        for (var i = 0; i < $scope.user.authdata.roles[0].roles.length; i++) {
            if ($scope.user.authdata.roles[0].roles[i].id === 19) {
                $scope.simpleManager = false;
            }
        }

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
                //$scope.teachers = $scope.allTeachers;
                $scope.item = {
                    status: 0,
                    rooms: [],
                    date_index: "",
                    guests: [],
                    ps_id: null,
                    class_use: null,
                    tm_id: null
                };
            } else {
                api.apiCall('GET', 'api/public/requests/' + $routeParams.id, function (result) {

                    $scope.screenState = 'edit';
                    $scope.item = result.data;
                    $scope.item.active = true;
                    $scope.selectedPeriod = $scope.item.periods;
                    $scope.item.fromd = new Date($scope.item.fromd + ' 00:00:00');
                    $scope.item.tod = new Date($scope.item.tod + ' 00:00:00');
                    $scope.item.status = '14'.indexOf($scope.item.status) >= 0 ? 0 : $scope.item.status;
                    if (!$scope.item.guests) $scope.item.guests = [];

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
                                break;
                            }
                        }
                    $scope.coursesDp.push($scope.courses[c]);
                    if ($scope.item.guests) {
                        api.apiCall('GET', 'api/public/requests/' + $routeParams.id + '/guests', function (results) {
                            $scope.item.guests = results.data;
                        });
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
                // if (!$scope.selectedCourse.selected && '49'.indexOf($scope.selectedUse.id) >= 0) {
                //     MakeModal.generalInfoModal('sm', 'info', '', 'Παρακαλώ επιλέξτε μάθημα.', 1);
                //     return false;
                // }
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

        //$scope.personalRooms = $scope.user.authdata.roles[0].rooms;

        api.apiCall('GET', 'api/public/personal/' + $scope.user.authdata.roles[0].id + '/rooms', function (result) {
            $scope.personalRooms = result.data;
        });

        $scope.personalTms = $scope.user.authdata.roles[0].tm;
        if (globalVarsSrv.getGlobalVar('menuRole') === 'admin') {
            api.apiCall('GET', 'api/public/tms', function (results) {
                $scope.personalTms = results.data;
            });
        }

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
                        if (room.items[i].type_id === $scope.itemtype[j].id && $scope.itemtype[j].visible) typeCheckedCnt++
                    }
                    if (typeCheckedCnt === typeChecked) {
                        exists = true;
                    }
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

        api.apiCall('GET', 'api/public/itemtype', function (result) {
            $scope.itemsrooms = result.data;
            $scope.itemtype = result.data;
            $scope.itemtype.map(function (value) {
                value.title = value.descr;
            });
            api.apiCall('GET', 'api/public/rooms', function (result) {
                $scope.rooms = ($scope.personalRooms && $scope.personalRooms.length > 0) ? $scope.personalRooms : result.data;
                for (var i = 0; i < $scope.rooms.length; i++) {
                    $scope.rooms[i].checked = false;
                }

                $scope.tileRooms = $scope.rooms;
                $scope.filterRooms($scope.roomDP, $scope.tileRooms, $scope.roomsFilter);
                $scope.finishedLoaders++;
                checkState();
            });
        });

        // $scope.itemsrooms = [];
        // api.apiCall('GET', 'api/public/items', function (result) {
        //     $scope.itemsrooms=result.data;
        // });

        api.apiCall('GET', 'api/public/roomuse', function (result) {
            $scope.roomUse = result.data;
            $scope.finishedLoaders++;
            checkState();

            $scope.roomUse.map(function (use) {
                var cnt = 0;
                use.useVisibility = true;
                for (var i = 0; i < $scope.user.authdata.roles[0].roles.length; i++) {
                    if (use.synt === "Αργ") use.useVisibility = false;
                    // if ($scope.user.authdata.roles[0].roles[i].id !== 4 && use.synt === "Αργ") {
                    //     use.useVisibility = false;
                    // }
                    if ($scope.user.authdata.roles[0].roles[i].id === 19 && '4912'.indexOf(use.id) >= 0) {
                        use.useVisibility = false;
                    }
                }
            })
        });


        $scope.$watch('selectedConfig', function (newVal, oldvalue) {
            if (!newVal) return;
            $scope.getCourses(newVal);
        });

        $scope.getCourses = function (selectedConfig) {
            $scope.courses = [];
            $scope.tms = [];
            if (globalVarsSrv.getGlobalVar('menuRole') === 'admin') {

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
            } else {
                api.apiCall('POST', 'api/public/user/tms', function (res) {
                    $scope.tms = res.data;
                    $scope.tms.map(function (tm) {
                        api.apiCall('GET', 'api/public/ps/conf/' + $scope.selectedConfig, function (result) {
                            for (var i = 0; i < result.data.length; i++) {
                                if (result.data[i].tm_code === tm.id) {
                                    $scope.courses.push(result.data[i])
                                }
                            }
                        });
                    })
                }, undefined, $scope.user.authdata.roles[0].tm);
            }
            $scope.finishedLoaders++;
            checkState();
        };

        /*function psCallback(result) {
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
        }*/


        $scope.teachersPushed = [];
        api.apiCall('GET', 'api/public/users', function (results) {
            for (var i = 0; i < results.data.length; i++) {
                if (results.data[i].cat_id === 7) {
                    $scope.allTeachers[results.data[i].id] = results.data[i];
                    $scope.teachersPushed.push(results.data[i]);
                }
            }
            $scope.finishedLoaders++;
            $scope.teachers = $scope.teachersPushed;
            checkState();
        });


        $scope.newUserRequest = function () {
            if (!$routeParams.id) {
                globalVarsSrv.setGlobalVar('cur', true);
                $scope.selectedRooms = [];
                $scope.selectedCourse.selected = false;
                $scope.selectedCourse = {};
                $scope.book = [];
                for (var i = 0; i < $scope.rooms.length; i++) {
                    $scope.rooms[i].checked = false;
                }
            } else {
                $location.path('/usercreaterequests');
            }
        };

        $scope.postUserRequest = function (item) {
            //item.conf_id = 1;
            item.conf_id = $scope.selectedConfig;
            item.status = !item.status ? 0 : item.status;
            item.user_id = $scope.user.authdata.roles[0].id;
            item.req_dt = new Date();
            item.pivot = [];
            item.ps_id = $scope.selectedCourse.id && $scope.selectedCourse.selected ? $scope.selectedCourse.id : null;
            item.class_use = $scope.selectedUse.id;
            item.priority = $scope.selectedUse.priority;
            item.descr = item.descr ? item.descr : '';
            if (item.tm_id === null) {
                if (globalVarsSrv.getGlobalVar('menuRole') === 'admin') {
                    item.tm_id = $scope.user.authdata.roles[0].tm[0].id;
                } else
                    $scope.personalTms.map(function (value) {
                        if (value.default_tm_sel) {
                            item.tm_id = value.id;
                        }
                    });
            }
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

            var method = $routeParams.id ? 'PUT' : 'POST';

            if (item.fromd.toLocaleTimeString('en-GB') !== '00:00:00') {
                item.fromd.setHours(0, 0, 0, 0);
            }

            if (item.fromd.toLocaleTimeString('en-GB') === '00:00:00') {
                item.fromd = new Date(item.fromd.getTime() - item.fromd.getTimezoneOffset() * 1000 * 60);
                item.tod = new Date(item.tod.getTime() - item.tod.getTimezoneOffset() * 1000 * 60);
            }

            api.apiCall(method, 'api/public/requests/userrequest', function (result) {
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
                    for (var i = 0; i < $scope.selectedRooms.length; i++) {
                        $scope.selectedRooms[i].teacher = $scope.teachers[0].id;
                    }
                });

                $scope.item.tm_id = course.tm_code;
                $scope.item.ps_id = course.ps_id;
                $scope.item.ps = course;
            } else {
                $scope.item.tm_id = null;
                $scope.item.ps_id = null;
                $scope.item.ps = null;
                $scope.selectedCourse.selected = false;
                $scope.teachers = $scope.teachersPushed;
            }

        };

        $scope.selectUse = function (use) {
            use.useVisibility = true;
            $scope.selectedUse.selected = false;
            use.selected = true;
            $scope.selectedUse = use;
            $scope.item.class_use = use.id;
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
                req_id: "",
                name: "",
                uni: "",
                email: "",
                phone: "",
                comment: ""
            };
            $scope.item.guests.push(newGuest);
        };

        $scope.deleteGuest = function (guest) {
            api.apiCall('DELETE', 'api/public/requests/guests/' + guest.id, function (results) {
                $scope.item.guests.splice($scope.item.guests.indexOf(guest), 1);
            })
        };

        $scope.postGuest = function (item) {
            item.req_id = $scope.item.id;
            api.apiCall('POST', 'api/public/request/guest', function (result) {
                $scope.item.guests = result.data;
            }, undefined, item);
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

        $scope.mustRefresh = false;

        $scope.$watch('mustRefresh', function (newVal) {
            if (newVal) {
                $scope.mustRefresh = false;
                $scope.getBook($scope.item);
            }
        });

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
            if (globalVarsSrv.getGlobalVar('cur') === 'undefined') globalVarsSrv.setGlobalVar('cur', true);
            if ($scope.item && globalVarsSrv.getGlobalVar('cur') === false && $scope.checkBookIsClicked === true) {
                $scope.checkBookIsClicked = false;
            }

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

        $scope.$watch('item.fromd', function (newVal, oldvalue, scope) {
            if (!scope.item) return;
            if (!scope.item.fromd) return;
            var dayName = scope.item.fromd.getDay();
            if (!scope.selectedDays[dayName].s)
                scope.dayChecked(scope.selectedDays[dayName]);

            scope.item.tod = scope.item.tod ? scope.item.tod : new Date(scope.item.fromd.getTime() + 86400000);

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
            scope.item.tod = new Date(scope.item.tod.getTime() + 86400000);
            scope.item.period = newVal.id;

            $scope.selectedDays.map(function (value) {
                value.s = false;
                $scope.item.date_index = '';
            });

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
                exists = (course.selected) ? true : exists;
                if (exists) $scope.coursesDp.push(course);
            });
        };
//$scope.init();
    }
    ])
    .controller('RoomSelectController', ['$scope', 'api', 'MakeModal', function ($scope, api, MakeModal) {
        $scope.defaultRoomSelection = {fromt: null, tot: null, comment: null, teacher: null};
        $scope.filterObj = {tm: null, km: null, ex: null, pm: null, gen: null};
        $scope.itemsrooms = [];
        $scope.roomsFilter = {room: null, item: null, roomcat: null};


        $scope.removeSelectedRoom = function (room) {
            $scope.item.rooms.splice($scope.item.rooms.indexOf(room), 1);
            $scope.selectedRooms.splice($scope.selectedRooms.indexOf(room), 1);
        };

        $scope.roomItemsModal = function () {
            MakeModal.generalModal('modules/mainComponents/views/generalModal.html', 'sm', 'info', 'Επιλογή εξοπλισμού', $scope.itemtype, 2,
                function (results) {
                    $scope.itemtype = results;
                    $scope.filterRooms($scope.roomDP, $scope.rooms, results);
                });
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

            // if ($scope.teachers.length > 0 && $scope.selectedCourse.selected) {
            //     roomObj.teacher = $scope.teachers[0].id;
            // }
            $scope.selectedRooms.push(roomObj);
            $scope.item.rooms.push(roomObj);
        };
    }])
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
            // controller: 'RoomSelectController',
            templateUrl: 'modules/requests/createUserRequest/selectedRoomTile.html'
        }
    })
    .directive('defaultRoomTile', function () {
        return {
            restrict: 'EA',
            // controller: 'RoomSelectController',
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

