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
                    //TODO : To see about dataProviders (bidings, etc...) ?!?!
                    /*results.data.map(function (obj) {
                        dataProvider.push(obj);
                    });*/
                    if (results.data.indexOf("SQLSTATE") === -1) {

                        if (successCallback) successCallback(results);
                    } else {
                        //var modalInstance = MakeModal.infoModal('sm',"Double key entry!");
                        var modalInstance = MakeModal.generalInfoModal({
                            size: 'sm',
                            message: "Double key entry!",
                            title: "Error",
                            type: 'info',
                            buttons: 1
                        });
                    }
                    return results;
                }, function (results) {
                    var modalInstance = MakeModal.defaultModal('lg', null, null, scope);
                    if (errorCallBack) errorCallBack(results);
                    return results;
                });
            }
        }
        return factory;
    }])
;