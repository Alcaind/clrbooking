'use strict';

angular.module('Authentication', ['angular-storage', 'GlobalVarsSrvs'])

    .factory('AuthenticationService',
        ['Base64', '$http', '$cookieStore', '$rootScope', 'store', 'jwtHelper', '$location', 'globalVarsSrv',
            function (Base64, $http, $cookieStore, $rootScope, store, jwtHelper, $location, globalVarsSrv) {
                var service = {};

                service.Login = function (username, password, callback) {
                    var app = window.location.href.split('/');
                    var appStr = app[3];

                    var req = {
                        method: 'POST',
                        headers: {Authorization: service.SetCredentials(username, password)},
                        url: './api/public/login', data: {user: username, password: password, app: appStr}
                    };
                    $http(req).then(function (response) {
                        store.set('jwt', response.data);
                        store.set('rwt', jwtHelper.decodeToken(response.data.token)["refresh-token"]);
                        var auth = {};
                        auth.username = jwtHelper.decodeToken(store.get('jwt').token).sub;
                        auth.authdata = jwtHelper.decodeToken(store.get('jwt').token);

                        $http({
                            method: 'GET',
                            url: './api/public/users/' + auth.authdata.roles[0].id + '/tms'

                        }).then(function successCallback(responseTm) {
                            auth.authdata.roles[0].tm = responseTm.data;
                            globalVarsSrv.setGlobalVar('auth', auth);
                            callback(response);
                        });


                    }, function (response) {
                        callback(response);
                        console.log(response.status);
                    });
                };

                service.SetCredentials = function (username, password) {
                    var authdata = Base64.encode(username + ':' + password);

                    //$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
                    //$cookieStore.put('globals', $rootScope.globals);
                    return 'Basic ' + authdata;
                };

                service.ClearCredentials = function () {
                    // $rootScope.globals = {};
                    // $cookieStore.remove('globals');
                    var auth = {};
                    auth.username = jwtHelper.decodeToken(store.get('jwt').token).sub;
                    auth.authdata = '';
                    globalVarsSrv.setGlobalVar('auth', auth);
                    //globalVarsSrv.setGlobalVar('', null)
                    globalVarsSrv.setGlobalVar('menuRole', null);

                    store.set('jwt', null);
                    store.set('rwt', null);
                    $http.defaults.headers.common.Authorization = 'Basic ';
                    $location.path('/login');
                };

                service.CheckCredentials = function () {
                    var idToken = store.get('jwt') && store.get('jwt').token != 'undefined' ? store.get('jwt').token : null;
                    var rfToken = store.get('rwt') && store.get('rwt').token != 'undefined' ? store.get('rwt').token : null;

                    if (!idToken || jwtHelper.isTokenExpired(idToken)) {
                        $location.path('/login');
                        return false;
                    } else {
                        var auth = {};
                        auth.username = jwtHelper.decodeToken(idToken).sub;
                        auth.authdata = jwtHelper.decodeToken(idToken);

                        $http({
                            method: 'GET',
                            url: './api/public/users/' + auth.authdata.roles[0].id + '/tms'

                        }).then(function successCallback(responseTm) {
                            auth.authdata.roles[0].tm = responseTm.data;
                            globalVarsSrv.setGlobalVar('auth', auth);
                            globalVarsSrv.setGlobalVar('token', auth.authdata);
                            if (auth.authdata.roles)
                                for (var i = 0; i < auth.authdata.roles[0].roles.length; i++) {
                                    if (auth.authdata.roles[0].roles[i].role === 'admin') {
                                        globalVarsSrv.setGlobalVar('menuRole', 'admin');
                                        break;
                                    } else {
                                        globalVarsSrv.setGlobalVar('menuRole', 'user');
                                        var url = $location.url();
                                        var routes = globalVarsSrv.getGlobalVar('homeButtonUserTableConf');
                                        var exist = false;
                                        if (routes) {
                                            for (i = 0; i < routes.length; i++) {
                                                if (url.indexOf(routes[i].column) >= 0) {
                                                    exist = true;
                                                }
                                            }
                                            if (!exist) $location.path('/home');
                                        }
                                    }
                                }
                        });
                        return jwtHelper.decodeToken(idToken).sub;
                    }
                };
                return service;
            }])

    .factory('Base64', function () {
        /* jshint ignore:start */

        var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        return {
            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);

                return output;
            },

            decode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    window.alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);
                return output;
            }
        };
        /* jshint ignore:end */
    });