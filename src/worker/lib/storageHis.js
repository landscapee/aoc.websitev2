import loki from 'lokijs';
import Promise from 'bluebird';
import { has, extend, get, groupBy, each, omit, flatMap, map, flow, orderBy, remove, concat, compact, isArray, toUpper, keyBy, includes } from 'lodash';

import Logger from '@/lib/logger';
import { processFlight } from './storage';

const log = new Logger('worker:lib:storage');

var DB = new loki('ctuhis.db', { adapter: 'memory' });

export var flightHisDB = DB.addCollection('flights', {
	unique: ['flightId'],
	// indices: ['scheduleTime', 'seat', 'movement', 'markD', 'markV'],
	indices: ['scheduleTime'],
});

flightHisDB.ensureUniqueIndex('flightId');

const saveToFlightDBOriginal = (flights) => {
	return Promise.map(flights, (item) => {
		//忽略内存数据库的特有属性
		// let fixedItem = omit(item, ['$loki', 'meta']);
		let fixedItem = item;

		if (has(fixedItem, 'deleted') && get(fixedItem, 'deleted')) {
			let flightId = get(fixedItem, 'flightId');
			let removeFlight = flightHisDB.by('flightId', flightId);
			if (removeFlight) {
				flightHisDB.remove(removeFlight);
			}
			return Promise.resolve();
		}
		//检查是否有对象不含FlightId, 忽略
		let flightId = get(fixedItem, 'flightId');
		if (flightId === 'null') {
			log.error('flightId is string null');
			return Promise.resolve();
		}
		if (flightId === 'undefined') {
			log.error('flightId is string undefined');
			return Promise.resolve();
		}
		if (!has(fixedItem, 'flightId')) {
			// log.error('missed key flightId for', fixedItem);
			return Promise.resolve();
		}

		//尝试Insert, 如果失败就Update
		try {
			let flightId = get(fixedItem, 'flightId');
			let existFlight = flightHisDB.by('flightId', flightId);
			if (!existFlight) {
				flightHisDB.insert(fixedItem);
			} else {
				flightHisDB.update(extend(existFlight, fixedItem));
			}
		} catch (ex) {
			log.error(fixedItem, ex);
		}
		return Promise.resolve();
	});
};

export const saveToFlightHisDB = (flights) => {
	let newFlights = [];
	map(flights, (f) => {
		let preFlight = flightHisDB.by('flightId', f.flightId);
		if (preFlight) {
			newFlights.push(extend(omit(preFlight, ['$loki', 'meta']), f));
		} else {
			newFlights.push(f);
		}
	});
	return saveToFlightDBOriginal(processFlight(newFlights));
};
