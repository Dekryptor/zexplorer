angular.module('zexplorer')
.factory('authService', ['$http', '$cookies', '$q', function($http, $cookies, $q) {
    "use strict";
    
    // Private
    
    function increaseDate(date, months) {
        var increasedDate = date.setMonth(date.getMonth() + months);
        return new Date(increasedDate);
    }
    
    /**
    * Sets array of cookies to the browser
    * 
    * @param {String} cookies Cookies Array or Object. Interface:['key=val', 'key=val', '...']
    * @return undefined
    */
    function setCookies(cookies) {
        angular.forEach(cookies, function(c) {
            // creating ['key', 'value'] array;
            var kv = c[0].split('=');
            $cookies.put(kv[0], kv[1], {expires:  increaseDate(new Date(), 6)});
        });
        return undefined;
    }
    
    /**
     * Request zamunda.net for login with provided credentails.
     * Gettin' the cookies and parsing them.
     * 
     * @param {JSON} credentials {username: 'name', password: 'secret'}
     * @return {Promise} Promise resolve(cookies) reject(err)
     */
    function loginRequestCookies(credentials) {
        return $q(function(resolve, reject) {
            $http.post('/api/auth/login', credentials)
            .success(function(cookies) {
                var cNamesAndValues = [];
                angular.forEach(cookies, interator);
                function interator(cookie) {
                    var cNameAndValue = cookie.split(';', 1);
                    cNamesAndValues.push(cNameAndValue);
                }
                resolve(cNamesAndValues);
            })
            .error(function(err) {
                reject(err);
            });
        });
    }
        
    // Exposed
    
    /**
     * Login to zamunda.net
     * 
     * @param {JSON} credentials {username: 'name', password: 'secret'}
     */
    function login(credentials) {
        return $q(function(resolve, reject) {
            loginRequestCookies(credentials).then(function(cookies) {
                setCookies(cookies);
                resolve(undefined);
            }, function(err) {
                reject(err);
            });
        });
    }
    
    /**
     * Check login status
     * 
     * @return {Boolean} Boolean login status
     */
    function isLoggedIn() {
        if (!! $cookies.get('uid')) {
            return true;
        } else {
            return false;
        }
    }

    function logout() {
        var cookies = $cookies.getAll();
        angular.forEach(cookies, function(c, key) {
            $cookies.remove(key);
        });
    }
    
    return {
        login: login,
        isLoggedIn: isLoggedIn
    };
}]);

// var cookies = [
//     "russian_lang=no; expires=Mon, 09-Nov-2015 14:47:01 GMT; path=/; domain=.zamunda.net",
//     "uid=2407952; expires=Tue, 19-Jan-2038 03:14:07 GMT; path=/; domain=.zamunda.net",
//     "pass=dbef5d9f4857ad4acb0dd06740ee6c0a; expires=Tue, 19-Jan-2038 03:14:07 GMT; path=/; domain=.zamunda.net",
//     "cats=7; expires=Tue, 19-Jan-2038 03:14:07 GMT; path=/; domain=.zamunda.net",
//     "periods=7; expires=Tue, 19-Jan-2038 03:14:07 GMT; path=/; domain=.zamunda.net",
//     "statuses=1; expires=Tue, 19-Jan-2038 03:14:07 GMT; path=/; domain=.zamunda.net",
//     "howmanys=1; expires=Tue, 19-Jan-2038 03:14:07 GMT; path=/; domain=.zamunda.net"
// ];