angular.module('zexplorer')
.directive('login', ['$mdDialog', 'authService', function ($mdDialog, authService) {

	function link(scope, element, attrs) {
		scope.isLoggedIn = authService.isLoggedIn();
		scope.dialogVisible = false;
		
		scope.showDialog = function ($event) {
			var parentEl = angular.element(document.body);

			$mdDialog.show({
				clickOutsideToClose: true,
				parent: parentEl,
				targetEvent: $event,
				templateUrl: '/templates/dialogs/loginDialog.tmpl.html',
				controller: ['$scope', '$mdDialog', function($scope, $mdDialog) {
					$scope.user = {};
					$scope.extendedPrivacyInfo = false;
					$scope.error = undefined;
					
					$scope.showExtendedPrivacyInfo = function () {
						$scope.extendedPrivacyInfo = true;
					};
					$scope.loginAttempt = function() {
						authService.login($scope.user).then(function(){
							$scope.closeDialog();
						}, function(err) {
							$scope.error = err;
						});
					};
					$scope.closeDialog = function() {
						$mdDialog.hide();
					};
				}]
			});
		};
	}


	return {
		restrict: 'E',
		templateUrl: '/templates/directives/login.html',
		link: link
	};

}]);