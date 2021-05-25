import { isString, get, set } from 'lodash';
import postal from 'postal';

var globalData = {};

export const remote = {
	getGlobal: (...args) => {
		return get(globalData, args[0]);
	},
	setGlobal: (...args) => {
		return set(globalData, args[0], args[1]);
	},
};

export const ipcRenderer = {
	send: (...args) => {
		var msg = null;
		if (args.length == 1 && isString(args[0])) {
			msg = {
				channel: 'Storage',
				topic: args[0],
				data: null,
			};
		} else if (args.length > 1 && isString(args[0])) {
			msg = {
				channel: 'Storage',
				topic: args[0],
				data: args[1],
			};
		} else {
			msg = args[0];
		}
		let blob = JSON.stringify(msg);
		self.postMessage(blob);
		postal.publish(msg);
	},
};
