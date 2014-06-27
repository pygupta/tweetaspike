'use strict';

angular.module('tweetabaseApp')
  .factory('auth', ['$q', '$http', '$rootScope', 'localStorageService', function ($q, $http, $rootScope, localStorageService) {

    // Public API

    var login = function(user,callback) {
      var cb = callback || angular.noop;
      // var deferred = $q.defer();

      // console.log(user.email + '...' + user.password);
      $rootScope.currentUser = null;

      $http.post('/api/checkUsername', {username: user.email}).success(function(uResponse) {
        // console.log('/api/checkUsername uResponse: ' + JSON.stringify(uResponse));
        if (uResponse.status === 'Ok'){
          user.uid = uResponse.uid;
          var authKey = 'auth';
          var uidKey = 'uid';
          $http.post('/api/checkPassword', {uid: uResponse.uid, password: user.password}).success(function(pResponse) {
            // console.log('/api/checkPassword pResponse: ' + JSON.stringify(pResponse));
            if (pResponse.status === 'Ok'){
              localStorageService.set(uidKey,uResponse.uid);
              localStorageService.set(authKey,pResponse.auth);
              user.auth = pResponse.auth;
              $rootScope.currentUser = user;
              return cb({status : 'Ok'});
            } else {
              return cb();
            }
          });
        } else {
          return cb();
        }
      });

      // return deferred.promise;
    };

    var logout = function(callback) {
      var cb = callback || angular.noop;
      var authKey = 'auth';
      var uidKey = 'uid';
      localStorageService.set(uidKey,null);
      localStorageService.set(authKey,null);
      $rootScope.currentUser = null;
      return cb();
    };

    var isLoggedIn = function() {
      var authKey = localStorageService.get('auth');
      // console.log(authKey);
      if (authKey === null || authKey === undefined)  {
        return false;
      }
      return true;
    };

    return {
      login: login,
      logout: logout,
      isLoggedIn: isLoggedIn
    };

  }]);
