angular.module("myCtrlModule", [])
.controller("MyCtrl",["$scope", "Calculations" ,function($scope, Calculations){
  $scope.myObj = {};
  $scope.myObj.title = "Main Page";
  $scope.myObj.substitle = "Sub title";
  $scope.myObj.firstname = "Thomas";
  $scope.myObj.lastname = "Brown";

  $scope.myObj.bindOutput = 2;
  $scope.timesTwo = function(){
    $scope.myObj.bindOutput = Calculations.timesTwo($scope.myObj.bindOutput);
  }

}])
.directive("welcomeMessage", function(){
  return{
    restrict: "AE",
    template: "<div>How are you?</div>"
  }
})
.factory("Calculations", function(){
    var  calculations = {};

    calculations.timesTwo = function(a){
      return a*2;
    };

    calculations.pythagoreanTheorem = function(a,b){
      return (a*a)+(b*b);
    }

    return calculations;
})
.controller("MyCtrl1", ["$scope", function($scope){
  $scope.seconPage = "This is the second page";
}])
;
