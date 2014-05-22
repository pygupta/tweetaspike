'use strict';

angular.module('tweetabaseApp')
  .controller('FollowingCtrl', ['$scope', '$location', 'user', 'following', 'localStorageService', function ($scope, $location, user, following, localStorageService){

		var uid = localStorageService.get('uid');
		$scope.myFollowingList = [];
    $scope.user = {};
    $scope.message = null;

		$scope.retrieveFollowing = function	() {
			following.retrieveFollowing({
				uid: uid
			},	function(response)	{
        // console.log('/api/retrieveFollowing response: ' + JSON.stringify(response));
        if (response && response.status === 'Ok' && response.following !== undefined)	{
					// console.log(response.following);
					$scope.myFollowingList = response.following;
        }
        console.log($scope.myFollowingList);
			});
		};

		$scope.retrieveFollowing();

    $scope.checkUsername = function(form) {
      $scope.submitted = true;
      
      if(form.$valid) {
        user.checkUsername({
          email: $scope.user.email
        }, function(response) {
					console.log('user.checkUsername callback: ' + JSON.stringify(response));
					if (response && response.status === 'Ok') {

						///TODO: only allow unique followers

						var newFollowing = $scope.user.email;
						$scope.myFollowingList.unshift(newFollowing);
						
						following.follow({
								uid: uid,
								followingList: $scope.myFollowingList
							}, function(fResponse)	{
								// console.log('following.follow callback: ' + JSON.stringify(fResponse));
								if (fResponse && fResponse.status === 'Ok') {
									$scope.message = 'You are now following ' + newFollowing + '!';
									$scope.user.email = '';
								}
								else	{
									$scope.message = fResponse.message;
								}

							});

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
