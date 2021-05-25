import debug from 'debug';
import { has, get, set } from 'lodash';

//error: 0, warn: 1, info: 2, verbose: 3
let cachedLoger = {
	error: {},
	warn: {},
	info: {},
	verbose: {},
	trace: {},
};

const getLogger = (tag, level) => {
	if (!has(cachedLoger, `${level}.${tag}`)) {
		let logger = debug(tag);
		switch (level) {
			case 'trace':
				logger.log = console.trace.bind(console);
				break;
			case 'verbose':
				logger.log = console.debug.bind(console);
				break;
			case 'info':
				logger.log = console.info.bind(console);
				break;
			case 'warn':
				logger.log = console.warn.bind(console);
				break;
			case 'error':
				logger.log = console.error.bind(console);
				break;
		}

		if (DEBUG) {
			logger.enabled = true;
		}

		set(cachedLoger, `${level}.${tag}`, logger);
	}
	return get(cachedLoger, `${level}.${tag}`);
};
export default class Logger {
	constructor(tag) {
		if (!tag) {
			throw new Error('missed constructor paramter tag');
		}
		this._tag = tag;
	}
	error(...args) {
		let logger = getLogger('error:' + this._tag, 'error');
		logger.apply(this, args);
	}
	warn(...args) {
		let logger = getLogger('warn:' + this._tag, 'warn');
		logger.apply(this, args);
	}
	info(...args) {
		let logger = getLogger('info:' + this._tag, 'info');
		logger.apply(this, args);
	}
	verbose(...args) {
		let logger = getLogger('verbose:' + this._tag, 'verbose');
		logger.apply(this, args);
	}
	trace(...args) {
		let logger = getLogger('trace:' + this._tag, 'trace');
		logger.apply(this, args);
	}
}
