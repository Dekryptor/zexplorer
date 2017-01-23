angular.module('zexplorer')
.factory('guestService', ['$q', 'authService', 'constants',
function($q, authService, constants) {
    "use strict";
    
    function loginAsGuestIfNotLoggedIn() {
        if (authService.isLoggedIn()) 
            return $q.resolve(true);
        
        return $q(function(resolve, reject) {
            var guestCredentails = {
                username: constants.login.guestUsername,
                password: constants.login.guestPassword
            };
            authService.login(guestCredentails).then(function(cookiesParsedToObject){
                resolve(cookiesParsedToObject);
            }, function(err) {
                reject(err);
            });
        });
    }

    return {
        loginAsGuestIfNotLoggedIn: loginAsGuestIfNotLoggedIn
    };
}]);