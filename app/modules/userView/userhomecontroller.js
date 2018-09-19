'use strict';

angular.module('Users')
    .controller('UserViewTableController', ['$scope', '$location', 'api', '$uibModal', 'MakeModal', '$translate', function ($scope, $location, api, $uibModal, MakeModal, $translate) {
        // $scope.baseURL = 'api/public/view';
        //$scope.search = {status: $scope.status};

        $scope.weekdays = ['Δ', 'Τρ', 'Τετ', 'Πεμ', 'Παρ', 'Σ', 'Κ'];

        $scope.selectRow = function (item) {
            // if (item.status === 1) return;

            if (item.status === 3) {
                $location.url('/usercreaterequests/' + item.id);
                return;
            }
            if (item.status === 1) {
                MakeModal.generalInfoModal('sm', 'info', 'Επιβεβαίωση', $translate.instant('Το αίτημα σας για το τμήμα:') + ' ' + item.tm.descr + ' ' + $translate.instant('είναι καταχωρημένο επιτυχώς '), 1);

            }
            if (item.status !== 1) {
                var $myModalInstance = $uibModal.open({
                    templateUrl: 'modules/userView/userHome/popInfoPendingRequest.html',
                    controller: 'popupUserReq',
                    size: 'lg',
                    resolve: {
                        config: function () {
                            return {rrID: item.id}
                        }
                    }
                });
            }

            //$myModalInstance.result.then(okCallback, cancelCallback);
        };

        $scope.deleteDashReq = function (item, $event) {
            api.apiCall('DELETE', 'api/public/requests/' + item.id, function (results) {
                $scope.dp.splice($scope.dp.indexOf(item), 1);
                MakeModal.generalInfoModal('sm', 'Info', 'info', 'Eπιτυχής διαγραφή', 1)
            });
            $event.stopPropagation();
        };


        $scope.editDashReq = function (item, $event) {
            $location.url('/usercreaterequests/' + item.id);
            $event.stopPropagation();

        };

        $scope.editGuestThl = function (item) {
            MakeModal.guestModal('modules/requests/createUserRequest/selectGuest.html', 'lg', 'info', $translate.instant('Παρευρισκόμενοι'), item, 1);
        }

        //
        // $scope.showStatus = function () {
        //     if ($scope.search === 3) {
        //         return true;
        //     }
        // };

    }])
    .controller('UserViewController', ['$scope', 'globalVarsSrv', 'ClrStatusSrv', 'api', '$routeParams', '$location', 'AuthenticationService', 'MakeModal',
        function ($scope, globalVarsSrv, ClrStatusSrv, api, $routeParams, $location, AuthenticationService, MakeModal) {
            $scope.statusOptions = ClrStatusSrv.getStatus('requestStatus');
            $scope.requests = {};
            AuthenticationService.CheckCredentials();
            var user = globalVarsSrv.getGlobalVar('auth');
            $scope.config_id = 8;
            $scope.expiredRequests = [];
            $scope.canceledRequests = [];
            $scope.doneRequests = [];
            $scope.draftRequests = [];
            $scope.pendingRequests = [];
            $scope.configurationRequests = [];
            $scope.usersrequests = {};
            globalVarsSrv.setGlobalVar('cur', true);

            api.apiCall('GET', 'api/public/config', function (results) {
                $scope.config = results.data;
            });

            api.apiCall('GET', 'api/public/usersrequests/' + user.authdata.roles[0].id, function (results) {
                $scope.usersrequests = results.data;
            });

            $scope.$watch('config_id', function (newVal) {
                api.apiCall('GET', 'api/public/requests/users/' + user.authdata.roles[0].id + '/config/' + newVal, function (results) {
                    var r = $scope.requests = results.data;
                    r.map(function (req) {
                        req.showTod = (new Date(req.tod) - new Date(req.fromd) > 86400000);
                        switch (req.status) {
                            case 0:
                                $scope.pendingRequests.push(req);
                                break;
                            case 1:
                                $scope.doneRequests.push(req);
                                break;
                            case 2:
                                $scope.expiredRequests.push(req);
                                break;
                            case 3:
                                $scope.draftRequests.push(req);
                                break;
                            case 4:
                                $scope.doneRequests.push(req);
                                break;
                            case 5:
                                $scope.configurationRequests.push(req);
                                break;
                        }
                    })
                });
            });

            $scope.acceptReq = function (item) {
                item.status = 1;
                item.to_comment = item.to_comment + ' Approved';

                api.apiCall('PUT', 'api/public/usersrequests/' + item.id, function (results) {
                    $scope.usersrequests.splice($scope.usersrequests.indexOf(item), 1);
                    MakeModal.generalInfoModal('sm', 'Info', 'info', 'Αποδοχή Αιτήματος', 1)
                }, undefined, item);
            };

            $scope.declineReq = function (item) {
                item.status = -1;
                item.to_comment = item.to_comment + ' decline from ' + item.tousers.fname;
                api.apiCall('PUT', 'api/public/usersrequests/' + item.id, function (results) {
                    $scope.usersrequests.splice($scope.usersrequests.indexOf(item), 1);
                    MakeModal.generalInfoModal('sm', 'Info', 'info', 'Άρνηση Αιτήματος', 1)
                }, undefined, item);

            };

            $scope.selectRRid = function (id, item) {

                if (item.status === 0) {
                    globalVarsSrv.setGlobalVar('cur', false)
                } else {
                    globalVarsSrv.setGlobalVar('cur', true)
                }
                $location.url('/usercreaterequests/' + id);
                return;
            };

            $scope.getstatus = function (item) {
                switch (item.status) {
                    case 0:
                        return 'Αναμονή Έγκρισης';
                    case 1:
                        return 'Εγκεκριμένο';
                    case -1:
                        return 'Απορρίφθηκε'
                }

            };

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
        }])

    .controller('popupUserReq', ['api', '$scope', '$uibModalInstance', 'config', function (api, $scope, $uibModalInstance, config) {

        $scope.rrID = config.rrID;
        $scope.dataRRID = [];

        $scope.getstatus = function (item) {
            switch (item.status) {
                case 0:
                    return 'Αναμονή Έγκρισης';
                case 1:
                    return 'Εγκεκριμένο';
                case -1:
                    return 'Απορρίφθηκε'
            }

        };

        $scope.ok = function () {
            $uibModalInstance.close('ok')
        };

        api.apiCall('GET', 'api/public/pendingrequests/' + $scope.rrID, function (results) {
            $scope.dataRRID = results.data;
        });
    }])

    .controller('guestModalController', ['api', '$scope', '$uibModalInstance', 'config', function (api, $scope, $uibModalInstance, config) {
        $scope.item = config.data;
        $scope.item.guests = [];

        $scope.ok = function () {
            $uibModalInstance.close('ok')
        };


        api.apiCall('GET', 'api/public/requests/' + $scope.item.id + '/guests', function (results) {
            if (!results.data) return;
            $scope.item.guests = results.data;
        });

        $scope.deleteGuest = function (guest) {
            api.apiCall('DELETE', 'api/public/requests/guests/' + guest.id, function (results) {
                $scope.item.guests.splice($scope.item.guests.indexOf(guest), 1);
            })
        };

        $scope.newGuest = function newGuest() {
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

        $scope.postGuest = function (item) {
            item.req_id = $scope.item.id;
            api.apiCall('POST', 'api/public/request/guest', function (result) {
                $scope.item.guests = result.data;
            }, undefined, item);
        };
    }])

    .directive('dashBoardTable', function () {
        return {
            restrict: 'EA',
            scope: {
                title: "@",
                status: "<",
                dp: "="
            },
            controller: 'UserViewTableController',
            templateUrl: 'modules/userView/userHome/dashboardTable.html'
        }
    })
;