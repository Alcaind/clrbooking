'use strict';

angular.module('Requests')
    .controller('CopyDayController', ['$scope', 'api', 'ClrStatusSrv', 'globalVarsSrv', 'AuthenticationService', 'MakeModal',
        function ($scope, api, ClrStatusSrv, globalVarsSrv, AuthenticationService, MakeModal) {


            $scope.copyDayRequest = function (day, dday) {
                var fd = day;
                var td = new Date(day);
                td = new Date(td.setDate(td.getDate() + 1));
                td = new Date(td.setDate(td.getDate() + 1));


                api.apiCall('POST', 'api/public/roombook/copyday', function (result) {
                    $scope.reqToPush = [];
                    var book = result.data;
                    var toCopyRequests = [];
                    book.map(function (request) {
                        $scope.selectedRooms = [];
                        request.rooms.map(function (room) {
                            if (room.pivot.date_index !== fd.getDay()) return;

                            var roomObj = Object.assign({}, room);

                            room.pivot.fromt = new Date('1970-01-01 ' + room.pivot.fromt + ' ');
                            room.pivot.tot = new Date('1970-01-01 ' + room.pivot.tot);
                            delete room.pivot.id;
                            delete room.pivot.req_id;

                            room.pivot.date_index = $scope.item.date_index * 1;
                            roomObj = Object.assign(roomObj, room.pivot);
                            // roomObj.ps = request.ps;
                            $scope.selectedRooms.push(roomObj);
                            for (var r = 0; r < $scope.rooms.length; r++) {
                                if (room.id === $scope.rooms[r].id) {
                                    $scope.rooms[r].checked = true;
                                    //$scope.roomChecked($scope.rooms[r])
                                }
                            }
                            room = Object.assign(room, room.pivot);
                        });

                        var tmpRequest = Object.assign({}, request);
                        delete tmpRequest.id;
                        delete tmpRequest.req_dt;
                        delete tmpRequest.created_at;
                        delete tmpRequest.updated_at;
                        tmpRequest.status = 3;
                        tmpRequest.conf_id = $scope.item.conf_id;
                        tmpRequest.period = $scope.item.period;
                        tmpRequest.rooms = $scope.selectedRooms;

                        $scope.reqToPush.push(tmpRequest);
                    });

                    $scope.item.rooms = $scope.selectedRooms;
                }, undefined, {fromd: fd, dd: dd});
            };
        }]);