'use strict';

var app = angular.module('app')
.controller('headerCtrl', ['content', '$scope', 'AuthToken', function(content, $scope, AuthToken) {
  $scope.nav = content.nav;
  $scope.at = AuthToken;
}]);
