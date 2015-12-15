angular.module('zexplorer')
.factory('downloader', [function () {
    
    function download(url, fileName, extension) {
        if (!fileName) fileName = 'untitled';
        if (!extension) extension = '';

        var link = document.createElement('a');
        link.download = fileName + '.' + extension.replace(/\./g, '');
        link.href = url;

        var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
        if (isChrome) {
            link.click();
        } else {
            /**
             * In firefox and some other browsers
             * a.click not working well.
             * clickEvent initialization is required.
             */
            var clickEvent = document.createEvent("MouseEvent");
            clickEvent.initEvent("click", true, true);
            link.dispatchEvent(clickEvent);
        }
    }

    return download;
}]);