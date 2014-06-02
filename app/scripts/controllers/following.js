'use strict';

angular.module('tweetabaseApp')
  .controller('FollowingCtrl', ['$scope', '$location', 'user', 'following', 'localStorageService', function ($scope, $location, user, following, localStorageService){

		var uid = localStorageService.get('uid');
		$scope.myFollowingList = [];
    $scope.user = {};
    $scope.message = null;
    $scope.oneAtATime = true;

		$scope.retrieveFollowing = function	() {
			$scope.myFollowingList = [];
			following.retrieveFollowing({
				uid: uid
			},	function(response)	{
        // console.log('/api/retrieveFollowing response: ' + JSON.stringify(response));
        if (response && response.status === 'Ok' && response.following !== undefined)	{
					$scope.myFollowingList = response.following;
        }
			});
		};

		$scope.retrieveFollowing();

    $scope.follow = function(form) {

    	//Cannot follow yourself
			if (uid === $scope.user.email)  {
				$scope.message = 'You cannot follow yourself!';
				$scope.user.email = '';
				return;
			}

			//Only allow unique followees
			for (var i = 0; i < $scope.myFollowingList.length; i++)  {
				if ($scope.myFollowingList[i].handle === $scope.user.email)  {
					$scope.message = 'You are already following ' + $scope.user.email + '!';
					$scope.user.email = '';
					return;
				}
			}

      $scope.submitted = true;
      
      if(form.$valid) {
        user.checkUsername({
          email: $scope.user.email
        }, function(response) {
					// console.log('user.checkUsername callback: ' + JSON.stringify(response));
					if (response && response.status === 'Ok') {
						var toFollow = $scope.user.email;
						$scope.myFollowingList.unshift({handle: toFollow, tweets:[]});
						// console.log($scope.myFollowingList);

						following.follow({
								uid: uid,
								followingList: $scope.myFollowingList,
								toFollow: toFollow
							}, function(fResponse)	{
								// console.log('following.follow callback: ' + JSON.stringify(fResponse));
								if (fResponse && fResponse.status === 'Ok') {
									$scope.message = 'You are now following ' + toFollow + '!';
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

		$scope.unfollow = function (index) {
			var toUnfollow = $scope.myFollowingList[index].handle;
			console.log(toUnfollow);
			$scope.myFollowingList.splice(index,1);
			following.unfollow({
					uid: uid,
					followingList: $scope.myFollowingList,
					toUnfollow: toUnfollow
				}, function(fResponse)	{
					// console.log('following.unfollow callback: ' + JSON.stringify(fResponse));
					$scope.message = 'You are no longer following ' + toUnfollow + '!';
				});
		};

		$scope.retrieveFolloweeTweets = function(index)	{
			var followee = $scope.myFollowingList[index];
			// console.log(followee);
			if (followee !== undefined && followee.tweets.length === 0)	{
				//retrieve followee's tweets

				following.retrieveFolloweeTweets({
					uid: followee.handle
				},	function(response)	{
	        if (response && response.status === 'Ok' && response.tweets !== undefined)	{
						followee.tweets = response.tweets;
	        }
	        // console.log($scope.myFollowingList);
				});

			}
		};

	}]);
