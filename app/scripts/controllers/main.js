'use strict';

angular.module('tweetabaseApp')
  .controller('MainCtrl', ['$scope', 'localStorageService', '$http', function ($scope, localStorageService, $http) {

		var uid = localStorageService.get('uid');
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

		// $watch listener to watch for changes in the value of $scope.myTweets. If a tweet is added or removed, trigger db sync'd
		$scope.$watch('myTweets', function () {
		}, true);

		$scope.addTweet = function () {
			$scope.myTweets.unshift($scope.myTweet);
			$scope.myTweet = '';
      $http.post('/api/updateTweets', {uid: uid, tweets: $scope.myTweets}).success(function(response) {
        // console.log('/api/updateTweets response: ' + JSON.stringify(response));
      });
		};

		$scope.removeTweet = function (index) {
			$scope.myTweets.splice(index,1);
      $http.post('/api/updateTweets', {uid: uid, tweets: $scope.myTweets}).success(function(response) {
        // console.log('/api/updateTweets response: ' + JSON.stringify(response));
      });
		};

  }]);
