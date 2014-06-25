'use strict';

angular.module('tweetabaseApp')
  .controller('FooterCtrl', ['$modal', '$scope', function ($modal, $scope) {

		var modalInstance = null;

		$scope.showAboutApp = function () {
			modalInstance = $modal.open({
				templateUrl: 'partials/about_app_modal.html',
				controller: 'AboutAppModalInstanceCtrl',
				backdrop: true,
				resolve: {
					options: function()	{
						return {};
					},
				}
			});
		};

  }]);

angular.module('tweetabaseApp')
  .controller('AboutAppModalInstanceCtrl', ['$scope', '$modalInstance', 'options', function ($scope, $modalInstance, options){
		$scope.options = options;

	  $scope.close = function () {
	    $modalInstance.dismiss('cancel');
		};
	}]);
