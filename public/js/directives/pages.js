angular.module('zexplorer')
.directive('pages', [function () {
    return {
        restrict: 'EA',
        templateUrl: '/templates/directives/pages.html',
        controller: 'pagesController as pagesCtrl',
        scope: {
        	paging: '=paging'
        }
    };
}]);