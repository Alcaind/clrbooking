'use strict';

angular.module('Requests')
    .controller('CreateFormController', ['$scope', 'api', 'ClrStatusSrv', 'globalVarsSrv', function ($scope, api, ClrStatusSrv, globalVarsSrv) {

        $scope.views = [];
        $scope.currentPage = 0;
        $scope.book = [];
        $scope.rooms = [];
        $scope.weekOptions = ClrStatusSrv.getStatus('weekdaysTableDateIndex');
        $scope.user = globalVarsSrv.getGlobalVar('auth');
        $scope.courses = [];
        $scope.teachers = [];
        $scope.bookingErrors = [];

        $scope.init = function () {
            $scope.item = {rooms: [], date_index: "", guests: []};
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
            $scope.selectedPeriod = {};
            $scope.selectedRooms = [];
            $scope.selectedCourse = {};
            $scope.selectedUse = {};
            $scope.currentPage = 0;
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

            api.apiCall('GET', 'api/public/tms/' + $scope.user.authdata.roles[0].tm_id + '/ps', function (result) {
                $scope.courses = result.data;
            });

        };

        api.apiCall('GET', 'api/public/users', function (results) {
            for (var i = 0; i < results.data.length; i++) {
                if (results.data[i].cat_id === 7) $scope.teachers.push(results.data[i]);
            }
        });

        $scope.postUserRequest = function (item) {
            item.conf_id = 1;
            item.status = 0;
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
                    fromt: new Date(value['fromt'].getTime() + Math.abs(value['fromt'].getTimezoneOffset() * 1000 * 60)),
                    teacher: value['teacher'],
                    tot: new Date(value['tot'].getTime() + Math.abs(value['tot'].getTimezoneOffset() * 1000 * 60))
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

        $scope.roomDaySelect = function (room, day) {
            var roomObj = Object.assign({}, room);
            roomObj.date_index = day.i;
            $scope.selectedRooms.push(roomObj);
            $scope.item.rooms.push(roomObj);
        };

        $scope.removeSelectedRoom = function (room) {
            $scope.selectedRooms.splice($scope.selectedRooms.indexOf(room), 1);
        };

        $scope.nextPage = function () {
            if ($scope.currentPage === 5) {
                $scope.getBook($scope.item)
            }
            $scope.currentPage++;
            if ($scope.currentPage === 4 && $scope.selectedUse.synt !== 'ΤΗΛ') $scope.currentPage++;
        };

        $scope.prevPage = function () {
            $scope.currentPage--;
            if ($scope.currentPage === 4 && $scope.selectedUse.synt !== 'ΤΗΛ') $scope.currentPage--;
        };

        $scope.gotoPage = function (p, item) {
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

