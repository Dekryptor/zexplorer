(function() {
    'use strict';
    
    var app = angular.module('zexplorer');
    // NOTE: remove $q dependency if it's not used.
    app.factory('torrentService', ['$http', '$q', function($http, $q){

        var torrentService = (function($http, $q, undefined){
            
            var getRecommended = function() {
                return $http.post('api/torrent/recommended');
            };
            
            /**
             * Search torrent with request to the server.
             * 
             * @param {string} str Search string.
             * @return {Promise} $http()
             */
            var search = function(str) {
                var options = {
                    method: 'POST',
                    url: '/api/torrent/search',
                    data: {
                        search: str
                    }
                };
                return $http(options);
            };

            return {
                getRecommended: getRecommended,
                search: search
            };
            
        }($http, $q));
        
        return torrentService;
    }]);

})();