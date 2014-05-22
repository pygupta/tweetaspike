'use strict';

angular.module('tweetabaseApp')
  .factory('following', ['$q', '$http', function ($q, $http) {

    // Public API

    var retrieveFollowing = function(user, callback) {
      var cb = callback || angular.noop;
      // var deferred = $q.defer();

			$http.post('/api/retrieveFollowing', {uid: user.uid}).success(function(response) {
				if (response.status === 'Ok'){
					return cb({status : 'Ok', following: response.following});
				} else {
					return cb();
			  }
			});

      // return deferred.promise;
    };

    var follow = function(user, callback) {
      var cb = callback || angular.noop;
      // var deferred = $q.defer();

			$http.post('/api/updateFollowing', {uid: user.uid, following: user.followingList, toFollow: user.toFollow}).success(function(response) {
				if (response.status === 'Ok'){
					return cb({status : 'Ok', following: response.following});
				} else {
					return cb();
			  }
			});

      // return deferred.promise;
    };

    var unfollow = function(user, callback) {
      var cb = callback || angular.noop;
      // var deferred = $q.defer();

			$http.post('/api/updateFollowing', {uid: user.uid, following: user.followingList, toUnfollow: user.toUnfollow}).success(function(response) {
				if (response.status === 'Ok'){
					return cb({status : 'Ok', following: response.following});
				} else {
					return cb();
			  }
			});

      // return deferred.promise;
    };

    return {
      retrieveFollowing: retrieveFollowing,
      follow: follow,
      unfollow: unfollow
    };

  }]);
