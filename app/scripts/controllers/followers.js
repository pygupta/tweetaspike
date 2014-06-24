'use strict';

angular.module('tweetabaseApp')
  .controller('FollowersCtrl', ['$scope', '$location', 'user', 'followers', 'localStorageService', '$modal', 'following', function ($scope, $location, user, followers, localStorageService, $modal, following){

		var uid = localStorageService.get('uid');
		var modalInstance = null;
		$scope.myFollowersList = [];
		$scope.myFollowingList = [];
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

		$scope.followConfirmation = function (index) {
			$scope.toFollowIndex = index;
			$scope.toFollow = $scope.myFollowersList[$scope.toFollowIndex].handle;
			modalInstance = $modal.open({
				templateUrl: 'partials/confirmation_modal.html',
				controller: 'ConfirmationModalInstanceCtrl',
				backdrop: true,
				resolve: {
					options: function()	{
						return {header: 'Follow ' + $scope.toFollow, body: 'Are you sure you want to follow ' + $scope.toFollow + '?', parent: $scope, fn: '$scope.options.parent.follow("'+$scope.toFollow+'")'};
					},
				}
			});
		};

		$scope.follow = function (toFollow) {
			$scope.myFollowingList.unshift({handle: toFollow, tweets:[]});
			following.follow({
					uid: uid,
					followingList: $scope.myFollowingList,
					toFollow: toFollow
				}, function(fResponse)	{
					// console.log('following.follow callback: ' + JSON.stringify(fResponse));
				});
		};

	}]);

angular.module('tweetabaseApp')
  .controller('ConfirmationModalInstanceCtrl', ['$scope', '$modalInstance', 'options', function ($scope, $modalInstance, options){
		$scope.options = options;

	  $scope.yes = function () {
			$modalInstance.close();
			if ($scope.options.fn !== undefined)	{
				eval($scope.options.fn);
			}
	  };

	  $scope.no = function () {
	    $modalInstance.dismiss('cancel');
		};
	}]);
