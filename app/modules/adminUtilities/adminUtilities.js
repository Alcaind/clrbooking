'use strict';

angular.module('Requests')
    .controller('UtilitiesController', ['$scope', 'api', 'ClrStatusSrv', 'globalVarsSrv', '$routeParams', 'AuthenticationService', 'MakeModal', '$location', function ($scope, api, ClrStatusSrv, globalVarsSrv, $routeParams, AuthenticationService, MakeModal, $location) {
        $scope.selections = {"from": "1", "to": "1"};
        $scope.periodSelections = {"from": {}, "to": {}, "s": false};
        AuthenticationService.CheckCredentials();


        $scope.yearByYearSelect = function (selectedPeriod) {
            var selYear = "";
            for (var i = 0; i < $scope.futureConfigs.length; i++) {
                if ($scope.futureConfigs[i].id == selectedPeriod) {
                    selYear = $scope.futureConfigs[i].year
                }
            }
            for (i = 0; i < $scope.futureConfigs.length; i++) {
                if ($scope.futureConfigs[i].year == selYear + 1) {
                    return $scope.futureConfigs[i].id
                }
            }
        };
        $scope.periodActive = false;
        $scope.copyperiod = [];
        $scope.pendings = [];
        $scope.statusOptions = globalVarsSrv.getGlobalVar('requestStatus');
        $scope.showExpired = true;
        $scope.pastConfigs = [];
        $scope.futureConfigs = [];
        $scope.selections.to = $scope.yearByYearSelect($scope.selections.from);


        api.apiCall('GET', 'api/public/config', function (res) {
            $scope.pastConfigs = res.data;
            $scope.futureConfigs = res.data;
        });

        $scope.$watch('selections.from', function (newVal, oldVal) {
            $scope.showMeError = false;
            $scope.periodSelections.s = false;
            $scope.selections.to = $scope.yearByYearSelect(newVal);
        });

        if ($location.$$url == '/utilities') {
            $scope.utilities = true;
        } else if ($location.$$url == '/checkpending') {
            $scope.utilities = false;
        }
        // else if ($location.$$url == '/emailutilities') {
        //     $scope.utilities = true;
        // }

        $scope.copyAllPeriod = function (pp, fp) {
            var $ppd = new Date(pp.fromd).getTime();
            var $fpd = new Date(fp.fromd).getTime();
            var newperiodfromd = fp.fromd;
            var newperiodtod = fp.tod;

            if (pp.synt === fp.synt && pp.id !== fp.id && $ppd < $fpd) {
                api.apiCall('POST', 'api/public/roombook/copyperiod', function (result) {
                    $scope.copyperiod = result.data;
                    MakeModal.generalInfoModal('sm', 'Info', 'info', 'Eπιτυχής Αντιγραφή', 1)
                }, undefined, {fromP: pp, toP: fp});
            } else {
                MakeModal.generalInfoModal('sm', 'Info', 'info', 'Ανεπιτυχής αντιγραφή (Η επιλογή των εξαμήνων είναι λάθος)', 1)
            }
        };

        $scope.filterExpired = function (item) {
            return $scope.showExpired ? item.if_expired === "+" ? true : false : true;
        };

        // var today = new Date();
        $scope.getExpiredRequests = function () {

            api.apiCall('GET', 'api/public/config/1', function (result) {
                $scope.selectconfig = result.data;

                api.apiCall('POST', 'api/public/checkpending', function (results) {
                    $scope.pendings = results.data;
                }, undefined, {config: $scope.selectconfig})
            });
        };

        $scope.deleteExpiredRequest = function (item) {
            api.apiCall('DELETE', 'api/public/requests/' + item.id, function (res) {
                $scope.pendings.splice($scope.pendings.indexOf(item), 1);
            })
        };

        $scope.deleteAllExpiredRequests = function () {
            api.apiCall('PUT', 'api/public/checkpending/expired', function (res) {
                // alert('all done');
            }, undefined, {config: $scope.selectconfig})
        };

        $scope.selectedPeriod = [];
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
        $scope.fromd = '';
        $scope.tod = '';
        $scope.fromAnotherPage = true;
        var user = globalVarsSrv.getGlobalVar('auth');
        $scope.item = {};
        $scope.holReq = {};


        // $scope.$watch('selectedPeriod', function (newVal) {
        //     if($scope.selectedPeriod && $location.$$url == '/holidayhold' ){
        //         $scope.setPeriod();
        //     }
        // });

        // if ($scope.selectedPeriod) {
        $scope.fromd = $scope.selectedPeriod.fromd;
        $scope.tod = $scope.selectedPeriod.tod;
        // }
        $scope.selectedUse = {};
        api.apiCall('GET', 'api/public/roomuse/' + 13, function (result) {
            $scope.selectedUse = result.data;
        });

        $scope.setHoliday = function (item) {

            item.fromd = $scope.selectedPeriod.fromd;
            item.tod = $scope.selectedPeriod.tod;
            item.user_id = user.authdata.roles[0].id;
            item.descr = $scope.selectedUse.descr;
            item.period = $scope.selectedPeriod.id;
            item.ps_id = null;
            item.class_use = $scope.selectedUse.id;
            item.links = null;
            item.protocol_id = null;
            item.status = 1;
            item.admin = user.authdata.roles[0].id;
            item.conf_id = $scope.selectedPeriod.conf_id;
            item.tm_id = user.authdata.roles[0].tm[0].id;
            item.priority = $scope.selectedUse.priority;
            item.pivot = [];
            api.apiCall('GET', 'api/public/rooms', function (resRooms) {
                resRooms.data.map(function (value) {
                    var newPivot = {
                        room_id: value['id'],
                        comment: 'Αργία',
                        date_index: '0',
                        fromt: '08:00:00',
                        teacher: null,
                        tot: '23:59:59',
                        status: '1'
                    };
                    item.pivot.push(newPivot);
                });
                api.apiCall('POST', 'api/public/holiday', function (res) {
                    $scope.holReq = res.data;
                }, undefined, item)
            })
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

        $scope.selectAllDays = function () {
            $scope.item.date_index = "";
            $scope.dayState = !$scope.dayState;
            $scope.selectedDays.map(function (value) {
                value.s = $scope.dayState;
                $scope.item.date_index += value.i;
            });
        };

        $scope.setPeriod = function (period) {
            if ($scope.periodsActive === true) {
                if (period.status !== 0) {
                    $scope.selectedPeriod.s = false;
                    period.s = true;
                    $scope.selectedPeriod = period;
                }
            } else {
                $scope.selectedPeriod.s = false;
                period.s = true;
                $scope.selectedPeriod = period;
            }

        };

    }]);