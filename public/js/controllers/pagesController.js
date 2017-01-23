angular.module('zexplorer')
.controller('pagesController', ['$scope', '$rootScope', '$location', '$routeParams', '$cacheFactory',
function($scope, $rootScope, $location, $routeParams, $cacheFactory) {
    var cache = $cacheFactory.get('paginationCache');
    if (!cache) {
        cache = $cacheFactory('paginationCache');
    }

    $scope.itemsPerPage = $rootScope.settings ? $rootScope.settings.torrentsPerPage || 20 : 20;
    $rootScope.$on('settings.updated', function() {
        $scope.itemsPerPage = $rootScope.settings.torrentsPerPage;
    });
    $scope.maxPages = 5;
    
    $scope.range = function(n) {
        return new Array(n);
    };

    /**
    * Bootstrap uib-pagination calls pageChanged() on initialization and sets the ngModel to 1
    * OH GOD... the pagination calls pageChange only of ngModel (selectedPage) is different value from 1
    */
    $scope.selectedPage = 2; // Workaround - 2 = force execute pageChange.
    var initAlreadyCallPageChanged = false;
    $scope.pageChanged = function() {
        if (initAlreadyCallPageChanged) {
            $location.path('/search/' + $routeParams.searchString + '/' + $scope.selectedPage);
        } else {
            $scope.selectedPage = $routeParams.page;
            initAlreadyCallPageChanged = true;
        }
    };
}]);
