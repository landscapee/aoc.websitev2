import deepEqual from 'deep-equal';
import { map, groupBy } from 'lodash';
import Logger from '@/lib/logger';
import postal from 'postal';
import moment from 'moment';
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

export const parseJSON = (data) => {
	try {
		let obj = JSON.parse(data);
		return obj;
	} catch (ex) {
		return null;
	}
};

export const uniqArray = (data, key) => {
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

/**
 * 比较两个字符串不同
 * @param str1
 * @param str2
 * @returns {*}
 */
export const fiterStr = (str1, str2) => {
	let l = str1.length > str2.length ? str2.length : str1.length;
	let i = 0;
	while (i < l) {
		if (str1[i] !== str2[i]) break;
		i++;
	}
	return { same: str1.substr(0, i), diffStr1: str1.substr(i), diffStr2: str2.substr(i) };
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

export const matchPercentNum = (v, cb) => {
	// this.pub('Web', 'ShowRootAlert', { content: `不能为空`, type: `alert-danger` });
	const reg = /^(100|[1-9]?\d(\.\d\d?)?)$/;
	let test = reg.test(v + '');
	if (!test || v > 100) {
		postal.publish({
			channel: 'Web',
			topic: 'Global.Alert',
			data: ['请输入0-100的数字,小数点后最多2位!','提示',{type: 'error',center: true}],
		});
		return false;
	} else {
		cb && cb();
		return true;
	}
};

// 计算百分比
export const calcPercent = (numerator, denominator) => {
	let percent;
	if (!numerator && !denominator) {
		percent = 0;
	} else {
		percent = numerator === 0 ? 0 : numerator / denominator;
	}
	percent = parseInt(percent * 10000) / 100;
	return percent;
};

export const displayTimeHour = (v, emptyStr) => {
	if (!v || !moment(v).isValid()) {
		return emptyStr !== undefined ? emptyStr : '--';
	}
	return moment(v).format('HH:mm');
};

export const displayTimeDate = (v) => {
	if (!v || !moment(v).isValid()) {
		return '--';
	}
	return moment(v).format('HH:mm(DD)');
};

export const displayDate = (v) => {
	if (!v || !moment(v).isValid()) {
		return '--';
	}
	return moment(v).format('YYYY-MM-DD HH:mm');
};

export const displayDateSecond = (v) => {
	if (!v || !moment(v).isValid()) {
		return '--';
	}
	return moment(v).format('YYYY-MM-DD HH:mm:ss');
};

export const getMomentFromHHmm = (v) => {
	return moment()
		.set('hour', v.substring(0, 2))
		.set('minute', v.substring(2, 4));
};
