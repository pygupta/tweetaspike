'use strict';

describe('Filter: followFollowing', function () {

  // load the filter's module
  beforeEach(module('tweetabaseApp'));

  // initialize a new instance of the filter before each test
  var followFollowing;
  beforeEach(inject(function ($filter) {
    followFollowing = $filter('followFollowing');
  }));

  it('should return the input prefixed with "followFollowing filter:"', function () {
    var text = 'angularjs';
    expect(followFollowing(text)).toBe('followFollowing filter: ' + text);
  });

});
