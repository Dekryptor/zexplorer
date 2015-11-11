(function(){
    var app = angular.module('zexplorer');

    app.directive('torrentsTable', [function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/torrentsTable.html',
            scope: {
                index: '@'
            },
            controller: 'torrentController as torrentCtrl'
        };
    }]);
}());