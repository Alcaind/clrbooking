angular.module("Users").controller("URolesController",["$scope","AuthenticationService","makeController","ClrStatusSrv",function(e,t,r,l){e.ctrl=r.n2nController("/users","roles",{comment:"",exp_dt:"",status:"0"}),e.ctrl.init(),e.statusOptions=l.getStatus("userRoleStatus")}]).directive("urTable",function(){return{restrict:"EA",templateUrl:"modules/users/uviews/urTable.html"}}).directive("evrTable",function(){return{restrict:"EA",templateUrl:"modules/users/uviews/evrTable.html"}}).directive("evRolesForm",function(){return{restrict:"EA",templateUrl:"modules/users/uviews/evRolesForm.html"}});