'use strict';

angular.module('Requests')
    .controller('CreateFormController', ['$scope', 'api', 'ClrStatusSrv', function ($scope, api, ClrStatusSrv) {
        $scope.item = {};
        $scope.views = [];
        $scope.currentPage = 0;
        $scope.book = [];
        $scope.rooms = [];
        $scope.selectedPeriod = {};
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

        $scope.init = function () {
            $scope.currentPage = 0;
            api.apiCall('GET', 'api/public/rooms', function (result) {
                $scope.rooms = result.data;
                for (var i = 0; i < result.data.length; i++) {
                    $scope.rooms[i].checked = false;
                }
            });
        };

        $scope.roomChecked = function (room) {
            room.checked = true;
            if (!room.fromt) {
                room.fromt = new Date().setTime(0);
                room.tot = new Date().setTime(0);
            }
        };
        $scope.roomUncheck = function (room) {
            room.checked = false;
            if (room.fromt) {
                room.fromt = null;
                room.tot = null;
            }
        };

        $scope.dayChecked = function (day) {
            $scope.item.date_index = "";
            day.s = !day.s;
            $scope.selectedDays.map(function (value) {
                if (value.s) {
                    $scope.item.date_index += value.i
                }
            })
        };

        $scope.nextPage = function () {
            if ($scope.currentPage === 0) {
                $scope.getBook($scope.item)
            }
            $scope.currentPage++;
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
;
