import moment from 'moment';
import { isNumber, isDate, parseInt } from 'lodash';
import { remote } from '../electron';

export const getNaturalDate = (time) => {
	return parseInt(moment(time).format('YYYYMMDD'));
};
/**
 * 计算运营日
 * @param  {[int]} time [数字型timestamp]
 * @param  {[string]} time [字符串timestamp]
 * @param  {[moment]} time [moment对象]
 * @param  {[Date]} time [日期对象]
 * @return {[int]}      [YYYYMMDD]
 */
export const getOperationDate = (time) => {
	let scheduleTime;
	//数字, 识别为 timestamp
	if (time == null) {
		scheduleTime = moment();
	} else if (parseInt(time) == time) {
		scheduleTime = moment(time, 'x');
	} else {
		scheduleTime = moment(time);
	}
	if (!scheduleTime.isValid()) {
		throw new Error('not support time format');
	}
	scheduleTime = scheduleTime.hour() < 4 ? scheduleTime.add(-1, 'days') : scheduleTime;
	return parseInt(scheduleTime.format('YYYYMMDD'));
};
/**
 * 获取上一个运营日
 * @param time
 * @returns {*}
 */
export const getLastOperationDate = (time) => {
	let scheduleTime = moment(time);
	let lastScheduleTime = scheduleTime.add(-1, 'days');
	return getOperationDate(lastScheduleTime);
};
/**
 * 获取下一个运营日
 * @param time
 * @returns {*}
 */
export const getNextOperationDate = (time) => {
	let scheduleTime = moment(time);
	let nextScheduleTime = scheduleTime.add(1, 'days');
	return getOperationDate(nextScheduleTime);
};

export const formatDate = (date, opt, empty) => {
	if (!empty) {
		empty = '';
	}
	if (isNumber(date)) {
		date = new Date(date);
	}
	if (!date || !isDate(date)) {
		return empty;
	}
	var year = date.getFullYear(),
		month = date.getMonth() + 1,
		day = date.getDate(),
		hour = date.getHours(),
		minute = date.getMinutes(),
		second = date.getSeconds();

	switch (opt) {
		case 'HHmm':
			return (hour >= 10 ? hour : '0' + hour) + ':' + (minute >= 10 ? minute : '0' + minute);
		case 'HHmmss':
			return (hour >= 10 ? hour : '0' + hour) + ':' + (minute >= 10 ? minute : '0' + minute) + ':' + (second >= 10 ? second : '0' + second);
		case 'HHmm(DD)':
			return (hour >= 10 ? hour : '0' + hour) + ':' + (minute >= 10 ? minute : '0' + minute) + '(' + (day >= 10 ? day : '0' + day) + ')';
		case '(DD)HHmm':
			return '(' + (day >= 10 ? day : '0' + day) + ')' + (hour >= 10 ? hour : '0' + hour) + ':' + (minute >= 10 ? minute : '0' + minute);
		case 'DD HH:mm:ss':
			return '(' + (day >= 10 ? day : '0' + day) + ')' + (hour >= 10 ? hour : '0' + hour) + ':' + (minute >= 10 ? minute : '0' + minute) + ':' + (second >= 10 ? second : '0' + second);
		case 'DD':
			return day >= 10 ? day : '0' + day;
		case 'MMDD':
			return (month >= 10 ? month : '0' + month) + '' + (day >= 10 ? day : '0' + day);
		case 'YYYY-MM-DD':
			return year + '-' + (month >= 10 ? month : '0' + month) + '-' + (day >= 10 ? day : '0' + day);
		default:
			return empty;
	}
};
export const getTime = () => {
	if (typeof window !== 'undefined' && remote) {
		return remote.getGlobal('now');
	} else {
		return new Date().getTime();
	}
};

export const getDiffTime = (start, end) => {
	let time,
		rt,
		unit = 'ms';
	rt = Math.abs(parseInt(end) - parseInt(start));

	if (rt >= 1000) {
		// rt = readedTime.diff(time, 'seconds');
		time = Math.floor(rt / 1000);
		unit = 's';
	}
	if (rt >= 1000 * 60) {
		time = Math.floor(rt / 1000 / 60);
		unit = 'm';
	}
	if (rt >= 1000 * 60 * 60) {
		time = Math.floor(rt / 1000 / 60 / 60);
		unit = 'h';
	}
	time = end < start ? -time : time;
	return `${time}${unit}`;
};
