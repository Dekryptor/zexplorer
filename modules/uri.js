var uri = (function() {
    "use strict";

	return {
		getFileName: function(uriStr, cutExtension) {
            if (!uriStr) throw new ReferenceError('uriStr is not defined');

			var filename = uriStr.split('/').pop();

			if (cutExtension) {
				filename = filename.split('.').shift();
			}

			return filename;
		}
	};

}());

module.exports = uri;