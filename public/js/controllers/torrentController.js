(function() {
    "use strict";
    
    var app = angular.module('zexplorer');

    app.controller('torrentController', ['torrentService', 'torrentTypeIcons', 
    '$rootScope', '$routeParams', '$location',
    function (torrentService, torrentTypeIcons, $rootScope, $routeParams, $location) {
        var that = this;
        
        // Torrents table data container.
        $rootScope.torrentsTable = {};

        that.types = torrentTypeIcons;
        that.searchString = $routeParams.searchString || '';
        that.loading = true;
        that.pagination = {};

        that.range = function(n) {
            return new Array(n);
        };

        that.torrents = [];

        //If location == application root then get recommended torrents
        if ($location.path() === '/') {
            torrentService.getRecommended()
            .success(function(torrents){
                that.torrents = torrents;
                that.loading = false;
            })
            .error(function(err) {
                console.error(err);
            });
        }
        // Else if this is a search path
        // Call the search function.
        else if ($routeParams.searchString) {
            _search($routeParams.searchString, $routeParams.page);
        }
        
        that.search = function(searchString, page) {
            page = page || 1;
            $location.path('/search/' + searchString + '/' + page);
        };

        function _search(searchString, page) {
            that.loading = true;
            torrentService.search(searchString, page)
            .success(function(response){
                that.torrents = response.torrents;
                that.pagination = response.pagination;
                
                $rootScope.torrentsTable.pagesCount = that.pagination.pagesCount;
                $rootScope.torrentsTable.torrentsCount = that.pagination.torrentsCount;
                $rootScope.$emit('torrentsTable.changed');
                that.loading = false;
            })
            .error(function(err){
                throw err;
                // todo show user err.
            });
        }
        console.log(this);

    }]);
})();