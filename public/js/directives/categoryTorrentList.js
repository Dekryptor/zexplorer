angular.module('zexplorer')
.directive('categoryTorrentList', [function () {
    return {
        restrict: 'E',
        templateUrl: '/templates/directives/categoryTorrentList.html'    
    };
}]);