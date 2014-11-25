'use strict';

angular.module('app')
  .controller('footerCtrl', ['content', '$scope', function(contentFactory, $scope) {
    var links = [{
      href: '#',
      text: 'Link1'
    },{
      href: '#',
      text: 'Link2'
    },{
      href: '#',
      text: 'Link3'
    }];

    var footer = {
      links: links
    }

    $scope.footer = footer;
}]);
