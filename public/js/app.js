(function(){
    'use strict';
    
    var app = angular.module('zexplorer', ['ngRoute', 'ngMaterial', 'ngMdIcons', 'ngCookies']);
    
    app.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider){
        $httpProvider.defaults.withCredentials = true;

        $routeProvider.when('/', {
            templateUrl: 'templates/indexTemplate.html',
            controller: 'appController as appCtrl'
        });
        
        $locationProvider.html5Mode(true);
    }]);

}());