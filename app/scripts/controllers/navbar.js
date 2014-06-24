'use strict';

angular.module('tweetabaseApp')
  .controller('NavbarCtrl', ['$scope', '$location', 'auth', 'localStorageService', 'socket', function ($scope, $location, auth, localStorageService, socket) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/home',
      'onclick': ''
    }, {
      'title': 'Following',
      'link': '/following',
      'onclick': ''
    }, {
      'title': 'Followers',
      'link': '/followers',
      'onclick': ''
    }, {
      'title': 'Logout',
      'link': '',
      'onclick': 'logout()'
    }];

    $scope.uid = localStorageService.get('uid');
    
    $scope.logout = function() {
      auth.logout(function()	{
				// console.log(response);
        $location.path('/login');
      });
      // .then(function() {
        // $location.path('/login');
      // });
    };
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.$on('socket:broadcast', function (event,data) {
      console.log(data.tweet);
    });

  }]);