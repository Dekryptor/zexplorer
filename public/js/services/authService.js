angular.module('zexplorer')
.factory('authService', ['$http', '$cookies', '$q', '$rootScope',
function($http, $cookies, $q, $rootScope) {
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
            var cookieObj = parseCookieStringToObject(c[0]);
            $cookies.put(cookieObj.key, cookieObj.val, {expires:  increaseDate(new Date(), 6)});
        });
        return undefined;
    }

    /**
     * Parses cookie string to object
     * @param  {String} cookieStr Cookies string
     * @return {JSON} obj {key: cookieKey, val: cookieVal}
     */
    function parseCookieStringToObject(cookieStr) {
        var cArr = cookieStr.split('=');
        return {key: cArr[0], val: cArr[1]};
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
     * @return {Promise} $q Resolves with {cookieKey: 'cookieVal', cookie2Key: 'val'} object
     */
    function login(credentials) {
        return $q(function(resolve, reject) {
            loginRequestCookies(credentials).then(function(cookies) {
                if (!cookies) throw new ReferenceError('cookies are not defined');
                setCookies(cookies); // typeof cookies == Array (cookies[0] == ['ckey=cval'])

                var cookiesParsedToObject = {}; 
                angular.forEach(cookies, function(val, key) {
                    var cookieKeyValObj = parseCookieStringToObject(val[0]);
                    var cookieObj = {};
                    cookieObj[cookieKeyValObj.key] = cookieKeyValObj.val;
                    angular.extend(cookiesParsedToObject, cookieObj);
                });

                $rootScope.$emit('user.loggedIn');

                resolve(cookiesParsedToObject);
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

        $rootScope.$emit('user.loggedOut');
    }
    
    return {
        login: login,
        isLoggedIn: isLoggedIn,
        logout: logout
    };
}]);