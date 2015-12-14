(function() {
    /**
     * This is short version if this file
     * with workarounds.
     * In the feature this file can be completely different
     * but with the same (may be extended) api.
     */

    var app = angular.module('zexplorer');

    app.factory('profileSettings', ['$http', '$q', function ($http, $q) {
        
        function getTorrentsPerPage() {
            return $q(function(resolve, reject) {
                $http.post('api/torrent/search/', {
                    searchString: 'a',
                    page: 1
                })
                .success(function(resObj) {
                    var torrentsPerPage = resObj.torrents.length || 20;
                    resolve(torrentsPerPage);
                })
                .error(function(err){
                    reject(err);
                });
            });
        }
    
        return {
            torrentsPerPage: getTorrentsPerPage
        };
    }]);

}());