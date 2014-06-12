'use strict';

describe('Service: Following', function () {

  // load the service's module
  beforeEach(module('tweetabaseApp'));

  // instantiate service
  var Following;
  beforeEach(inject(function (_Following_) {
    Following = _Following_;
  }));

  it('should do something', function () {
    expect(!!Following).toBe(true);
  });

});
