'use strict';

angular.module('app.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/login', {
      templateUrl: 'views/login/login.html',
      controller: 'loginCtrl'
    });
}])

.controller('loginCtrl', ['content', '$scope', 'utils', function(content, $scope, util) {
  $scope.login = function() {
    console.log("Logging in!");
    util.animate($('.form-wrap'), 'animated shake');
  }

  $scope.forgot = function() {
    console.log("Click");
    $('#forget-modal').fadeIn();
    return false;
  };

  $scope.recovery = function() {
    console.log("Send Password");
    $('#forget-modal').fadeOut();
  };

  $scope.cancel = function() {
    $('#forget-modal').fadeOut();
  };

  $scope.close = function() {
    $('#forget-modal').fadeOut();
  };
}]);