/**
 * Created by alcaind on 24/08/2017.
 */
angular.module('Admin')
    .controller('appOptionsController', ['$scope', '$rootScope', 'DBService', '$uibModal',
        function ($scope, $rootScope, DBService, $uibModal) {
            $scope.options = [];
            $scope.delete = function (vector, item) {
                vector.splice(vector.indexOf(item), 1);
            };

            $scope.getOptions = function () {
                DBService.options({user: $scope.user}, function (response) {
                    $scope.options = response.data;
                    for (var i = 0; i < $scope.options.length; i++) {
                        $scope.options[i].options = JSON.parse($scope.options[i].options);
                    }
                }, 'GET');
            };

            $scope.getAllOptions = function () {
                DBService.options(null, function (response) {
                    $scope.options = response.data;
                    for (var i = 0; i < $scope.options.length; i++) {
                        $scope.options[i].options = JSON.parse($scope.options[i].options);
                    }
                }, 'GET');
            };

            $scope.delOptions = function (item) {
                DBService.options({id: item.id}, function (response) {
                    $scope.delete($scope.options, item);
                }, 'DELETE');
            };

            $scope.filterOptions = function (item) {
                return item.appid * 1 === $scope.appid;
            };

            $scope.open = function (size, type, item) {
                $scope.formOptions = {id: null, name: "", descr: "", appid: 0, options: {}, user: $rootScope.user};
                if (type === 'new') {
                    $scope.formOptions.options = DBService.getDefaultOptions($scope.appAlias);
                } else {
                    $scope.formOptions = item;
                }

                $scope.formOptions.appid = $scope.appid;

                var modalInstance = $uibModal.open({
                    templateUrl: 'modules/admin/views/' + $scope.appAlias + '-options-template.html',
                    controller: 'ModalInstanceCtrl',
                    scope: $scope,
                    resolve: {
                        optionsForm: function () {
                            $scope.optionsForm = $scope.formOptions;
                            return $scope.optionsForm;
                        }
                    },
                    size: size
                }).result.then(
                    function (result) {
                    }
                );
            };
        }])
    .controller('ModalInstanceCtrl', function ($scope, $rootScope, $uibModalInstance, DBService, $uibModal, optionsForm) {
        $scope.form = {};
        $scope.optionsForm2 = optionsForm;
        $scope.form.optionsForm = optionsForm;

        $scope.submitForm = function () {
            if ($scope.form.optionsForm.$valid) {
                DBService.options($scope.optionsForm2, function (response) {
                    console.log('option inserted ' + response);
                    if (!$scope.optionsForm2.id) {
                        $scope.options.push($scope.optionsForm2);
                        $scope.optionsForm2.id = response.data.id;
                    }
                    $scope.optionsForm2.options = angular.fromJson($scope.optionsForm2.options);
                }, $scope.optionsForm2.id ? 'PUT' : 'POST');
                $uibModalInstance.close($scope.optionsForm2);
            } else {
                console.log('userform is not in scope');
            }
        };

        $scope.debugInfo = function () {
            console.log($scope.form);
            console.log('debug form');
        };

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });