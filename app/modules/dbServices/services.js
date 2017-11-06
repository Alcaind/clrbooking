'use strict';

angular.module('DB')

    .factory('DBService', ['$http',
        function ($http) {
            var service = {};

            service.devices = function (username, callback, method) {
                $http({method: method, url: './ws/devices.php?usr=' + username}).then(function (response) {
                    callback(response);
                }, function (response) {
                    callback('fail');
                    console.log(response.status);
                });
            };

            service.apps = function (data, callback, method) {
                $http({method: method, url: './ws/apps.php?data=' + data}).then(function (response) {
                    callback(response);
                }, function (response) {
                    callback('fail');
                    console.log(response.status);
                });
            };


            service.options = function (data, callback, method) {
                var url = '';
                switch (method) {
                    case 'GET' :
                        if (data.user) {
                            url = 'api/public/index.php/options/' + data.user;
                        } else {
                            url = 'api/public/index.php/options';
                        }
                        break;
                    case 'PUT' :
                        url = 'api/public/index.php/options/' + data.id;
                        break;
                    case 'DELETE' :
                        url = 'api/public/index.php/options/' + data.id;
                        break;
                    default :
                        url = 'api/public/index.php/options';
                }
                var transform = data;
                transform.options = JSON.stringify(transform.options);

                $http({
                    method: method,
                    url: url,
                    data: transform
                }).then(function (response) {
                    callback(response);
                }, function (response) {
                    callback('fail');
                    console.log(response.status);
                });
            };

            service.findAppRole = function ($app) {
                var $approle = null;
                switch ($app) {
                    case 'basket':
                        $approle = 'lp4000_basket';
                        break;
                    case 'kino':
                        $approle = 'lp4000_kino';
                        break;
                    case 'livescore':
                        $approle = 'lp4000_livescore';
                        break;
                    case 'synolikokouponi':
                        $approle = 'lp4000_synoliko';
                        break;
                    case 'nikitriastili':
                        $approle = 'lp4000_nikitria';
                        break;
                    case 'liveapodoseis':
                        $approle = 'lp4000_apodoseis';
                        break;
                    case 'numGames':
                        $approle = 'lp4000_paixnidia';
                        break;
                    case 'admin':
                        $approle = 'agent';
                        break;
                    default:
                        $approle = null;
                }

                return $approle;
            };

            service.getDefaultOptions = function (app) {
                var defaultOptions = [];
                defaultOptions['livescore'] = {
                    filters: {
                        allFilter: true,
                        subAll: true,
                        liveFilter: false,
                        ftFilter: false,
                        susBlocked: false,
                        mineFilter: false,
                        apodoseisFilter: false
                    },
                    alertOptions: {goals: true, red: true, cancel: true, ft: false, none: false},
                    ifSound: true,
                    ifViewMatchesActions: true,
                    showOddsColor: false,
                    matchTvSet: 0,
                    ifDiorg: true,
                    ifOdd: true,
                    ifShowNew: true,
                    livescoreHeaderVis: true,
                    livescoreHeader: {epwnymia: 'To Πρακτορείο μου', paktorasText: 'Κείμενο Πράκτορα'},
                    ifFooter: true,
                    ifHeader: true,
                    restTextSize: 1,
                    delay: 10,
                    ftLeaveTime: 5,
                    notifDelay: 20,
                    visRows: 15,
                    goalDelay: 5,
                    matchesSetCoupon: "Όλο το Κουπόνι"
                };
                defaultOptions['nikitriastili'] = {};
                defaultOptions['synolikokouponi'] = {};
                defaultOptions['kino'] = {};
                defaultOptions['basket'] = {};
                defaultOptions['liveapodoseis'] = {};
                defaultOptions['numGames'] = {};

                return defaultOptions[app];
            };

            return service;
        }])
;