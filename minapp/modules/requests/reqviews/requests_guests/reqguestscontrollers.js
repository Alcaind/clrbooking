"use strict";angular.module("Requests").controller("ReqGuestsController",["$scope","AuthenticationService","makeController","globalVarsSrv","$routeParams",function(e,r,t,s,o){e.ctrl=t.mainController("/requests/"+o.id+"/guests","reqguestsTableConf","Συμμετέχοντες"),e.ctrl.init()}]).controller("ReqGuestsProfileController",["$scope","AuthenticationService","makeController","globalVarsSrv","$routeParams","api",function(e,r,t,s,o,l){e.ctrl=t.profileController("/requests/guests","reqguestsTableConf"),e.ctrl.init(),e.ctrl.item.req_id=o.rid}]).component("reqGuestsProfile",{restrict:"EA",templateUrl:"modules/requests/reqviews/requests_guests/requestsguestsviews/profile.html",scope:{method:"="},controller:"ReqGuestsProfileController"});