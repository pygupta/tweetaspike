'use strict';

angular.module('tweetabaseApp')
  .controller('LoginCtrl', ['$scope', '$location', 'auth',  function ($scope, $location, auth) {
    $scope.user = {};
    $scope.errors = null;

    $scope.login = function(form) {
      $scope.submitted = true;
      
      if(form.$valid) {
        auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        }, function(response) {
					// console.log('auth.login callback: ' + JSON.stringify(response));
					if (response && response.status === 'Ok') {
						$location.path('/home');
					} else {
	          $scope.errors = 'Invalid Credentials. Please try again!';
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

    $scope.signInUsingTwitter = function()  {
      auth.signInUsingTwitter({
      }, function(response) {
      });
    };
  }]);