(function() {
    "use strict";
    
    var app = angular.module('zexplorer');

    app.controller('torrentController', ['torrentService', 'torrentTypeIcons', 
    '$rootScope', '$routeParams', '$location', '$mdDialog',
    function (torrentService, torrentTypeIcons, $rootScope,
    $routeParams, $location, $mdDialog) {
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
                if (torrents.length === 0) {
                    that.search('2015', 1);
                    return;
                }
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

        that.showTorrentDetailsDialog = function(url) {
            torrentService.getTorrentDetails(url)
            .then(function(details) {
                var parentEl = angular.element(document.body);
                $mdDialog.show({
                    parent: parentEl,
                    templateUrl: '/templates/dialogs/torrentDescription.html',
                    clickOutsideToClose: true,
                    locals: {
                        details: details
                    },
                    controller: ['$scope', function($scope) {
                        $scope.details = details;
                        $scope.closeDialog = function() {$mdDialog.hide();};
                        $scope.downloadTorrent = function(goDownloadUrl) {
                            if (!goDownloadUrl) throw new ReferenceError('goDownloadUrl is not defined');

                            torrentService.getDownloadUrl(goDownloadUrl)
                            .then(function(downloadUrl) {
                                var link = document.createElement('a');
                                link.download = $scope.details.name + '.torrent';
                                link.href = downloadUrl;
                                link.click();
                            });
                        };
                        $scope.openUrl = function(url) {
                            window.open(url);
                        };
                    }]
                });
            }, function(err) {
                throw err;
                // Show user error with {String} err.
            });
        };
    }]);
})();