'use strict';

angular.module('tweetabaseApp')
  .factory('user', ['$q', '$http', '$rootScope', 'localStorageService', function ($q, $http, $rootScope, localStorageService) {

    // Public API

    var create = function(user, callback) {
      var cb = callback || angular.noop;
      // var deferred = $q.defer();

      if (user.email === undefined || user.email === null || user.password === undefined || user.password === null || user.email.trim().length === 0 || user.password.trim().length === 0 )  {
        return cb({message : 'Please provide Username and Password!'});
      }

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
              return cb({message : 'Oops!'});
            }
          });
        } else {
          ///duplicate username
          return cb({message : 'Username is already taken. Please try another one!'});
        }
      });

      // return deferred.promise;
    };

    var checkUsername = function(user, callback) {
      var cb = callback || angular.noop;
      // var deferred = $q.defer();
      ///Check username 
      $http.post('/api/checkUsername', {username: user.email}).success(function(response) {
        if (response.status === 'Ok'){
          return cb({status : 'Ok'});
        } else {
          return cb({message : 'Invalid handle. Please try another one!'});
        }
      });
      // return deferred.promise;
    };

    return {
      create: create,
      checkUsername: checkUsername
    };

  }]);
