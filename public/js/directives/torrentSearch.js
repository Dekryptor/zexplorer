angular.module('zexplorer')
.directive('torrentSearch', ['torrentService', function (torrentService) {
    return {
        templateUrl: '/templates/directives/torrentSearch.html',
        restrict: 'E'
    };
}]);