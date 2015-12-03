(function(){
    'use strict';
    
    var app = angular.module('zexplorer', ['ngRoute', 'ngMaterial', 'ngMdIcons', 'ngCookies', 'ui.bootstrap']);
    
    app.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider){
        $httpProvider.defaults.withCredentials = true;

        $routeProvider.when('/', {
            templateUrl: 'templates/indexTemplate.html',
            controller: 'appController as appCtrl'
        });
        
        $routeProvider.when('/search/:searchString/:page', {
            templateUrl: 'templates/searchTemplate.html',
            controller: 'appController as appCtrl'
        });
        
        $locationProvider.html5Mode(true);
    }]);

}());