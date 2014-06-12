'use strict';

describe('Controller: FollowingCtrl', function () {

  // load the controller's module
  beforeEach(module('tweetabaseApp'));

  var FollowingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FollowingCtrl = $controller('FollowingCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
