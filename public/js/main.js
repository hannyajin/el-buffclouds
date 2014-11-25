'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('app', [
  'ngRoute',

  'app.animations',
  'app.filters',

  'app.home',
  'app.login'
]).
config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
  $httpProvider.interceptors.push('AuthInterceptor');
}]);

app.constant('API_BASE', '/api/v1/');

app.factory('AuthToken', ['$window', function AuthTokenFactory($window) {
  var tokenKey = 'user-token';
  var storage = $window.localStorage;
  var cachedToken;
  return {
    isAuthenticated: isAuthenticated,
    setToken: setToken,
    getToken: getToken,
    clearToken: clearToken
  };

  function setToken(token) {
    cachedToken = token;
    storage.setItem(tokenKey, token);
  }
  function getToken() {
    if (!cachedToken) {
      cachedToken = storage.getItem(tokenKey);
    }
    return cachedToken;
  }
  function clearToken() {
    cachedToken = null;
    storage.removeItem(tokenKey);
  }
  function isAuthenticated() {
    return !!getToken();
  }
}]);

app.factory('AuthInterceptor', ['$rootScope', '$q', 'AuthToken', function($rootScope, $q, AuthToken) {
  return {
    request: function(config) {
      var token = AuthToken.getToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    },
    response: function(response) {
      if (response.status === 401) {
        console.warn('user not authenticated', response);
        // TODO handle non auth user
      }
      return response || $q.when(response);
    }
  };
}]);

app.factory('utils', [function utilFactory() {
  var animEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

  var $ = angular.element;

  function animate(el, cls) {
    $(el).addClass(cls).one(animEnd, function() {
      $(this).removeClass(cls);
    })
  };

  return {
    animate: animate
  };
}]);

app.factory('content', [function contentFactory() {
  var title = 'Buffclouds';

  var client = null;

  var nav = {
    links: [{
      href: '/#',
      text: 'Home'
    },{
      href: '/#',
      text: 'About'
    },{
      href: '/#',
      text: 'Contact'
    }]
  };

  return {
    title: title,
    nav: nav,
    client: client
  };
}]);

app.controller('MainCtrl', ['$scope', '$http', 'API_BASE', '$timeout', 'AuthToken', '$window',
  function MainCtrl($scope, $http, API_BASE, $timeout, AuthToken, $window) {

    $scope.login = function(username, password) {
      $scope.badCreds = false;
      $http({
        url: API_BASE + 'login',
        method: 'POST',
        data: {
          username: username,
          password: password
        }
      }).then(function success(res) {
        AuthToken.setToken(res.data.token);
        $scope.user = res.data.user;
        $scope.alreadyLoggedIn = true;
        showAlert('success', 'Logged in successfully!','Welcome ' + $scope.user.username + '!');
      }, function error(res) {
        if (res.status === 404) {
          $scope.badCreds = true;
          showAlert('danger', 'Authentication Failed.', 'Check your credentials.');
        } else {
          showAlert('danger', 'Login Error', 'Something went wrong with the login.');
        }
      })
    };

    $scope.logout = function() {
      AuthToken.clearToken();
      $scope.user = null;
      showAlert('info', 'Bye~');
    };

    // Show Alert
    var alertTimeout;
    function showAlert(type, title, message, timeout) {
      $scope.alert = {
        hasBeenShown: true,
        show: true,
        type: type,
        message: message,
        title: title
      };
      $timeout.cancel(alertTimeout);
      alertTimeout = $timeout(function() {
        $scope.alert.show = false;
      }, timeout || 1500);
    };
}])