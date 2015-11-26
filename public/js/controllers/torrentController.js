(function() {
    'use strict';
    
    var app = angular.module('zexplorer');

    app.controller('torrentController', ['torrentService', 'torrentTypeIcons', 
    function (torrentService, torrentTypeIcons) {
        var that = this;

        that.types = torrentTypeIcons;
        that.searchString = '';
        that.index = 'recommended'; //default index

        that.range = function(n) {
            return new Array(n);
        };

        that.torrents = [];
        torrentService.getRecommended()
        .success(function(torrents){
            that.torrents = torrents;
        })
        .error(function(err) {
            console.error(err);
        });
        
        that.search = function(searchString) {
            torrentService.search(searchString)
            .success(function(torrents){
                that.torrents = torrents;
                that.index = 'searchResults';
            })
            .error(function(err){
                throw err;
            });
        };


    }]);
})();