'use strict';

var globalVars = angular.module('GlobalVarsSrvs', ['ApiModules']);

globalVars.factory('globalVarsSrv', ['$http', function ($http) {
    var globalVariables = {};

    function getGlobalVar(gVar) {
        return globalVariables[gVar];
    }

    function setGlobalVar(gVar, value) {
        globalVariables[gVar] = value;
    }

    function removeGlobalVar(gVar) {
        globalVariables[gVar].delete();
    }

    function setGlobal(gVar) {
        globalVariables = gVar;
    }

    function flushGlobal() {
        globalVariables = {};
    }

    function initFromFile(fName) {
        $http.get(fName)
            .then(function (res) {
                setGlobal(res.data);
            }, function (res) {
                console.log(res | JSON);
            });
    }

    var glbSrv = {
        'getGlobalVar': getGlobalVar,
        'setGlobalVar': setGlobalVar,
        'removeGlobalVar': removeGlobalVar,
        'setGlobal': setGlobal,
        'initFromFile': initFromFile
    };
    return glbSrv;
}]);

globalVars.factory('makeController', ['globalVarsSrv', 'api', 'orderByFilter', '$routeParams', function (globalVarsSrv, api, orderBy, $routeParams) {
    var makeController = {};

    function mainController(url, table) {
        var ctrl = {
            dp: [],
            baseURL: globalVarsSrv.getGlobalVar('appUrl') + url,
            totalRows: 0,
            tableColumns: globalVarsSrv.getGlobalVar(table)
        };

        ctrl.getAll = function () {
            api.apiCall('GET', ctrl.baseURL, function (results) {
                ctrl.dp = results.data;
                ctrl.totalRows = ctrl.dp.length;
            });
        };

        ctrl.delete = function (item) {
            api.apiCall('DELETE', ctrl.baseURL + "/" + item.id, function (results) {
                ctrl.dp.splice(ctrl.dp.indexOf(item), 1);
                MakeModal.generalInfoModal('sm', 'Info', 'info', 'Eπιτυχής διαγραφή', 1)
            });
        };

        ctrl.init = function () {
            ctrl.cth = ctrl.tableColumns[1];
            ctrl.getAll();
        };

        ctrl.cth = {};

        ctrl.sortBy = function (th) {
            if (ctrl.cth === th) {
                ctrl.cth.reverse = !ctrl.cth.reverse;
            } else {
                th.sorted = true;
                ctrl.cth = th;
            }
            ctrl.dp = orderBy(ctrl.dp, ctrl.cth.column, ctrl.cth.reverse);
        };

        ctrl.filter = [];

        ctrl.setFilter = function (th) {
            ctrl.filter[th.column] = th.filter;
        };

        return ctrl;
    };

    function n2nController(url, table) {
        var ctrl = {
            ldp: [],
            rdp: [],
            lLength: 0,
            rLength: 0,
            pivotData: {},
            //currentRight : {},
            baseURL: globalVarsSrv.getGlobalVar('appUrl') + url,
            mainData: {}
        };

        ctrl.init = function () {
            ctrl.getMain();
            ctrl.getLeft();
            ctrl.getRight()
        };

        ctrl.getMain = function () {
            api.apiCall('GET', ctrl.baseURL + "/" + $routeParams.id, function (results) {
                ctrl.mainData = results.data;
            });
        };

        ctrl.getLeft = function () {
            api.apiCall('GET', ctrl.baseURL + "/" + $routeParams.id + '/' + table, function (results) {
                ctrl.ldp = results.data;
                ctrl.lLength = ctrl.ldp.length;
                if (ctrl.rdp && ctrl.rdp.length > 0) {
                    ctrl.compare(ctrl.ldp, ctrl.rdp);
                }
            });
        };

        ctrl.getRight = function () {
            api.apiCall('GET', globalVarsSrv.getGlobalVar('appUrl') + '/' + table, function (results) {
                ctrl.rdp = results.data;
                ctrl.rLength = ctrl.rdp.length;
                if (ctrl.ldp && ctrl.ldp.length > 0) {
                    ctrl.compare(ctrl.ldp, ctrl.rdp);
                }
            });
        };

        ctrl.editPivotData = function (role) {
            ctrl.currentRight = role;
            ctrl.pivotData = role.pivot;
            ctrl.state = 1;
        };

        ctrl.showPivotData = function (role) {
            ctrl.state = 0;
            ctrl.currentRight = role;
        };

        ctrl.deleteData = function (id) {
            api.apiCall('DELETE', ctrl.baseURL + "/" + $routeParams.id + '/' + table + '/' + id, function (results) {
                ctrl.ldp = results.data;
                ctrl.compare(ldp, rdp);
            }, undefined, id);
        };

        ctrl.compare = function (sdp, cdp) {
            for (var i = 0; i < sdp.length; i++) {
                sdp[i].disabled = false;
                for (var j = 0; j < cdp.length; j++)
                    if (angular.equals(cdp[j].id, sdp[i].id))
                        sdp[i].disabled = true;
            }
        };

        return ctrl;
    }

    makeController = {
        mainController: mainController,
        n2nController: n2nController
    };

    return makeController;
}]);