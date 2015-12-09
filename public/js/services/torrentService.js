(function($) {
    'use strict';

    var ZAMUNDA_HOST = 'http://www.zamunda.net';
    
    var app = angular.module('zexplorer');
    app.factory('torrentService', ['$http', '$q', '$location',
    function($http, $q, $location){

        var torrentService = (function($http, $q, undefined){

            // Private
            
            function getTorrentDetailsHTML(url) {
                if (!url) throw new ReferenceError('url is not defined.');
                var options = {
                    url: '/api/torrent/description',
                    params: {
                        url: url
                    }
                };

                return $http(options);
            }

            function getTorrentName(html) {
                var $HTML = $(html);
                return $HTML.find('h1').text();
            }

            function getTorrentGoDownloadUrl(html) {
                if (!html) throw new ReferenceError('html is not defined');
                if ((html instanceof jQuery) === false) {
                    html = html.replace(new RegExp('src=', 'g'), '_src=');
                    html = $(html);
                }
                var goDownloadUrl = html.find('a.index').first().attr('href');
                if (goDownloadUrl.indexOf('/') !== 0) {
                    goDownloadUrl = '/' + goDownloadUrl;
                }
                var downloadUrl = ZAMUNDA_HOST + goDownloadUrl;
                return createGetFileLink(downloadUrl);
            }

            function createGetFileLink(url) {
                if (!url) throw new ReferenceError('url is not defined');

                var protocolAndHostAndPort = $location.protocol() + '://' + location.host;
                var encodedURL = encodeURIComponent(url);
                var link = protocolAndHostAndPort + '/api/get/file?url=' + encodedURL;
                return link;
            }

            function extractSubtitlesUrls($description) {
                if (!$description) throw new ReferenceError('$description is not defined');
                if (($description instanceof jQuery) !== true) {
                    $description = $($description);
                }
                if ($description.next().length === 0) {
                    return []; // Optimization purpose.
                }
                var $subtitlesDiv = $description.next();

                var $allAnchors = $subtitlesDiv.find('a');
                var urls = [];
                $allAnchors.each(function(i, el) {
                    var href = $(el).attr('href');
                    if (!href) return true; // continue
                    if (href.indexOf('http://subsunacs.net') !== -1 ||
                        href.indexOf('http://subs.sab.bz') !== -1 ||
                        href.indexOf('http://zamunda.net/getsubs.php/') !== -1) {
                        urls.push(href);
                    }
                });

                return urls;
            }

            // Need refactoring...
            function parseTorrentDetailsHTML(html) {
                if (!html) throw new ReferenceError('html is not defined.');

                var detailsObject = {};

                html = html.replace(new RegExp('src=', 'g'), '_src=');
                var $HTML = $(html);
                if ($HTML.find('form[name="login"]').length > 0) {
                    return {error: 'Неможе да достъпите този торент като гост.'};
                }

                detailsObject.name = getTorrentName($HTML);
                detailsObject.download = getTorrentGoDownloadUrl($HTML);

                var $description = $HTML.find('#description');

                var imageLinks = [];
                var $allImages = $description.find('img');
                $allImages.each(function(i, el) {
                    var $el = $(el);
                    var src = $el.attr('_src');
                    if (!src) return true; //continue;
                    // Skip IMDb star images.
                    if (src == 'http://zamunda.net/pic/fullr.png' ||
                        src == 'http://zamunda.net/pic/blankr.png' ||
                        src == 'http://zamunda.net/pic/halfr.png') {
                            return true; // continue;
                    }
                    if (src == 'http://zamunda.net/pic/playicon.png') {
                        return true; // continue;
                    }
                    if (!detailsObject.poster) {
                        detailsObject.poster = createGetFileLink(src);
                        return true; // continue;
                    }
                    var imgLink = createGetFileLink(src);
                    if (imgLink !== detailsObject.poster) {
                        imageLinks.push(imgLink);
                    }
                });
                detailsObject.images = imageLinks;
                detailsObject.subtitles = extractSubtitlesUrls($description);
                detailsObject.description = $description.text().split('##');

                return detailsObject;
            }

            // Exposed
            
            var getRecommended = function() {
                return $http.post('api/torrent/recommended');
            };
            
            /**
             * Search torrent with request to the server.
             * 
             * @param {string} str Search string.
             * @return {Promise} $http() .success(callback(data)) and .error(callback(err))
             */
            var search = function(str, page) {
                return $http.post('api/torrent/search', {
                    searchString: str,
                    page: page - 1
                });
            };

            function getTorrentDownloadUrl(torrentGoDownloadUrl) {
                return $q(function(resolve, reject) {
                    $http.get(torrentGoDownloadUrl)
                    .success(function(html) {
                        var downloadUrl = getTorrentGoDownloadUrl(html);
                        resolve(downloadUrl);
                    })
                    .error(function(err) {
                        throw err; //debug..
                    });
                });
            }

            var getTorrentDetails = function(url) {
                return $q(function(resolve, reject) {
                    getTorrentDetailsHTML(url)
                    .success(function(html) {
                        var detailsObject = parseTorrentDetailsHTML(html);
                        if (detailsObject.error) {
                            reject(detailsObject.error);
                        } else {
                            resolve(detailsObject);
                        }
                    })
                    .error(function(err) {
                        throw new Error(err); //debug
                        // todo show error to user.
                    });
                });
            };

            return {
                getRecommended: getRecommended,
                search: search,
                getTorrentDetails: getTorrentDetails,
                getDownloadUrl: getTorrentDownloadUrl
            };
            
        }($http, $q));
        
        return torrentService;
    }]);

})(jQuery);