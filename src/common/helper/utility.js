import deepEqual from 'deep-equal';
import { map, groupBy } from 'lodash';
import Logger from 'logger';

const log = new Logger('helper:utility');

export const objEqual = (oldValue, newValue) => {
	if (!oldValue && !newValue) {
		return false;
	}
	if (!oldValue && newValue) {
		return false;
	}
	if (oldValue && !newValue) {
		return false;
	}
	let result = null;

	log.verbose('begin JSON.stringify equal tow object');
	result = deepEqual(oldValue, newValue);
	log.verbose(`end JSON.stringify equal tow object ${result}`);

	return result;
};

export const parseJSON = (data: string) => {
	try {
		let obj = JSON.parse(data);
		return obj;
	} catch (ex) {
		return null;
	}
};

export const uniqArray = (data: Array, key) => {
	let d;
	try {
		return map(groupBy(data, key), (m) => {
			return m[0];
		});
	} catch (e) {
		return data;
	}
};

export const sizeStr = (str) => {
	try {
		return str.match(/[^ -~]/g) == null ? str.length : str.length + str.match(/[^ -~]/g).length;
	} catch (e) {
		return false;
	}
};

export const getPosInfo = (pos, serial, offsetY, offsetX) => {
	if (!pos) {
		return null;
	}
	let isUp = pos.get('isBottom');
	let elePos = pos.get('elePos');
	let width = elePos.width;
	let left = elePos.left + width / 2 + offsetX;
	let top = isUp ? offsetY : 200;
	return {
		isUp: isUp,
		top: top + serial * 62,
		left: left,
		width: width,
	};
};
