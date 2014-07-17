'use strict';

angular.module('tweetabaseApp')
  .controller('MainCtrl', ['$scope', 'localStorageService', '$http', 'socket', '$modal', 'following', function ($scope, localStorageService, $http, socket, $modal, following) {

		var uid = localStorageService.get('uid');
		var modalInstance = null;
		$scope.myFollowingList = [];
		$scope.myTweets = [];

		$scope.retrieveTweets = function	() {
      $http.post('/api/retrieveTweets', {uid: uid}).success(function(response) {
        // console.log('/api/retrieveTweets response: ' + JSON.stringify(response));
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

		$scope.addTweet = function () {
			$scope.errors = '';

      if ($scope.myTweet === undefined || $scope.myTweet.trim().length === 0)  {
				$scope.errors = 'Please enter what would you like to tweetaspike';
        return;
      }

			var tweetObject = {tweet: $scope.myTweet, ts: new Date()};
			$scope.myTweets.unshift(tweetObject);
			$scope.myTweet = '';
      $http.post('/api/updateTweets', {uid: uid, tweets: $scope.myTweets}).success(function(response) {
        // console.log('/api/updateTweets response: ' + JSON.stringify(response));
      });
      //this delegates to the Socket.IO client API emit method and sends the post
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

		// auto-tweet from one of the users you are following
		$scope.init = function() {
			tweetInterval = setInterval(function()	{
				console.log('hello');
				// console.log($scope.myFollowingList);

				if ($scope.myFollowingList.length > 0)	{
					var randomTweets = ['For just $1 you get a half price download of half of the song and listen to it just once.','People tell me my body looks like a melted candle','Come on movie! Make it start!','Byaaaayy','Please, please, win! Meow, meow, meow!','Put. A. Bird. On. It.','A weekend wasted is a weekend well spent','Would you like to super spike your meal?','We have a mean no-no-bring-bag up here on aisle two.','SEEK: See, Every, EVERY, Kind... of spot','We can order that for you. It will take a year to get there.','If you are pregnant, have a soda.','Hear that snap? Hear that clap?','Follow me and I may follow you','Which is the best cafe in Portland? Discuss...','Portland Coffee is for closers!','Lets get this party started!','How about them portland blazers!','I love animals','I love my dog','What\'s up Portland','Which is the best cafe in Portland? Discuss...','I dont always tweet, but when I do it is on Tweetaspike'];
					var totalUsers = $scope.myFollowingList.length;
					var totalTweets = randomTweets.length;
					var followingUID;
					var randomTweet;

					followingUID = $scope.myFollowingList[Math.floor((Math.random() * (totalUsers - 1)) + 0)].handle;
					randomTweet = randomTweets[Math.floor((Math.random() * (totalTweets - 1)) + 0)];

		      $http.post('/api/createTweet', {uid: followingUID, tweet: randomTweet}).success(function(response) {
		        // console.log('/api/createTweet response: ' + JSON.stringify(response));
		      });
		      //this delegates to the Socket.IO client API emit method and sends the post
		      //see server.js for the listener
		      socket.emit('tweet',{uid: followingUID, tweet: randomTweet});
				}

			}, 30000);
		};

  }]);

angular.module('tweetabaseApp')
  .controller('InfoModalInstanceCtrl', ['$scope', '$modalInstance', 'options', function ($scope, $modalInstance, options){
		$scope.options = options;

	  $scope.ok = function () {
	    $modalInstance.close();
		};
	}]);
