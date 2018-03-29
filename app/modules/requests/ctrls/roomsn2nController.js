angular.module('Requests')
    .controller('RequestsRoomsController', ['$scope', 'AuthenticationService', 'makeController', function ($scope, AuthenticationService, makeController) {


        $scope.ctrl = makeController.n2nController('/requests', 'rooms', {
            comment: '',
            teacher: '',
            fromt: new Date(),
            tot: new Date(),
            date_index: ''
        });
        $scope.ctrl.init();


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
            templateUrl: 'modules/requests/reqviews/rooms/pivotForm.html',
            controller: "RequestFormController"
        }
    })
    .controller('RequestFormController', ['$scope', 'api', '$routeParams', function ($scope, api, $routeParams) {
        $scope.baseURL = 'api/public/requests';

        $scope.teachers = [];

        api.apiCall('GET', 'api/public/users', function (results) {
            for (var i = 0; i < results.data.length; i++) {
                if (results.data[i].cat_id === 7) $scope.teachers.push(results.data[i]);
            }
        });

        $scope.getTeacher = function (teacherId) {
            for (var i = 0; i < $scope.teachers.length; i++) {
                if ($scope.teachers[i].id === teacherId) return $scope.teachers[i].user;
            }
        };

        $scope.cancelData = function () {
            $scope.ctrl.pivotData = null;
            $scope.ctrl.currentRight = null;
        };

        $scope.insertRoom = function () {
            var method = "PUT";
            if ($scope.ctrl.state === 0) method = "POST";

            //$scope.ctrl.pivotData.fromt.setTime($scope.ctrl.pivotData.fromt.getTime() - ($scope.ctrl.pivotData.fromt.getTimezoneOffset() * 60000));
            //$scope.ctrl.pivotData.tot.setTime($scope.ctrl.pivotData.tot.getTime() - ($scope.ctrl.pivotData.tot.getTimezoneOffset() * 60000));
            console.log($scope.ctrl.pivotData);
            console.log($scope.ctrl.pivotData.fromt.toUTCString());
            console.log($scope.ctrl.pivotData.fromt.toString());
            console.log($scope.ctrl.pivotData.fromt.toLocaleString());
            console.log($scope.ctrl.pivotData.fromt.toLocaleTimeString());

            api.apiCall(method, $scope.baseURL + "/" + $routeParams.id + '/rooms/' + $scope.ctrl.currentRight.id, function (results) {
                $scope.ctrl.pivotData = Object.assign({}, $scope.ctrl.pivotTable);

                $scope.ctrl.ldp = results.data;
                $scope.ctrl.compare($scope.ctrl.ldp, $scope.ctrl.rdp);
                $scope.cancelData();
            }, undefined, $scope.ctrl.pivotData);
        };
    }]);