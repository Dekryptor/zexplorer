(function() {
    'use strict';
    
    var app = angular.module('zexplorer');
    // NOTE: remove $q dependency if it's not used.
    app.factory('torrentService', ['$http', '$q', function($http, $q){

        var torrentService = (function($http, $q, undefined){
            
            var getRecommended = function() {
                return $http.post('api/torrent/recommended');
            };

            return {
                getRecommended: getRecommended
            };
            
        }($http, $q));
        
        return torrentService;
    }]);

})();