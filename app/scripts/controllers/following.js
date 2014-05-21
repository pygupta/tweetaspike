'use strict';

angular.module('tweetabaseApp')
  .controller('FollowingCtrl', ['$scope', '$location', 'user',  function ($scope, $location, user){
    $scope.user = {};
    $scope.message = null;

    $scope.checkUsername = function(form) {
      $scope.submitted = true;
      
      if(form.$valid) {
        user.checkUsername({
          email: $scope.user.email
        }, function(response) {
					// console.log('auth.login callback: ' + JSON.stringify(response));
					if (response && response.status === 'Ok') {
	          $scope.message = 'You are now following ' + $scope.user.email + '!';
					} else {
	          $scope.message = response.message;
					}
        });
        // .then( function() {
          // Logged in, redirect to home
          // $location.path('/');
        // })
        // .catch( function(err) {
          // err = err.data;
          // $scope.errors.other = err.message;
        // });
      }
    };

	}]);
