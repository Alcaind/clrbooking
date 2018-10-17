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
        $scope.tmExists = false;
        $scope.weekOptions = globalVarsSrv.getGlobalVar('weekdaysTableDateIndex');

        $scope.cancel = function () {
            $uibModalInstance.close('cancel');
        };
        $scope.ok = function () {
            var retObj = {};
            if ($scope.flag === true && $scope.showddps === false && ($scope.requests.ps_id !== 'undefined' && $scope.requests.ps_id != null)) {
                // api.apiCall('PUT', 'api/public/requests/' + $scope.requests.id + '/' + $scope.requests.ps_id);
                // api.apiCall('PUT', 'api/public/requests/rooms/' + $scope.mainData.id, undefined, $scope.mainData);
                $scope.requests.status = $scope.requests.status ? 0 : $scope.requests.status;
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
                    retObj.type = 0;
                    retObj.data = $scope.currentPs;
                    $uibModalInstance.close(JSON.stringify(retObj));
                }, undefined, $scope.requests);
                $scope.flag = 0;
            } else {
                retObj.type = $scope.flag === 0 ? 1 : 2;
                retObj.data = $scope.flag === 0 ? $scope.currentPs : 'ok';
                $uibModalInstance.close(JSON.stringify(retObj));
            }

        };

        $scope.delete = function (item) {

            api.apiCall('DELETE', 'api/public/requests/' + item.id, function (result) {
                MakeModal.generalInfoModal('sm', 'info', '', 'Το αίτημά σας διαγράφηκε με επιτυχία.', 1);

                $uibModalInstance.close('{"type":3}');

            });
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
            if (!newVal.id) return;
            $scope.requests.ps_id = newVal.id;
            api.apiCall('GET', 'api/public/ps/' + newVal.id + '/users', function (results) {
                $scope.teachers = results.data;
            });

        });

        $scope.getPop = function () {
            baseURL = 'api/public';

            if ($location.url() === '/publicroombook') {
                baseURL = 'api/public';
                api.apiCall('GET', baseURL + "/publicroombook/" + $scope.reqID, function (results) {
                    $scope.mainData = results.data;
                    //$scope.requests = {status:$scope.mainData.status};
                    $scope.requests = {status: 0};

                    api.apiCall('GET', baseURL + '/requests/' + $scope.mainData.req_id, function (results) {
                        $scope.requests = results.data;
                    });
                });
            }

            var auth = globalVarsSrv.getGlobalVar('auth');
            $scope.requests = {};

            api.apiCall('GET', baseURL + "/roombook/" + $scope.reqID, function (results) {
                $scope.mainData = results.data;
                $scope.tmExists = false;
                auth.authdata.roles[0].tm.map(function (value) {
                    if (value.id === $scope.mainData.requests.tm_id) $scope.tmExists = true;
                });

                $scope.requests = {};
                api.apiCall('GET', baseURL + '/requests/' + $scope.mainData.req_id, function (results) {
                    $scope.requests = results.data;
                    $scope.requests.showTod = (new Date($scope.requests.tod) - new Date($scope.requests.fromd) > 86400000);
                    if ($scope.requests.status === 5 && $scope.tmExists) {
                        api.apiCall('GET', baseURL + '/ps/user/' + auth.authdata.roles[0].id + '/config/' + $scope.requests.conf_id, function (results) {
                            $scope.ps = results.data;
                        }, undefined, auth.authdata.roles[0].tm);
                        api.apiCall('GET', baseURL + '/teacher', function (results) {
                            $scope.teachers = results.data;
                        });

                        $scope.showddps = false;
                    }
                });
            });

            $scope.showddps = true;
        };

        $scope.auth = globalVarsSrv.getGlobalVar('auth');
        $scope.uAdmin = checkAdmin();

        function checkAdmin() {
            if ($scope.auth) {
                var cnt = 0;
                for (var i = 0; i < $scope.auth.authdata.roles[0].roles.length; i++) {
                    if ($scope.auth.authdata.roles[0].roles[i].id === 4) {
                        cnt++;
                        return true;
                    }
                }
                if (cnt !== 1) {
                    return false;
                }
            }
        }

        $scope.getPop();
    }])

    .directive('ngEnter', function ($document) {
        return {
            scope: {
                ngEnter: "&"
            },
            link: function (scope, element, attrs) {
                var enterWatcher = function (event) {
                    if (event.which === 13) {
                        scope.ngEnter();
                        scope.$apply();
                        console.log('ENTER');
                        event.preventDefault();
                        $document.unbind("keydown keypress", enterWatcher);
                    }
                };
                $document.bind("keydown keypress", enterWatcher);
            }
        }
    });