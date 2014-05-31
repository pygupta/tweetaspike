'use strict';

angular.module('tweetabaseApp')
  .controller('FollowersCtrl', ['$scope', '$location', 'user', 'followers', 'localStorageService', function ($scope, $location, user, followers, localStorageService){

		var uid = localStorageService.get('uid');
		$scope.myFollowersList = [];
    $scope.message = null;
    $scope.oneAtATime = true;

		$scope.retrieveFollowers = function	() {
			followers.retrieveFollowers({
				uid: uid
			},	function(response)	{
        // console.log('/api/retrieveFollowers response: ' + JSON.stringify(response));
        if (response && response.status === 'Ok' && response.followers !== undefined)	{
					// console.log(response.followers);
					angular.forEach(response.followers, function(value) {
						// console.log(value);
						$scope.myFollowersList.push({handle: value, tweets: []});
					});
        }
        // console.log($scope.myFollowersList);
			});
		};

		$scope.retrieveFollowers();

		$scope.retrieveFollowerTweets = function(index)	{
			var follower = $scope.myFollowersList[index];
			// console.log(follower);
			if (follower !== undefined && follower.tweets.length === 0)	{
				//retrieve follower's tweets

				followers.retrieveFollowerTweets({
					uid: follower.handle
				},	function(response)	{
	        if (response && response.status === 'Ok' && response.tweets !== undefined)	{
						follower.tweets = response.tweets;
	        }
	        // console.log($scope.myFollowersList);
				});

			}
		};

	}]);
