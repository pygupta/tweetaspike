'use strict';

angular.module('tweetabaseApp')
  .controller('MainCtrl', ['$scope', 'localStorageService', '$http', 'socket', '$modal', 'following', function ($scope, localStorageService, $http, socket, $modal, following) {

		var uid = localStorageService.get('uid');
		var modalInstance = null;
		$scope.myFollowingList = [];
		$scope.myTweets = [];

		$scope.retrieveTweets = function	() {
      $http.post('/api/jretrieveTweets', {uid: uid}).success(function(response) {
        console.log('/api/jretrieveTweets response: ' + JSON.stringify(response));
        if (response.status === 'Ok')	{
					// console.log(response.tweets);
					$scope.myTweets = response.tweets;
        }
      });
		};

		$scope.retrieveTweets();

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

		// $watch listener to watch for changes in the value of $scope.myTweets. If a tweet is added or removed, trigger db sync'd
		$scope.$watch('myTweets', function () {
		}, true);

		$scope.addTweet = function () {
			var tweetObject = {tweet: $scope.myTweet, ts: new Date()};
			$scope.myTweets.unshift(tweetObject);
			$scope.myTweet = '';
      $http.post('/api/updateTweets', {uid: uid, tweets: $scope.myTweets}).success(function(response) {
        // console.log('/api/updateTweets response: ' + JSON.stringify(response));
      });
      //this delegates to the Socket.IO client API emit method and sends our message
      //see server.js for the listener
      socket.emit('tweet',{uid: uid, tweet: tweetObject.tweet});
		};

		$scope.removeTweet = function (index) {
			$scope.myTweets.splice(index,1);
      $http.post('/api/updateTweets', {uid: uid, tweets: $scope.myTweets}).success(function(response) {
        // console.log('/api/updateTweets response: ' + JSON.stringify(response));
      });
		};

		$scope.$on('socket:broadcast', function (event,data) {
			// console.log(event.name);
			var showTweet = false;
			//check if the new tweet is from a user that current user is following. if so, show alert
			for (var i = 0; i < $scope.myFollowingList.length; i++)  {
				if ($scope.myFollowingList[i].handle === data.uid)  {
					showTweet = true;
					break;
				}
			}

			if (showTweet)	{
				modalInstance = $modal.open({
					templateUrl: 'partials/info_modal.html',
					controller: 'InfoModalInstanceCtrl',
					backdrop: true,
					resolve: {
						options: function()	{
							return {header: data.uid + ' just tweetaspike\'d', body: data.tweet};
						}
					}
				});
			}
		});

  }]);

angular.module('tweetabaseApp')
  .controller('InfoModalInstanceCtrl', ['$scope', '$modalInstance', 'options', function ($scope, $modalInstance, options){
		$scope.options = options;

	  $scope.ok = function () {
	    $modalInstance.close();
		};
	}]);
