"use strict";angular.module("DB").factory("DBService",["$http",function(e){var i={};return i.devices=function(i,o,a){e({method:a,url:"./ws/devices.php?usr="+i}).then(function(e){o(e)},function(e){o("fail"),console.log(e.status)})},i.apps=function(i,o,a){e({method:a,url:"./ws/apps.php?data="+i}).then(function(e){o(e)},function(e){o("fail"),console.log(e.status)})},i.options=function(i,o,a){var s="";switch(a){case"GET":s=i.user?"api/public/index.php/options/"+i.user:"api/public/index.php/options";break;case"PUT":case"DELETE":s="api/public/index.php/options/"+i.id;break;default:s="api/public/index.php/options"}var t=i;t.options=JSON.stringify(t.options),e({method:a,url:s,data:t}).then(function(e){o(e)},function(e){o("fail"),console.log(e.status)})},i.findAppRole=function(e){var i=null;switch(e){case"basket":i="lp4000_basket";break;case"kino":i="lp4000_kino";break;case"livescore":i="lp4000_livescore";break;case"synolikokouponi":i="lp4000_synoliko";break;case"nikitriastili":i="lp4000_nikitria";break;case"liveapodoseis":i="lp4000_apodoseis";break;case"numGames":i="lp4000_paixnidia";break;case"admin":i="agent";break;default:i=null}return i},i.getDefaultOptions=function(e){var i=[];return i.livescore={filters:{allFilter:!0,subAll:!0,liveFilter:!1,ftFilter:!1,susBlocked:!1,mineFilter:!1,apodoseisFilter:!1},alertOptions:{goals:!0,red:!0,cancel:!0,ft:!1,none:!1},ifSound:!0,ifViewMatchesActions:!0,showOddsColor:!1,matchTvSet:0,ifDiorg:!0,ifOdd:!0,ifShowNew:!0,livescoreHeaderVis:!0,livescoreHeader:{epwnymia:"To Πρακτορείο μου",paktorasText:"Κείμενο Πράκτορα"},ifFooter:!0,ifHeader:!0,restTextSize:1,delay:10,ftLeaveTime:5,notifDelay:20,visRows:15,goalDelay:5,matchesSetCoupon:"Όλο το Κουπόνι"},i.nikitriastili={},i.synolikokouponi={},i.kino={},i.basket={},i.liveapodoseis={},i.numGames={},i[e]},i}]);