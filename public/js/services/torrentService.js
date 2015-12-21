(function($, undefined) {
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

            function getTorrentUrl(html) {
                var $HTML = $(html);
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

            function getImages($description) { 
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
                    if (src.indexOf('zamunda.net/pic/smilies') > -1) {
                        return true; // continue
                    }
                    if (src.indexOf('zamunda.net/bitbucket/eng26x18.jpg') > -1) {
                        return true; // continue
                    }
                    if (src.indexOf('zamunda.net/bitbucket/win%20look.jpg') > -1) {
                        return true; // continue
                    }
                    var imgLink = createGetFileLink(src);
                    imageLinks.push(imgLink);
                });
                
                return imageLinks;
            }

            function getExternalLinks($description) {
                if (!$description) throw new ReferenceError('$description is not defined.');
                if (!($description instanceof jQuery)) {
                    $description = $($description);
                }

                var linksFoundAtIndexes = [];
                var imdbRegExp = new RegExp('imdb', 'i');
                var cinefishRegExp = new RegExp('cinefish', 'i');
                var descriptionHTMLs = $description.html().split('##');
                var externalLinks = {};
                jQuery.each(descriptionHTMLs, function(i, val) {
                    var imdbLink = extractLink(val, imdbRegExp);
                    if (imdbLink) {
                        externalLinks.imdb = imdbLink;
                        linksFoundAtIndexes.push(i);
                        return true; // continue;
                    }

                    var cinefishLink = extractLink(val, cinefishRegExp);
                    if (cinefishLink) {
                        externalLinks.cinefish = cinefishLink;
                        linksFoundAtIndexes.push(i);
                        return true; // continue;
                    }
                });

                function extractLink(html, regExp) {
                    if (html.search(regExp) > -1) {
                        var $html = $(html);
                        var $links = $html.find('a');
                        if ($links.length === 0) return true; // continue;
                        if ($links.length === 1) {
                            return $links.attr('href');
                        }
                        if ($links.length > 1) {
                            var link;
                            $links.each(function(i, val) {
                                var href = val.getAttribute('href');
                                if (href.indexOf('http://www.imdb.com/') > -1) {
                                    link = href;
                                    return false; // break;
                                }
                            });
                            return link;
                        }
                    } else {
                        return undefined;
                    }
                }

                return {
                    links: externalLinks,
                    foundAt: linksFoundAtIndexes
                };
            }

            function parseDescriptionTextsAndLinks($description) {
                if (!$description) throw new ReferenceError('$description is not defined.');
                if (!($description instanceof jQuery)) {
                    $description = $($description);
                }

                var externalLinksResults = getExternalLinks($description);
                var links = externalLinksResults.links;
                var atIndexses = externalLinksResults.foundAt;

                var descriptionTexts = $description.text().split('##');
                for (var i = atIndexses.length - 1; i >= 0; i--) {
                    // Cut the text while we found the external link.
                    descriptionTexts.splice(atIndexses[i], 1);
                }

                return {
                    externalLinks: links,
                    descriptionTexts: descriptionTexts
                };
            }

            function parseTorrentDetailsHTML(html, url) {
                if (!html) throw new ReferenceError('html is not defined.');
                if (url.indexOf('decision(') > -1) {
                    return {error: 'Този торрент не се поддържа.'};
                }

                var detailsObject = {};

                html = html.replace(new RegExp('src=', 'g'), '_src=');
                var $HTML = $(html);
                if ($HTML.find('form[name="login"]').length > 0) {
                    return {error: 'Не може да достъпите този торент като гост.'};
                }

                detailsObject.name = getTorrentName($HTML);
                detailsObject.download = getTorrentGoDownloadUrl($HTML);

                var $description = $HTML.find('#description');
                var images = getImages($description);
                detailsObject.poster = images.shift();
                detailsObject.images = images;
                detailsObject.url = url;
                detailsObject.subtitles = extractSubtitlesUrls($description);
                var parsedTextsAndLinks = parseDescriptionTextsAndLinks($description);
                detailsObject.description = parsedTextsAndLinks.descriptionTexts;
                detailsObject.externalLinks = parsedTextsAndLinks.externalLinks;

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
            var regExp = new RegExp('/', 'g');
            var search = function(str, page) {
                str = str === 'emptysearch' ? '' : str;
                str = encodeURIComponent(str);
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
                        var detailsObject = parseTorrentDetailsHTML(html, url);
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

})(jQuery, undefined);