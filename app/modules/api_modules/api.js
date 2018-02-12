'use strict';

angular.module('ApiModules', [
    'MainComponents'
])
    .factory('api', ['MakeModal', '$http', function (MakeModal, $http) {
        var factory = {};

        factory.apiCall = function (method, url, successCallback, errorCallBack, data) {
            if (method === 'DELETE' || method === 'PUT') {
                MakeModal.generalInfoModal('sm', 'danger', 'Επιβεβαίωση', 'Είστε σίγουρος για την αλλαγή που πρόκειται να πραγματοποιηθει;', 2, callApi);
            } else {
                return callApi();
            }

            function callApi() {
                $http({
                    method: method,
                    url: url,
                    data: data
                }).then(function (results) {
                    if (successCallback) successCallback(results);
                    return results;
                }, function (results) {
                    MakeModal.generalInfoModal('sm', 'info', '  Error :' + results.data.errorCode, 1);
                    if (errorCallBack) errorCallBack(results);
                    return results;
                });
            }
        };
        return factory;
    }])
;