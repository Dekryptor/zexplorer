angular.module('zexplorer')
.controller('pagesController', ['$scope', '$rootScope', '$location', '$routeParams', '$cacheFactory',
function($scope, $rootScope, $location, $routeParams, $cacheFactory) {
    var cache = $cacheFactory.get('paginationCache');
    if (!cache) {
        cache = $cacheFactory('paginationCache');
    }
    
    $scope.pagesCount = 0;
    $scope.torrentsCount = 3000000; // Workaround - bugfix in angular UI bootstrap pagination sets page to 1 at init phase.
    $scope.selectedPage = $routeParams.page || 1;
    $scope.itemsPerPage = $rootScope.settings ? $rootScope.settings.torrentsPerPage || 20 : 20;
    $rootScope.$on('settings.updated', function() {
        $scope.itemsPerPage = $rootScope.settings.torrentsPerPage;
    });
    $scope.maxPages = 5;

    if (cache.get('selectedPage')) {
        $scope.selectedPage = cache.get('selectedPage');
        $scope.torrentsCount = cache.get('torrentsCount');
        $scope.pagesCount = cache.get('pagesCount');
        $scope.itemsPerPage = cache.get('itemsPerPage');
        cache.removeAll();
    }
    
    $scope.range = function(n) {
        return new Array(n);
    };

    $scope.pageChanged = function() {
        cache.put('selectedPage', $scope.selectedPage);
        cache.put('torrentsCount', $scope.torrentsCount);
        cache.put('pagesCount', $scope.pagesCount);
        cache.put('itemsPerPage', $scope.itemsPerPage);
        $location.path('/search/' + $routeParams.searchString + '/' + $scope.selectedPage);
    };
    
    function refreshCount() {
        $scope.pagesCount = $rootScope.torrentsTable.pagesCount;
        $scope.torrentsCount = $rootScope.torrentsTable.torrentsCount;
    }
    
    var unbind = $rootScope.$on('torrentsTable.changed', function() {
        refreshCount();
    });
    
    $scope.$on('$destroy', unbind);
}]);
