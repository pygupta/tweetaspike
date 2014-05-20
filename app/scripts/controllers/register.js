'use strict';

angular.module('tweetabaseApp')
  .controller('RegisterCtrl', ['$scope', '$location', 'user',  function ($scope, $location, user) {
    $scope.user = {};
    $scope.errors = null;

    $scope.register = function(form) {
      $scope.submitted = true;
      
      if(form.$valid) {
        user.create({
          email: $scope.user.email,
          password: $scope.user.password
        }, function(response) {
					// console.log('auth.login callback: ' + JSON.stringify(response));
					if (response && response.status === 'Ok') {
						$location.path('/home');
					} else {
	          $scope.errors = response.message;
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

    $scope.batchCreate = function() {
      for (var i = 1; i < 10000; i++) {
        user.create({
          email: 'usr'+i,
          password: 'usr'+i
        }, function() {
          // console.log('batchCreate: ' + i + ' ' + JSON.stringify(response));
        });
      }
    };

//    $scope.batchCreate();

  }]);