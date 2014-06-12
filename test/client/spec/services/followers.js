'use strict';

describe('Service: Followers', function () {

  // load the service's module
  beforeEach(module('tweetabaseApp'));

  // instantiate service
  var Followers;
  beforeEach(inject(function (_Followers_) {
    Followers = _Followers_;
  }));

  it('should do something', function () {
    expect(!!Followers).toBe(true);
  });

});
