"use strict";angular.module("MainComponents").factory("ClrStatusSrv",function(t){function e(t){return o[t]}var o={};return t.get("config/appConfig.json").then(function(t){o=t.data},function(t){console.log(t|JSON)}),{getStatus:e}}).directive("statusSelector",function(){return{restrict:"EA",scope:{statusTitle:"@",options:"@",outputValue:"="},controller:"statusSelectorController",templateUrl:"modules/mainComponents/views/statusSelector.html"}}).controller("statusSelectorController",function(t,e){t.optStatus=e.getStatus(t.options)}).factory("ClrFormItemSrv",function(t){function e(t){return o[t]}function e(){t.apiCall("GET",ctrl.baseURL,function(t){return t.data})}var o={};return{getFormItem:e}}).directive("formItemSelector",function(){return{restrict:"EA",scope:{selectorTitle:"@",outputValue:"=",searchable:"<",aletrText:"@",dp:"=",viewColumn:"@",returnColumn:"@"},controller:"FormItemSelectorController",templateUrl:"modules/mainComponents/views/formItemSelector.html"}}).controller("FormItemSelectorController",function(t){t.dp=[],t.myfilter=[],t.dataFilter=function(e){return function(o){return o.id===t.outputValue||(!e||(o[t.viewColumn]+"").indexOf(e)>=0)}}});