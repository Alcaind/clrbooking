angular.module('MainComponents')
    .directive('infoFormPopUp', function () {
        return {
            restrict: "EA",
            scope: {
                reqID: "="
            },
            templateUrl: 'modules/mainComponents/views/infoFormPopUp.html',
            controller: "infoFormPopUpController"
        }
    })

    .controller('infoFormPopUpController', ['$scope', 'globalVarsSrv', '$uibModalInstance', 'api', 'config', '$location', 'MakeModal', 'AuthenticationService', function ($scope, globalVarsSrv, $uibModalInstance, api, config, $location, MakeModal, AuthenticationService) {
        var baseURL = globalVarsSrv.getGlobalVar('appUrl');
        $scope.reqID = config.reqID;
        $scope.ps = [];
        $scope.toConfigReq = [];
        $scope.showddps = true;


        $scope.ok = function () {
            if ($scope.flag === true && $scope.showddps === false && ($scope.requests.ps_id !== 'undefined' && $scope.requests.ps_id != null) && ($scope.mainData.teacher !== 'undefined' && $scope.mainData.teacher != null)) {
                // api.apiCall('PUT', 'api/public/requests/' + $scope.requests.id + '/' + $scope.requests.ps_id);
                // api.apiCall('PUT', 'api/public/requests/rooms/' + $scope.mainData.id, undefined, $scope.mainData);
                $scope.requests.status = 0;
                $scope.requests.ps_id = $scope.currentPs.id;
                $scope.requests.pivot = [];
                for (var i = 0; i < $scope.requests.rooms.length; i++) {

                    $scope.requests.rooms[i].date_index = $scope.requests.rooms[i].pivot.date_index;
                    var newPivot = {
                        comment: $scope.requests.rooms[i].pivot.comment ? $scope.requests.rooms[i].pivot.comment : null,
                        date_index: $scope.requests.rooms[i].pivot.date_index,
                        // fromt: new Date(value['fromt'].getTime() + Math.abs(value['fromt'].getTimezoneOffset() * 1000 * 60)),
                        fromt: $scope.requests.rooms[i].pivot.fromt,
                        teacher: $scope.requests.rooms[i].pivot.teacher ? $scope.requests.rooms[i].pivot.teacher : null,
                        // tot: new Date(value['tot'].getTime() + Math.abs(value['tot'].getTimezoneOffset() * 1000 * 60))
                        tot: $scope.requests.rooms[i].pivot.tot
                    };
                    $scope.requests.pivot.push(newPivot);

                    if ($scope.requests.rooms[i].pivot.id === $scope.mainData.id) {
                        $scope.requests.rooms[i].teacher = $scope.mainData.teacher;
                        newPivot.teacher = $scope.mainData.teacher;
                    }
                }


                api.apiCall('PUT', 'api/public/requests/userrequest', function (result) {
                    MakeModal.generalInfoModal('sm', 'info', '', 'Το αίτημά σας καταχωρήθηκε με επιτυχία.', 1);
                }, undefined, $scope.requests);


                $scope.flag = false;
            }
            $uibModalInstance.close('ok');
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.mailTo = function (user) {
            window.open('mailto:' + user.em_main);
        };

        $scope.mailTm = function (requests) {
            // window.open('mailto:' + tm.supervisor.em_main);
            window.open('mailto:' + requests.users.em_main);
        };

        $scope.adminReq = function (id) {
            $location.path('/requests/' + id);
            $uibModalInstance.close();
        };

        $scope.currentPs = {};
        $scope.flag = false;
        $scope.$watch('currentPs', function (newVal) {
            $scope.flag = true;
            if (!newVal.id || !newVal.users) return;
            $scope.teachers = newVal.users;
            $scope.requests.ps_id = newVal.id;
        });

        $scope.getPop = function () {
            baseURL = 'api/public';

            if ($location.url() === '/publicroombook') {
                baseURL = 'api/public';
                api.apiCall('GET', baseURL + "/publicroombook/" + $scope.reqID, function (results) {
                    $scope.mainData = results.data;
                    $scope.requests = {};

                    api.apiCall('GET', baseURL + '/requests/' + $scope.mainData.req_id, function (results) {
                        $scope.requests = results.data;
                    });
                });
            }

            var auth = globalVarsSrv.getGlobalVar('auth');
            $scope.requests = {};
            api.apiCall('GET', baseURL + '/roombook/' + $scope.reqID, function (results) {
                $scope.requests = results.data;
                auth.authdata.roles[0].tm.map(function (value) {
                    if (value.id === $scope.requests.requests.tm_id) {
                        api.apiCall('GET', baseURL + "/roombook/" + $scope.reqID, function (results) {
                            $scope.mainData = results.data;
                            $scope.requests = {};
                            api.apiCall('GET', baseURL + '/requests/' + $scope.mainData.req_id, function (results) {
                                $scope.requests = results.data;
                                if ($scope.requests.status === 5) {
                                    api.apiCall('POST', baseURL + '/user/tms/ps', function (results) {
                                        $scope.ps = [];
                                        results.data.map(function (value2) {
                                            $scope.ps = value2.ps;
                                        });
                                    }, undefined, auth.authdata.roles[0].tm);
                                    api.apiCall('GET', baseURL + '/teacher', function (results) {
                                        $scope.teachers = results.data;
                                    });
                                    // api.apiCall('GET', baseURL + '/ps/' + $scope.ps.id + '/users', function (results) {
                                    //     $scope.teachers = results.data;
                                    // });
                                    $scope.showddps = false;
                                }
                            });
                        });
                    } else {
                        $scope.showddps = true;
                        api.apiCall('GET', baseURL + "/roombook/" + $scope.reqID, function (results) {
                            $scope.mainData = results.data;
                            $scope.requests = {};
                            api.apiCall('GET', baseURL + '/requests/' + $scope.mainData.req_id, function (results) {
                                $scope.requests = results.data;
                            });
                        });
                    }
                })
            });
            $scope.showddps = false;
        };

        $scope.uAdmin = function () {
            var auth = globalVarsSrv.getGlobalVar('auth');
            if (!auth && $location.path('/publicroombook')) {
                return true;
            }
            var cnt = 0;
            for (var i = 0; i < auth.authdata.roles[0].roles.length; i++) {
                if (auth.authdata.roles[0].roles[i].id === 4) {
                    cnt++;
                    return false;
                }
            }
            if (cnt === 0) {
                return true;
            }
        };
        $scope.getPop();
    }])
;
