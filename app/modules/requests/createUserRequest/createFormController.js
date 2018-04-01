'use strict';

angular.module('Requests')
    .controller('CreateFormController', ['$scope', 'api', 'ClrStatusSrv', 'globalVarsSrv', function ($scope, api, ClrStatusSrv, globalVarsSrv) {

        $scope.item = {rooms: []};
        $scope.views = [];
        $scope.currentPage = 0;
        $scope.book = [];
        $scope.rooms = [];
        $scope.selectedPeriod = {};
        $scope.selectedRooms = [];
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
        $scope.user = globalVarsSrv.getGlobalVar('auth');
        $scope.courses = [];
        $scope.selectedCourse = {};
        $scope.selectedUse = {};
        $scope.steps = [
            {text: "Επιλογή Χρήσης", active: true},
            {text: "Επιλογή Περιόδου", active: true},
            {text: "Επιλογή Μαθήματος", active: true},
            {text: "Επιλογή Αίθουσας", active: true},
            {text: "Ορισμός Παρευρισκομένων", active: true},
        ];

        $scope.init = function () {
            $scope.currentPage = 0;
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

        $scope.selectCourse = function (course) {
            $scope.selectedCourse.selected = false
            course.selected = true;
            $scope.selectedCourse = course;
        };

        $scope.selectUse = function (use) {
            $scope.selectedUse.selected = false
            use.selected = true;
            $scope.selectedUse = use;
        };

        $scope.roomChecked = function (room) {
            room.checked = !room.checked;
            if (room.checked) {
                if (!room.fromt) {
                    room.fromt = new Date().setTime(0);
                    room.tot = new Date().setTime(0);
                }
                ;
                $scope.selectedRooms.push(room)
            } else {
                $scope.selectedRooms.slice($scope.selectedRooms.indexOf(room), 1)
            }
        };

        $scope.dayChecked = function (day) {
            day.s = !day.s;
            $scope.selectedDays.map(function (value) {
                if (value.s) {
                    $scope.item.date_index += value.i
                }
            })
        };

        $scope.roomDaySelect = function (room, day) {
            room.date_index = day;
        };

        $scope.nextPage = function () {
            if ($scope.currentPage === 4) {
                $scope.getBook($scope.item)
            }
            $scope.currentPage++;
        };

        $scope.prevPage = function () {
            $scope.currentPage--;
        };

        $scope.gotoPage = function (p) {
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
;

