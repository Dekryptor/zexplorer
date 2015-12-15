var fs = require('fs');
var os = require('os');

var logger = (function() {
	// Private
	function log(data, file, callback) {
		if (!data) {
			log('No data to log.', 'simple-logger-native-logs.log');
			return;
		}
		if (typeof data !== 'string') {
			try {
				data = data.toString();	
			}
			catch (e) {
				log(e, 'simple-logger-native-logs.log');
				return;
			}
		}
		fs.writeFile(file, data, {flag: 'a'}, callback);
		fs.writeFile(file, os.EOL, {flag: 'a'}, callback);
	}

	// Exposed
	function logNormal(data, callback) {
		log(os.EOL + data + os.EOL, 'log.log', callback);
	}

	function logWarn(data, callback) {
		log(os.EOL + data + os.EOL, 'warn.log', callback);
	}

	function logError(data, callback) {
		log(os.EOL + data + os.EOL, 'error.log', callback);
	}

	return {
		log: logNormal,
		warn: logWarn,
		error: logError
	};
}());

module.exports = logger;