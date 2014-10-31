'use strict';

angular.module('tweetabaseApp')
  .factory('admin', ['$q', '$http', function ($q, $http) {

    // Public API

    var retrieveStats = function(callback) {
      var cb = callback || angular.noop;
      // var deferred = $q.defer();

			$http.post('/api/retrieveStats').success(function(response) {
				if (response.status === 'Ok'){
					return cb({status : 'Ok', stats: response.stats});
				} else {
					return cb();
			  }
			});

      // return deferred.promise;
    };

    return {
      retrieveStats: retrieveStats
    };

  }]);