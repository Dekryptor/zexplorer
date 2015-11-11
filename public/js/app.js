(function(){
    'use strict';
    
    var app = angular.module('zexplorer', ['ngRoute', 'ngMaterial', 'ngMdIcons', 'ngCookies']);
    
    app.config(['$routeProvider', function($routeProvider){

        $routeProvider.when('/', {
            templateUrl: 'templates/indexTemplate.html',
            controller: 'appController as appCtrl'
        });


    }]);

}());