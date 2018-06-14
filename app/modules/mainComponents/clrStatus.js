'use strict';

angular.module('MainComponents')
    .factory('ClrStatusSrv', function ($http) {
        var clrStatus = {};

        $http.get('config/appConfig.json')
            .then(function (res) {
                clrStatus = res.data;
            }, function (res) {
                console.log(res | JSON);
            });

        function getStatus(name) {
            return clrStatus[name];
        }

        var srv = {
            getStatus: getStatus
        };

        return srv;
    })
    .directive('statusSelector', function () {
        return {
            restrict: "EA",
            scope: {
                statusTitle: "@",
                options: "@",
                outputValue: "="
            },
            controller: "statusSelectorController",
            templateUrl: 'modules/mainComponents/views/statusSelector.html'
        }
    })
    .controller('statusSelectorController', function ($scope, ClrStatusSrv) {

        $scope.optStatus = ClrStatusSrv.getStatus($scope.options);
    })


    .factory('ClrFormItemSrv', function (api) {
        var clrFormItem = {};

        function getFormItem(name) {
            return clrFormItem[name];
        }

        var srv = {
            getFormItem: getFormItem
        };

        function getFormItem() {
            api.apiCall('GET', ctrl.baseURL, function (results) {
                return results.data;
            });
        }

        return srv;

    })
    .directive('formItemSelector', function () {
        return {
            restrict: "EA",
            scope: {
                selectorTitle: "@",
                outputValue: "=",
                searchable: "<",
                aletrText: "@",
                dp: "=",
                viewColumn: '@',
                returnColumn: '@'
            },
            controller: "FormItemSelectorController",
            templateUrl: 'modules/mainComponents/views/formItemSelector.html'
        }
    })
    .controller('FormItemSelectorController', function ($scope) {
        //$scope.optFormItem = ClrFormItemSrv.getFormItem($scope.value);
        $scope.dp = [];
        $scope.myfilter = [];

        $scope.dataFilter = function (myfilter) {
            return function (item) {
                if (item.id === $scope.outputValue) return true;
                // if (!$scope.outputValue) $scope.outputValue = item.id;
                return myfilter ? (item[$scope.viewColumn] + '').indexOf(myfilter) >= 0 : true;
            };
            //console.log(myfilter);
        }

    });