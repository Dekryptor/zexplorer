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

        that.showRecommended = function() {
            torrentService.getRecommended()
            .success(function(torrents){
                that.torrents = torrents;
                that.loading = false;
            })
            .error(function(err) {
                console.error(err);
            });
        };

        //If location == application root then get recommended torrents
        if ($location.path() === '/') {
            that.showRecommended();
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
            var loadingDialog = $mdDialog.show({
                templateUrl: '/templates/dialogs/loadingDialog.html',
            });


            torrentService.getTorrentDetails(url)
            .then(function(details) {
                if (details.error) {
                    $mdDialog.show($mdDialog.alert().textContent(details.error).ok('Затвори'));
                }
                var parentEl = angular.element(document.body);
                $mdDialog.show({
                    parent: parentEl,
                    templateUrl: '/templates/dialogs/torrentDescription.html',
                    clickOutsideToClose: true,
                    locals: {
                        details: details
                    },
                    controller: ['$scope', '$timeout', 'downloader', 
                    function($scope, $timeout, downloader) {
                        $scope.details = details;
                        $scope.downloading = false;
                        $scope.closeDialog = function() {$mdDialog.hide();};
                        $scope.downloadTorrent = function(goDownloadUrl) {
                            if (!goDownloadUrl) throw new ReferenceError('goDownloadUrl is not defined');

                            $scope.downloading = true;
                            torrentService.getDownloadUrl(goDownloadUrl)
                            .then(function(downloadUrl) {
                                downloader(downloadUrl, $scope.details.name, 'torrent');
                                $timeout(function(){ $scope.downloading = false; }, 2000);
                            });
                        };
                        $scope.openUrl = function(url) {
                            window.open(url);
                        };
                    }]
                });
            }, function(err) {
                $mdDialog.show($mdDialog.alert().textContent(err).ok('Затвори'));
            });
        };
    }]);
})();