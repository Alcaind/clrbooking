'use strict';

var globalVars = angular.module('GlobalVarsSrvs', ['ApiModules', 'ngCookies', 'MainComponents', 'pascalprecht.translate']);

globalVars.factory('globalVarsSrv', ['$http', '$cookies', '$window', 'api', '$translate', function ($http, $cookies, $window, api, $translate) {
    var globalVariables = {appStarted: false};
    var listeners = [];

    function addListener(varListen, listener) {
        if (!listeners[varListen]) listeners[varListen] = [];
        listeners[varListen].push(listener);
    }

    function removeListener(varListen, listener) {
        listeners[varListen][listeners.indexOf(listener)].delete();
    }

    function getGlobalVar(gVar) {
        return globalVariables[gVar];
    }

    function setGlobalVar(gVar, value) {
        if (listeners[gVar])
            for (var i = 0; i < listeners[gVar].length; i++) {
                var listener = listeners[gVar][i];
                listener(value, globalVariables[gVar]);
            }
        globalVariables[gVar] = value;
    }

    function removeGlobalVar(gVar) {
        globalVariables[gVar].delete();
    }

    function setGlobal(gVar) {
        globalVariables = Object.assign(globalVariables, gVar);
        cookieSave();
    }

    function flushGlobal() {
        globalVariables = {};
    }

    function initFromFile(fName, callback) {
        /*api.apiCall('GET', '/panteion/app/api/public/appconfig/' + fName, function (res) {
            setGlobal(JSON.parse(res.data[0].value));
        }, function (res) {
            console.log(res | JSON);
        });*/
        $http.get('config/appConfig.json')
            .then(function (res) {
                setGlobal(res.data);
                $translate.use(res.data.lang);
                if (callback) callback();
                globalVariables.appStarted = true;
            }, function (res) {
                console.log(res | JSON);
            });
    }

    function cookieSave() {
        if (getGlobalVar('auth'))
            $window.localStorage['appConf' + getGlobalVar('auth')['username']] = JSON.stringify(globalVariables);

    }

    function cookieGet(usr, callback) {
        var appConf = $window.localStorage['appConf' + usr];
        if (usr !== getGlobalVar('auth')['username']) return;
        globalVariables = appConf ? Object.assign(globalVariables, JSON.parse(appConf)) : globalVariables;
        $translate.use(globalVariables.lang);
        //console.log($translate.instant('Αρχική'));
        if (callback) callback();
        globalVariables.appStarted = true;
        return globalVariables;
    }

    function appInit(fName, usr, callback) {
        if (!cookieGet(usr, callback) || !globalVariables['appUrl']) initFromFile(fName, callback);
    }

    function checkDates(fromd, tod) {
        var one_day = 1000 * 60 * 60 * 24;
        var fromd_ms = fromd.getTime();
        var tod_ms = tod.getTime();
        var diff_dates = tod_ms - fromd_ms;
        if (diff_dates < one_day) {
            var temp_tod = fromd_ms + one_day;
            tod = new Date(temp_tod);
            return tod;
        } else {
            return tod;
        }
    }


    var glbSrv = {
        'getGlobalVar': getGlobalVar,
        'setGlobalVar': setGlobalVar,
        'removeGlobalVar': removeGlobalVar,
        'setGlobal': setGlobal,
        'initFromFile': initFromFile,
        'appInit': appInit,
        'cookieGet': cookieGet,
        'cookieSave': cookieSave,
        'addListener': addListener,
        'checkDates': checkDates
    };
    return glbSrv;
}]);

globalVars.factory('makeController', ['globalVarsSrv', 'api', 'orderByFilter', '$routeParams', 'MakeModal', 'AuthenticationService', function (globalVarsSrv, api, orderBy, $routeParams, MakeModal, AuthenticationService) {
    var makeController = {};

    /**
     *
     * @param url -> Einai to URL tou api call
     * @param table -> Einai o pinakas anaforas tou view
     * @param title -> Einai o titlos tou para8yroy pou 8a emfanistei
     * @returns {{dp: Array, Einai o Data Provider
      *         baseURL: *,
      *         totalRows: number,
      *         tableColumns: *,
      *         title: *,
      *         operations: *,
      *         url: *}}
     */
    function mainController(url, table, title) {
        /**
         * @type {{dp: Array, baseURL: *, totalRows: number, tableColumns: *, title: *, operations: *, url: *}}
         */
        AuthenticationService.CheckCredentials();

        var ctrl = {
            dp: [],
            baseURL: globalVarsSrv.getGlobalVar('appUrl') + url,
            totalRows: 0,
            tableColumns: globalVarsSrv.getGlobalVar(table),
            title: title,
            operations: globalVarsSrv.getGlobalVar(table + "Ops"),
            url: url
        };

        ctrl.operations.map(function (op) {
            op.ifVisible = true
        });

        ctrl.selectedRow = null;

        ctrl.setUrl = function (url) {
            ctrl.url = url;
            ctrl.baseURL = globalVarsSrv.getGlobalVar('appUrl') + url;
        };

        ctrl.getAll = function (url) {

            if (!url) api.apiCall('GET', ctrl.baseURL, function (results) {
                ctrl.dp = [];
                ctrl.dp = results.data;
                ctrl.totalRows = ctrl.dp.length;
            });
            else api.apiCall('GET', url, function (results) {
                ctrl.dp = [];
                ctrl.dp = results.data;
                ctrl.totalRows = ctrl.dp.length;
            });

        };

        ctrl.ifDelete = globalVarsSrv.getGlobalVar('token').scope[3] === 'delete' ? true : false;

        ctrl.selectRow = function (item) {
            if (ctrl.selectedRow) ctrl.selectedRow.selected = false;
            item.selected = true;
            ctrl.selectedRow = item;
        };

        ctrl.delete = function (item) {
            api.apiCall('DELETE', ctrl.baseURL + "/" + item.id, function (results) {
                ctrl.dp.splice(ctrl.dp.indexOf(item), 1);
                MakeModal.generalInfoModal('sm', 'Info', 'info', 'Eπιτυχής διαγραφή', 1)
            });
        };


        ctrl.init = function () {
            ctrl.cth = ctrl.tableColumns[0];
            ctrl.cth.sorted = true;
            ctrl.getAll();
        };

        ctrl.cth = {};

        ctrl.sortBy = function (th) {
            if (ctrl.cth === th) {
                ctrl.cth.reverse = !ctrl.cth.reverse;
            } else {
                ctrl.cth.sorted = false;
                th.sorted = true;
                ctrl.cth = th;
            }
            ctrl.dp = orderBy(ctrl.dp, ctrl.cth.column, ctrl.cth.reverse);
        };

        ctrl.filter = [];

        // ctrl.setFilter = function (th) {
        //     ctrl.filter[th.column] = th.filter;
        // };

        ctrl.filterValue = [];
        ctrl.filterJson = function (item) {
            var itemStr = JSON.stringify(item).toLowerCase();
            // var itemStr = JSON.stringify(item);
            var ret = false;
            var cnt = 0;

            for (var key in ctrl.filterValue) {
                cnt++;
                if (ctrl.filterValue[key] === "") {
                    cnt--;
                    delete ctrl.filterValue[key];
                }
                if (ctrl.filterValue[key] && item[key]) {
                    if (typeof(ctrl.filterValue[key]) === 'string') {
                        ret = JSON.stringify(item[key]).toLowerCase().indexOf(ctrl.filterValue[key].toLowerCase()) > -1 ? true : false;
                    } else {
                        ret = JSON.stringify(item[key]).indexOf(ctrl.filterValue[key]) > -1 ? true : false;
                    }
                }
            }
            return cnt === 0 ? true : ret;
        };

        ctrl.clearFilters = function () {
            ctrl.filterValue = [];
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

        //ctrl.operations.map(function (op) { op.ifVisible = true });

        ctrl.init = function () {
            AuthenticationService.CheckCredentials();
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

                makeTimes(ctrl.ldp);
            });
        };

        function makeTimes(item) {
            item.map(function (value) {
                if (value.pivot['fromt']) {
                    value.pivot['fromt'] = new Date('1970-01-01 ' + value.pivot['fromt']);
                    value.pivot['tot'] = new Date('1970-01-01 ' + value.pivot['tot']);
                }
            })
        }

        ctrl.getRight = function () {
            api.apiCall('GET', globalVarsSrv.getGlobalVar('appUrl') + '/' + table, function (results) {
                ctrl.rdp = results.data;
                ctrl.rLength = ctrl.rdp.length;
                if (ctrl.ldp && ctrl.ldp.length > 0) {
                    ctrl.compare(ctrl.ldp, ctrl.rdp);
                }
            });
        };

        ctrl.editPivotData = function (data) {
            ctrl.currentRight = data;
            ctrl.pivotData = data.pivot;
            /*if (data.pivot['fromt']) {
                data.pivot['fromt'] = new Date('2018-01-01 ' + data.pivot['fromt']);
                data.pivot['tot'] = new Date('2018-01-01 ' + data.pivot['tot']);
            }*/
            ctrl.state = 1;
        };

        ctrl.deleteData = function (id) {
            api.apiCall('DELETE', ctrl.baseURL + "/" + $routeParams.id + '/' + table + '/' + id, function (results) {
                ctrl.ldp = results.data;
                ctrl.compare(ctrl.ldp, ctrl.rdp);
                makeTimes(ctrl.ldp);
            }, undefined, id);
        };

        ctrl.showPivotData = function (data) {
            ctrl.pivotData = Object.assign(ctrl.pivotTable);
            ctrl.state = 0;
            ctrl.currentRight = data;
        };

        ctrl.compare = function (sdp, cdp) {
            for (var i = 0; i < cdp.length; i++) {
                cdp[i].disabled = false;
                for (var j = 0; j < sdp.length; j++)
                    if (angular.equals(cdp[i].id, sdp[j].id))
                        cdp[i].disabled = true;
            }
        };

        ctrl.cancelPivotData = function () {
            ctrl.pivotData = null;
            ctrl.currentRight = null;
        };

        ctrl.insertPivotItem = function (data) {
            var method = "PUT";
            if (ctrl.state === 0) method = "POST";
            if (data.fromt) {
                data.fromt = data['fromt'].getMinutes() < 10 ? data['fromt'].getHours() + ':0' + data['fromt'].getMinutes() + ':00' : data['fromt'].getHours() + ':' + data['fromt'].getMinutes() + ':00';
                data.tot = data['tot'].getMinutes() < 10 ? data['tot'].getHours() + ':0' + data['tot'].getMinutes() + ':00' : data['tot'].getHours() + ':' + data['tot'].getMinutes() + ':00';
            }
            api.apiCall(method, ctrl.baseURL + "/" + $routeParams.id + '/' + table + '/' + ctrl.currentRight.id, function (results) {
                data = {comment: '', status: '1'};
                ctrl.ldp = results.data;
                ctrl.compare(ctrl.ldp, ctrl.rdp);
                makeTimes(ctrl.ldp);
                ctrl.cancelPivotData();
                MakeModal.generalInfoModal('sm', 'Info', 'Info', ctrl.state === 0 ? 'Δημιουργήθηκε νέα εγγραφή.' : 'Η εγγραφή ανανεώθηκε.', 1);
            }, undefined, data);
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
            makeDates(item);
            api.apiCall('POST', ctrl.baseURL, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'Info', 'Δημιουργήθηκε νέα εγγραφή.', 1);
                history.back();
            }, undefined, item)

        };

        function makeDates(item) {
            if (!item['fromd']) return;
            if (typeof item['fromd'] === 'string') {
                item['fromd'] = new Date(item['fromd']);
            } else {
                item['fromd'] = new Date(item['fromd'].getTime() - item['fromd'].getTimezoneOffset() * 60000);
            }
            if (typeof item['tod'] === 'string') {
                item['tod'] = new Date(item['tod']);
            } else {
                item['tod'] = new Date(item['tod'].getTime() - item['tod'].getTimezoneOffset() * 60000);
            }
        }

        ctrl.update = function (item) {
            api.apiCall('PUT', ctrl.baseURL + "/" + item.id, function (results) {
                MakeModal.generalInfoModal('sm', 'Info', 'info', 'Η εγγραφή ανανεώθηκε.', 1);
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