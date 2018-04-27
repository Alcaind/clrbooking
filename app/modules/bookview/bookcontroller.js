'use strict';

angular.module('RoomBook', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication',
    'GlobalVarsSrvs'
])
    .controller('BookController', ['$scope', 'api', 'ClrStatusSrv', 'globalVarsSrv', '$routeParams', function ($scope, api, ClrStatusSrv, globalVarsSrv, $routeParams) {
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

        $scope.dayChecked = function (day) {
            day.s = !day.s;
            $scope.item.date_index = "";
            $scope.selectedDays.map(function (value) {
                if (value.s) {
                    $scope.item.date_index += value.i
                }
            })
        };

        $scope.openCalendar = function () {
            if (i) {
                api.apiCall('GET', 'api/public/roombook/view/by/course', function (result) {
                    $scope.ps = result.data;
                    $scope.plotBook($scope.periods, $scope.ps);
                }, undefined);
            } else {
                api.apiCall('GET', 'api/public/roombook/view/by/room', function (result) {
                    $scope.room = result.data;
                    $scope.plotBook($scope.periods, $scope.room);
                }, undefined);
            }

        };

        $scope.init = function () {
            if (!$routeParams.id) {
                $scope.selectedPeriod = {};
                $scope.selectedRooms = [];
                $scope.selectedCourse = {};
                $scope.currentPage = 0;
                $scope.item = {rooms: [], date_index: "", guests: []};
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

                });
            }
        };

        $scope.steps = [
            {text: "Επιλογή Περιόδου", active: true},
            {text: "Επιλογή Μαθήματος", active: true},
            {text: "Επιλογή Αίθουσας", active: true},
            {text: "Ελεγχος Διαθεσιμότητας", active: true}
        ];

        api.apiCall('GET', 'api/public/rooms', function (result) {
            $scope.rooms = result.data;
        });
            api.apiCall('GET', 'api/public/periods', function (result) {
                $scope.periods = result.data;
            });
        // api.apiCall('GET', 'api/public/ps', function (result) {
        //     $scope.ps = result.data;
            // });
        api.apiCall('GET', 'api/public/users', function (result) {
            $scope.users = result.data;
        });
        api.apiCall('GET', 'api/public/tms/' + $scope.user.authdata.roles[0].tm.id + '/ps', function (result) {
            $scope.courses = result.data;
        });
        $scope.init();
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


