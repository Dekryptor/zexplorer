(function() {
    'use strict';
    
    var app = angular.module('zexplorer');

    app.controller('torrentController', ['torrentService', 'torrentTypeIcons', 
        function (torrentService, torrentTypeIcons) {
        
        var that = this;

        that.types = torrentTypeIcons;

        that.range = function(n) {
            return new Array(n);
        };

        that.recommended = [];
        torrentService.getRecommended()
            .success(function(torrents){
                that.recommended = torrents;
            })
            .error(function(err) {
                console.error(err);
            });
    }]);
})();