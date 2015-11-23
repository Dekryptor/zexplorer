angular.module('zexplorer')
.directive('profile', ['authService', function (authService) {
    return {
        restrict: 'E',
        link: function (scope, iElement, iAttrs) {
            scope.logout = function() {
                
            };
        }
    };
}])