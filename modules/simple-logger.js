var fs = require('fs');

var logger = (function() {
	// Private
	function log(data, file, callback) {
		if (!data) {
			throw new Error('Log data is not presented.');
		}
		if (typeof data !== 'string') {

		}
		fs.writeFile(file, data, {flags: 'a'}, callback);
	}

	// Exposed
	function logNormal(data, callback) {
		log(data, 'log.log', callback);
	}

	function logWarn(data, callback) {
		log(data, 'warn.log', callback);
	}

	function logError(data, callback) {
		log(data, 'error.log', callback);
	}

	return {
		log: logNormal,
		warn: logWarn,
		error: logError
	};
}());

module.exports = logger;