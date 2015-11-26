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
             * @return {Promise} $http() .success(callback(data)) and .error(callback(err))
             */
            var search = function(str) {
                return $http.post('api/torrent/search', {searchStr: str});
            };

            return {
                getRecommended: getRecommended,
                search: search
            };
            
        }($http, $q));
        
        return torrentService;
    }]);

})();