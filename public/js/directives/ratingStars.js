angular.module('zexplorer')
.directive('ratingStars', [function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/directives/ratingStars.html',
        scope: {
            rating: '='
        },
        link: function(scope, el) {
            scope.stars = Array(scope.rating);
            scope.fillMaxStars = Array(5 - scope.rating);
        }
    };
}]);