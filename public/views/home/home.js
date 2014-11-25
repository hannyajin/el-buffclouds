'use strict';

angular.module('app.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: 'views/home/home.html',
      controller: 'homeCtrl'
    });
}])

.controller('homeCtrl', ['content', '$scope', function(content, $scope) {
}]);