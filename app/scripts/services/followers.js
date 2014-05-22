'use strict';

angular.module('tweetabaseApp')
	.factory('followers', ['$q', '$http', function ($q, $http) {

		// Public API

		var retrieveFollowers = function(user, callback) {
			var cb = callback || angular.noop;
			// var deferred = $q.defer();

			$http.post('/api/retrieveFollowers', {uid: user.uid}).success(function(response) {
				if (response.status === 'Ok'){
					return cb({status : 'Ok', followers: response.followers});
				} else {
					return cb();
				}
			});

			// return deferred.promise;
		};

		var add = function(user, callback) {
			var cb = callback || angular.noop;
			// var deferred = $q.defer();

			$http.post('/api/updateFollowers', {uid: user.uid, followers: user.followersList}).success(function(response) {
				if (response.status === 'Ok'){
					return cb({status : 'Ok', followers: response.followers});
				} else {
					return cb();
				}
			});

			// return deferred.promise;
		};

		var remove = function(index)	{
			console.log('remove follower ' + index);
			///TODO
		};

		var showTweets = function(index)	{
			console.log('show tweets for ' + index);
			///TODO
		};

		return {
			retrieveFollowers: retrieveFollowers,
			add: add,
			remove: remove,
			showTweets: showTweets
		};

	}]);
