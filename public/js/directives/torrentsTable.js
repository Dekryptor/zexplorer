(function(){
    'use strict';
    
    var app = angular.module('zexplorer');

    app.directive('torrentsTable', [function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/torrentsTable.html',
            controller: 'torrentController as torrentCtrl'
        };
    }]);
}());