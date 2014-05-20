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



  // .factory('Auth', function Auth($location, $rootScope, Session, User, $cookieStore) {
    
  //   // Get currentUser from cookie
  //   $rootScope.currentUser = $cookieStore.get('user') || null;
  //   $cookieStore.remove('user');

  //   return {

  //     /**
  //      * Authenticate user
  //      * 
  //      * @param  {Object}   user     - login info
  //      * @param  {Function} callback - optional
  //      * @return {Promise}            
  //      */
  //     login: function(user, callback) {
  //       var cb = callback || angular.noop;

  //       return Session.save({
  //         email: user.email,
  //         password: user.password
  //       }, function(user) {
  //         $rootScope.currentUser = user;
  //         return cb();
  //       }, function(err) {
  //         return cb(err);
  //       }).$promise;
  //     },

  //     /**
  //      * Unauthenticate user
  //      * 
  //      * @param  {Function} callback - optional
  //      * @return {Promise}           
  //      */
  //     logout: function(callback) {
  //       var cb = callback || angular.noop;

  //       return Session.delete(function() {
  //           $rootScope.currentUser = null;
  //           return cb();
  //         },
  //         function(err) {
  //           return cb(err);
  //         }).$promise;
  //     },

  //     *
  //      * Create a new user
  //      * 
  //      * @param  {Object}   user     - user info
  //      * @param  {Function} callback - optional
  //      * @return {Promise}            
       
  //     createUser: function(user, callback) {
  //       var cb = callback || angular.noop;

  //       return User.save(user,
  //         function(user) {
  //           $rootScope.currentUser = user;
  //           return cb(user);
  //         },
  //         function(err) {
  //           return cb(err);
  //         }).$promise;
  //     },

  //     /**
  //      * Change password
  //      * 
  //      * @param  {String}   oldPassword 
  //      * @param  {String}   newPassword 
  //      * @param  {Function} callback    - optional
  //      * @return {Promise}              
  //      */
  //     changePassword: function(oldPassword, newPassword, callback) {
  //       var cb = callback || angular.noop;

  //       return User.update({
  //         oldPassword: oldPassword,
  //         newPassword: newPassword
  //       }, function(user) {
  //         return cb(user);
  //       }, function(err) {
  //         return cb(err);
  //       }).$promise;
  //     },

  //     /**
  //      * Gets all available info on authenticated user
  //      * 
  //      * @return {Object} user
  //      */
  //     currentUser: function() {
  //       return User.get();
  //     },

  //     /**
  //      * Simple check to see if a user is logged in
  //      * 
  //      * @return {Boolean}
  //      */
  //     isLoggedIn: function() {
  //       var user = $rootScope.currentUser;
  //       return !!user;
  //     },
  //   };
  // });
