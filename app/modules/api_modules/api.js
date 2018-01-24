'use strict';

angular.module('ApiModules', [
    'MainComponents'
])
    .factory('api', ['MakeModal', '$http', function (MakeModal, $http) {
        var factory = {};

        factory.apiCall = function (method, url, successCallback, errorCallBack, data, dataProvider, scope) {
            if (method === 'DELETE' || method === 'PUT') {
                //url += '/' + data.id;
                scope.modalMessage = "Are you sure?"
                var modalInstance = MakeModal.defaultModal('sm', callApi, null, scope);
            } else {
                return callApi();
            }

            function callApi() {
                $http({
                    method: method,
                    url: url,
                    data: data
                }).then(function (results) {
                    var modalInstance = MakeModal.generalInfoModal({
                        size: 'sm',
                        message: "Double key entry!",
                        title: "Error",
                        type: 'info',
                        buttons: 1
                    });
                    return results;
                }, function (results) {
                    MakeModal.generalInfoModal({
                        size: 'sm',
                        title: "Error : " + results.data.errorCode,
                        message: results.data.errorText,
                        buttons: 1
                    });
                    if (errorCallBack) errorCallBack(results);
                    return results;
                });
            }
        }
        return factory;
    }])
;