'use strict';

angular.module('tweetabaseApp')
  .factory('user', ['$q', '$http', '$rootScope', 'localStorageService', function ($q, $http, $rootScope, localStorageService) {

    // Public API

    var create = function(user, callback) {
      var cb = callback || angular.noop;
      // var deferred = $q.defer();

      ///Check username uniqueness
      $http.post('/api/checkUsername', {username: user.email}).success(function(response) {
        if (response.status !== 'Ok'){
          user.uid = user.email;
          user.auth = UUID.generate();
          $http.post('/api/createUser', {uid: user.uid, username: user.email, password: user.password, auth: user.auth}).success(function(uResponse) {
            // console.log('/api/createUser uResponse: ' + JSON.stringify(uResponse));
            if (uResponse.status === 'Ok'){
              localStorageService.set('uid',user.uid);
              localStorageService.set('auth',user.auth);
              $rootScope.currentUser = user;
              return cb({status : 'Ok'});
            } else {
              return cb();
            }
          });
        } else {
          ///duplicate username
          return cb({message : 'Username is alreay taken. Please try again!'});
        }
      });

      // return deferred.promise;
    };

    return {
      create: create
    };

  }]);
