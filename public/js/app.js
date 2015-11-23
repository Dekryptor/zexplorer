(function(){
    'use strict';
    
    var app = angular.module('zexplorer', ['ngRoute', 'ngMaterial', 'ngMdIcons', 'ngCookies']);
    
    app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

        $routeProvider.when('/', {
            templateUrl: 'templates/indexTemplate.html',
            controller: 'appController as appCtrl'
        });
        
        $locationProvider.html5Mode(true);
    }]);

}());