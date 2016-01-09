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

        $routeProvider.when('/category/:type/:page', {
            templateUrl: 'templates/categoryTemplate.html',
            controller: 'categoryController as categoryCtrl'
        });
        
        $locationProvider.html5Mode(true);
    }]);

    app.run(['profileSettings', '$rootScope', function(profileSettings, $rootScope){
        $rootScope.settings = {};

        function refreshSettings() {
            profileSettings.torrentsPerPage().then(function(torrentsPerPage) {
                $rootScope.settings.torrentsPerPage = torrentsPerPage;
                $rootScope.$emit('settings.updated');
            }, function(err) {
                console.error('error ocurred while resolving the user settings.');
            });
        }
        refreshSettings();

        var unbind = $rootScope.$on('user.loggedIn', refreshSettings);
        var logoutUnbind = $rootScope.$on('user.loggedOut', refreshSettings);
        $rootScope.$on('$destroy', unbind);
        $rootScope.$on('$destroy', logoutUnbind);
    }]);

}());