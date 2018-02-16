'use strict';

angular.module('Users', [
    'MainComponents',
    'ui.bootstrap',
    'ApiModules',
    'Authentication'
])
    .controller('UsersController', ['$scope', 'MakeModal', '$http', 'api', 'orderByFilter', 'AuthenticationService', function ($scope, MakeModal, $http, api, orderBy, AuthenticationService) {
        AuthenticationService.CheckCredentials();

        $scope.dp = [];
        $scope.item = {};
        $scope.method = '';
        $scope.baseURL = 'api/public/users';
        $scope.tableColumns = [
            {column: "id", title: "ID", visible: true},
            {column: "user", title: "Username", visible: true, sorted: false, filter: ""},
            {column: "fname", title: "Επώνυμο", visible: true, sorted: false, filter: ""},
            {column: "sname", title: "Όνομα", visible: true, sorted: false, filter: ""},
            {column: "phone", title: "Τηλέφωνο", visible: true, sorted: false, filter: ""},
            {column: "em_main", title: "1ο Email", visible: true, sorted: false, filter: ""},
            {column: "em_sec", title: "2ο Email", visible: true, sorted: false, filter: ""},
            {column: "em_pant", title: "Email Uni", visible: true, sorted: false, filter: ""},
            {column: "cat_id", title: "Κατηγορία.", visible: true, sorted: false, filter: ""},
            {column: "tm_id", title: "Τμήμα", visible: true, sorted: false, filter: ""},
            {column: "comments", title: "Σχόλια", visible: true, sorted: false, filter: ""}
        ];

        $scope.getUsers = function () {
            api.apiCall('GET', $scope.baseURL, function (results) {
                $scope.dp = results.data;
                $scope.totalItems = $scope.dp.length;
            });
        };

        $scope.deleteUser = function (item) {
            api.apiCall('DELETE', $scope.baseURL + "/" + item.id, function (results) {
                $scope.dp.splice($scope.dp.indexOf(item), 1);
                $scope.item = {};
                MakeModal.generalInfoModal('sm', 'Info', 'info', 'Η εγγραφή του χρήστη διαγράφηκε.', 1)
            });
        };

        $scope.cth = $scope.tableColumns[1];

        $scope.sortBy = function (th) {
            if ($scope.cth === th) {
                $scope.cth.reverse = !$scope.cth.reverse;
            } else {
                $scope.cth.sorted = false;
                th.sorted = true;
                $scope.cth = th;
            }
            $scope.dp = orderBy($scope.dp, $scope.cth.column, $scope.cth.reverse);
        };
        $scope.filter = [];
        $scope.setFilter = function (th) {
            $scope.filter[th.column] = th.filter;
        };

        $scope.getUsers();
    }])

    .controller('ProfileController', ['$scope', '$routeParams', 'api', 'MakeModal', 'AuthenticationService', function ($scope, $routeParams, api, MakeModal, AuthenticationService) {
        AuthenticationService.CheckCredentials();
        $scope.tms = {};
        $scope.ucategories = {};
        $scope.baseURL = 'api/public/users';

        api.apiCall('GET', 'api/public/tms', function (results) {
            $scope.tms = results.data;
        });

        api.apiCall('GET', 'api/public/userscategories', function (results) {
            $scope.ucategories = results.data;
        });

        if (!$routeParams.userId) {
            $scope.item = {
                tm_id: "",
                fname: "",
                sname: "",
                phone: "",
                em_main: "",
                em_sec: "",
                em_pant: "",
                cat_id: "",
                comments: "",
                user: "",
                hash: ""
            };
        } else {
            api.apiCall('GET', $scope.baseURL + "/" + $routeParams.userId, function (results) {
                $scope.item = results.data;
            });
        }

        $scope.updateUser = function (item) {
            api.apiCall('PUT', $scope.baseURL + "/" + item.id, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Η εγγραφή του χρήστη ανανεώθηκε.', 1);
                history.back();
            }, undefined, item)

        };

        $scope.saveUser = function (item) {
            api.apiCall('POST', $scope.baseURL, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Νέα εγγραφή χρήστη δημιουργήθηκε.', 1);
                history.back();
            }, undefined, item)
        };
    }])

    .component('usersProfile', {
        restrict: 'EA',
        templateUrl: 'modules/users/uviews/profile.html',
        scope: {
            //itemId: '=itemId',
            method: '=method'
        },
        controller: 'ProfileController'
    })

    .directive('pwCheck', [function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.pwCheck;
                elem.add(firstPassword).on('keyup', function () {
                    scope.$apply(function () {
                        ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                    });
                });
            }
        }
    }])
;
