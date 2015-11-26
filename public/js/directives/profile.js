angular.module('zexplorer')
.directive('profile', ['$cookies' ,'authService', function ($cookies, authService) {
    return {
        restrict: 'E',
        templateUrl: 'templates/directives/profile.html',
        link: function (scope, iElement, iAttrs) {
            // TODO - userID stays same when user logout and login with different account.
            // Fix it...
            scope.userId = $cookies.get('uid');
            scope.isLoggedIn = authService.isLoggedIn();

            /**
             * Logout the user and clear all cookies
             * @return {undefined} undefined
             */
            scope.logout = function() {
                var cookies = $cookies.getAll();
                angular.forEach(cookies, function(cval, ckey) {
                    $cookies.remove(ckey);
                });
                scope.isLoggedIn = authService.isLoggedIn();
                return undefined;
            };
        }
    };
}]);