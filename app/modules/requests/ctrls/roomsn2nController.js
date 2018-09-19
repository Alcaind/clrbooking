angular.module('Requests')
    .controller('RequestsRoomsController', ['$scope', 'AuthenticationService', 'makeController', 'ClrStatusSrv', 'api', '$routeParams', 'globalVarsSrv', function ($scope, AuthenticationService, makeController, ClrStatusSrv, api, $routeParams, globalVarsSrv) {
        $scope.ctrl = makeController.n2nController('/requests', 'rooms', {
            comment: '',
            teacher: '',
            fromt: '',
            tot: '',
            date_index: ''
        });
        $scope.ctrl.init();

        // $scope.statusOptions = ClrStatusSrv.getStatus('weekdaysTableDateIndex');
        $scope.weekOptions = globalVarsSrv.getGlobalVar('weekdaysTableDateIndex');
        $scope.teachers = [];

        api.apiCall('GET', 'api/public/teacher', function (results) {
            //for (var i = 0; i < results.data.length; i++) {
            // if (results.data[i].cat_id === 7)
            $scope.teachers = (results.data);
            // }
        });

        $scope.getTeacher = function (teacherId) {
            for (var i = 0; i < $scope.teachers.length; i++) {
                if ($scope.teachers[i].id === teacherId) return $scope.teachers[i].sname + ' ' + $scope.teachers[i].fname;
            }
        };

        $scope.cancelData = function () {
            $scope.ctrl.pivotData = null;
            $scope.ctrl.currentRight = null;
        };

        $scope.insertRoom = function () {

            if ($scope.ctrl.state === 0) {
                method = "POST";
                $scope.ctrl.pivotData.fromt.setTime($scope.ctrl.pivotData.fromt.getTime() - ($scope.ctrl.pivotData.fromt.getTimezoneOffset() * 60000));
                $scope.ctrl.pivotData.tot.setTime($scope.ctrl.pivotData.tot.getTime() - ($scope.ctrl.pivotData.tot.getTimezoneOffset() * 60000));
                $scope.ctrl.pivotData.room_id = $scope.ctrl.currentRight.id;

                api.apiCall(method, 'api/public/requests' + "/" + $routeParams.id + '/rooms/' + $scope.ctrl.currentRight.id, function (results) {
                    $scope.ctrl.pivotData = Object.assign({}, $scope.ctrl.pivotTable);
                    $scope.ctrl.ldp = results.data;
                    $scope.ctrl.compare($scope.ctrl.ldp, $scope.ctrl.rdp);
                    $scope.cancelData();
                }, undefined, $scope.ctrl.pivotData);
            } else {
                var method = "PUT";
                //$scope.ctrl.pivotData.fromt.setTime($scope.ctrl.pivotData.fromt.getTime() - ($scope.ctrl.pivotData.fromt.getTimezoneOffset() * 60000));
                //$scope.ctrl.pivotData.tot.setTime($scope.ctrl.pivotData.tot.getTime() - ($scope.ctrl.pivotData.tot.getTimezoneOffset() * 60000));
                $scope.ctrl.pivotData.room_id = $scope.ctrl.currentRight.id;
                $scope.ctrl.pivotData.fromt = $scope.ctrl.pivotData.fromt.getHours() + ":" + $scope.ctrl.pivotData.fromt.getMinutes() + ":00";
                $scope.ctrl.pivotData.tot = $scope.ctrl.pivotData.tot.getHours() + ":" + $scope.ctrl.pivotData.tot.getMinutes() + ":00";
                ;

                api.apiCall(method, 'api/public/requests/rooms/' + $scope.ctrl.pivotData.id, function (results) {
                    // api.apiCall(method, 'api/public/requests' + "/" + $routeParams.id + '/rooms/' + $scope.ctrl.currentRight.id, function (results) {
                    $scope.ctrl.pivotData = Object.assign({}, $scope.ctrl.pivotTable);

                    $scope.ctrl.ldp = results.data;
                    $scope.ctrl.compare($scope.ctrl.ldp, $scope.ctrl.rdp);
                    $scope.cancelData();
                }, undefined, $scope.ctrl.pivotData);
            }

            // data.fromt = data['fromt'].getMinutes() < 10 ? data['fromt'].getHours() + ':0' + data['fromt'].getMinutes() + ':00' : data['fromt'].getHours() + ':' + data['fromt'].getMinutes() + ':00';
            // data.tot = data['tot'].getMinutes() < 10 ? data['tot'].getHours() + ':0' + data['tot'].getMinutes() + ':00' : data['tot'].getHours() + ':' + data['tot'].getMinutes() + ':00';
            // console.log($scope.ctrl.pivotData);
            // console.log($scope.ctrl.pivotData.fromt.toUTCString());
            // console.log($scope.ctrl.pivotData.fromt.toString());
            // console.log($scope.ctrl.pivotData.fromt.toLocaleString());
            // console.log($scope.ctrl.pivotData.fromt.toLocaleTimeString());

        };

    }])

    .directive('leftTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/requests/reqviews/rooms/lTable.html'
        }
    })
    .directive('rightTable', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/requests/reqviews/rooms/rTable.html'
        }
    })
    .directive('pivotForm', function () {
        return {
            restrict: 'EA',
            templateUrl: 'modules/requests/reqviews/rooms/pivotForm.html'
            // ,
            // controller: "RequestFormController"
        }
    });
// .controller('RequestFormController', ['$scope', 'api', '$routeParams', 'ClrStatusSrv', function ($scope, api, $routeParams, ClrStatusSrv) {
//
//     $scope.baseURL = 'api/public/requests';
//
//     $scope.statusOptions = ClrStatusSrv.getStatus('weekdaysTableDateIndex');
//     $scope.teachers = [];
//
//     api.apiCall('GET', 'api/public/users', function (results) {
//         for (var i = 0; i < results.data.length; i++) {
//             if (results.data[i].cat_id === 7) $scope.teachers.push(results.data[i]);
//         }
//     });
//
//     $scope.getTeacher = function (teacherId) {
//         for (var i = 0; i < $scope.teachers.length; i++) {
//             if ($scope.teachers[i].id === teacherId) return $scope.teachers[i].sname + ' ' + $scope.teachers[i].fname;
//         }
//     };
//

//}]);