'use strict';

angular.module('tweetabaseApp')
  .filter('followFollowing', ['$sce', function ($sce) {
    return function (input,array) {
      var label = ''; //$sce.trustAs('html','<button class="btn btn-danger" ng-click="followConfirmation($index)">Follow</button>');
      for (var i=0; i<array.length; i++){
        if (array[i].handle === input) {
          label = '[Following]';
          break;
        }
      }
      return label;
    };
  }]);
