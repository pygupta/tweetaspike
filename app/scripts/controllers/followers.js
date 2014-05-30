'use strict';

angular.module('tweetabaseApp')
  .controller('FollowersCtrl', ['$scope', '$location', 'user', 'followers', 'localStorageService', function ($scope, $location, user, followers, localStorageService){

		var uid = localStorageService.get('uid');
		$scope.myFollowersList = [];
    $scope.user = {};
    $scope.message = null;
    $scope.oneAtATime = true;

		$scope.retrieveFollowers = function	() {
			followers.retrieveFollowers({
				uid: uid
			},	function(response)	{
        // console.log('/api/retrieveFollowers response: ' + JSON.stringify(response));
        if (response && response.status === 'Ok' && response.followers !== undefined)	{
					// console.log(response.followers);
					$scope.myFollowersList = response.followers;
        }
        // console.log($scope.myFollowersList);
			});
		};

		$scope.retrieveFollowers();

	}]);
