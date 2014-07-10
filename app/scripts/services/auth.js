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

    var signInUsingTwitter = function(callback)  {
      // var cb = callback || angular.noop;
      // var consumerKey = 'ftnKzORzC5iHFFX7cMnQhGYYx';
      // var consumerSecret = 's1AaZpzAEAOrJ8PU774y1fpHwd2Thf3YQ7Ij8Ujnb91I9G7dNR';
      // var credentials = Base64.encode(consumerKey + ':' + consumerSecret);
      // var authorization = 'OAuth oauth_callback="http%3A%2F%2Fwww.tweetaspike.com%2Fhome%2F",oauth_consumer_key="ftnKzORzC5iHFFX7cMnQhGYYx",oauth_nonce="s1AaZpzAEAOrJ8PU774y1fpHwd2Thf3YQ7Ij8Ujnb91I9G7dNR",oauth_signature="F1Li3tvehgcraF8DMJ7OyxO4w9Y%3D",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1318467427",oauth_version="1.0"';

      // $http.post('https://api.twitter.com/oauth/request_token', {headers: {'Authorization': authorization, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}}).success(function(response) {
      //   console.log('/api/signInUsingTwitter response: ' + JSON.stringify(response));
      //   if (response.status === 'Ok'){
      //   } else {
      //     return cb();
      //   }
      // });
    };

    return {
      login: login,
      logout: logout,
      isLoggedIn: isLoggedIn,
      signInUsingTwitter: signInUsingTwitter
    };

  }]);
