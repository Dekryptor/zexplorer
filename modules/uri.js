var uri = (function() {

	return {
		getFileName: function(uriStr, cutExtension) {
			var filename = uriStr.split('/').pop();

			if (cutExtension) {
				filename = filename.split('.').shift();
			}

			return filename;
		}
	};

}());

module.exports = uri;