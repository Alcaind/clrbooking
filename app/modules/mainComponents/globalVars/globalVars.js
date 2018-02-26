'use strict';

var globalVars = angular.module('GlobalVarsSrvs', ['ApiModules', 'ngCookies', 'MainComponents']);

globalVars.factory('globalVarsSrv', ['$http', '$cookies', '$window', function ($http, $cookies, $window) {
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

    function cookieSave() {
        $window.localStorage['appConf' + getGlobalVar('auth')['username']] = JSON.stringify(globalVariables);
    }

    function cookieGet(usr) {
        var appConf = $window.localStorage['appConf' + usr];
        globalVariables = appConf ? JSON.parse(appConf) : null;
        return globalVariables;
    }

    function appInit(fName, usr) {
        if (!cookieGet(usr)) initFromFile(fName);
    }

    var glbSrv = {
        'getGlobalVar': getGlobalVar,
        'setGlobalVar': setGlobalVar,
        'removeGlobalVar': removeGlobalVar,
        'setGlobal': setGlobal,
        'initFromFile': initFromFile,
        'appInit': appInit,
        'cookieGet': cookieGet,
        'cookieSave': cookieSave
    };
    return glbSrv;
}]);

globalVars.factory('makeController', ['globalVarsSrv', 'api', 'orderByFilter', '$routeParams', 'MakeModal', function (globalVarsSrv, api, orderBy, $routeParams, MakeModal) {
    var makeController = {};

    function mainController(url, table, title) {
        var ctrl = {
            dp: [],
            baseURL: globalVarsSrv.getGlobalVar('appUrl') + url,
            totalRows: 0,
            tableColumns: globalVarsSrv.getGlobalVar(table),
            title: title
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
    }

    function n2nController(url, table, pivotTable) {
        var ctrl = {
            ldp: [],
            rdp: [],
            lLength: 0,
            rLength: 0,
            pivotData: null,
            pivotTable: pivotTable,
            currentRight: {},
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
            ctrl.pivotData = Object.assign({}, ctrl.pivotTable); //ctrl.pivotTable;
            ctrl.state = 0;
            ctrl.currentRight = role;
        };

        ctrl.deleteData = function (id) {
            api.apiCall('DELETE', ctrl.baseURL + "/" + $routeParams.id + '/' + table + '/' + id, function (results) {
                ctrl.ldp = results.data;
                ctrl.compare(ctrl.ldp, ctrl.rdp);
            }, undefined, id);
        };

        ctrl.compare = function (sdp, cdp) {
            for (var i = 0; i < cdp.length; i++) {
                cdp[i].disabled = false;
                for (var j = 0; j < sdp.length; j++)
                    if (angular.equals(cdp[i].id, sdp[j].id))
                        cdp[i].disabled = true;
            }
        };

        return ctrl;
    }

    function profileController(url, table) {
        var ctrl = {
            item: {},
            baseURL: globalVarsSrv.getGlobalVar('appUrl') + url,
            tableColumns: globalVarsSrv.getGlobalVar(table)
        };

        ctrl.init = function () {
            if (!$routeParams.id) {
                ctrl.tableColumns.map(function (tableColumn) {
                    ctrl.item[tableColumn.column] = '';
                });
            } else {
                api.apiCall('GET', ctrl.baseURL + "/" + $routeParams.id, function (results) {
                    ctrl.item = results.data;
                });
            }
        };

        ctrl.save = function (item) {
            api.apiCall('POST', ctrl.baseURL, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Δημιουργήθηκε νέα εγγραφή.', 1);
                history.back();
            }, undefined, item)
        };

        ctrl.update = function (item) {
            api.apiCall('PUT', ctrl.baseURL + "/" + item.id, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Η εγγραφή ανανεώθηκε.', 1);
                history.back();
            }, undefined, item)
        };

        return ctrl;
    }

    makeController = {
        mainController: mainController,
        n2nController: n2nController,
        profileController: profileController
    };

    return makeController;

}]);