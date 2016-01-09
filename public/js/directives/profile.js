angular.module('zexplorer')
.directive('profile', ['$cookies' ,'authService', '$rootScope',
function ($cookies, authService, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'templates/directives/profile.html',
        link: function (scope, iElement, iAttrs) {
            // TODO - userID stays same when user logout and login with different account.
            // Fix it...
            scope.userId = $cookies.get('uid') || 'unknown';
            scope.isLoggedIn = authService.isLoggedIn();

            var unbind = $rootScope.$on('user.loggedIn', function() {
                scope.userId = $cookies.get('uid');
            });
            scope.$on('$destroy', unbind);

            /**
             * Logout the user and clear all cookies
             * @return {undefined} undefined
             */
            scope.logout = function() {
                var cookies = $cookies.getAll();
                authService.logout();
                scope.isLoggedIn = authService.isLoggedIn();
                return undefined;
            };
        }
    };
}]);