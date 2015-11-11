angular.module('zexplorer')
.factory('authService', ['$http', '$cookies', '$q', function($http, $cookies, $q) {

    function login(credentials) {
        var options = {
            method: "POST",
            data: credentials
        };


        return $q(function(resolve, reject) {
            $http.post(options)
            .success(function(cookies) {
                angular.forEach(cookies, interator);
                function interator(cookie) {
                    
                }
            })
            .error(function(err) {
                reject(err);
            });
        });
    }
}]);

var cookies = [
    "russian_lang=no; expires=Mon, 09-Nov-2015 14:47:01 GMT; path=/; domain=.zamunda.net",
    "uid=2407952; expires=Tue, 19-Jan-2038 03:14:07 GMT; path=/; domain=.zamunda.net",
    "pass=dbef5d9f4857ad4acb0dd06740ee6c0a; expires=Tue, 19-Jan-2038 03:14:07 GMT; path=/; domain=.zamunda.net",
    "cats=7; expires=Tue, 19-Jan-2038 03:14:07 GMT; path=/; domain=.zamunda.net",
    "periods=7; expires=Tue, 19-Jan-2038 03:14:07 GMT; path=/; domain=.zamunda.net",
    "statuses=1; expires=Tue, 19-Jan-2038 03:14:07 GMT; path=/; domain=.zamunda.net",
    "howmanys=1; expires=Tue, 19-Jan-2038 03:14:07 GMT; path=/; domain=.zamunda.net"
];