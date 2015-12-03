angular.module('zexplorer')
.controller('pagesController', ['$scope', '$rootScope', '$location', '$routeParams',
function($scope, $rootScope, $location, $routeParams) {
    $scope.pagesCount = 0;
    $scope.torrentsCount = 9000000; // Workaround - bugfix in angular UI bootstrap pagination sets page to 1 at init phase.
    $scope.selectedPage = $routeParams.page || 1;
    $scope.itemsPerPage = 20;
    $scope.maxPages = 7;
    
    $scope.range = function(n) {
        return new Array(n);
    };

    $scope.pageChanged = function() {
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
