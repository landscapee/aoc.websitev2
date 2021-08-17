import Promise from 'bluebird';
import moment from 'moment';
import { map, each, set, get, filter, has, extend, flow, keys, pick, omit, every, some, indexOf, toLower, toUpper, upperFirst, concat, compact, reduce, orderBy, drop, dropRight, isArray, isObject, isEqual, merge } from 'lodash';
import { getNaturalDate, getOperationDate, formatDate } from '@/lib/helper/date';
import Airports from '@/lib/data/airports.json';
import Logger from '@/lib/logger';
import { flightDB } from '@/worker/lib/storage';
// import { remote } from '../electron';
import { memoryStore } from '@/worker/lib/memoryStore';

const log = new Logger('helper:flight');
export const addSerialNumber = (cacheFlights) => {
	return map(cacheFlights, (item, index) => {
		return extend({}, item, { flightIndex: index + 1 });
	});
};
export const flightStateColor = {
	前方起飞: '#9E72FF',
	到达: '#1D93F2',
	登机: '#2a42ff',
	催促登机: '#BC1D1D',
	关闭: '#00950C',
	取消: '#7B97AD',
	延误: '#EE4469',
	起飞: '#B3C0D6',
	到下站: '#B3C0D6',
	正常: '#ffffff',
	备降: '#F89401',
	返航: '#F89401',
	其他: '#878684',
};
const takeOffNormalStatus = { 0: '正常', 1: '不正常', 2: '不计算' };
/**
 * 只有这些航班类型的数据才纳入各种正常率的统计(航班正常率, 始发正常率, 放行正常率, 早高峰正常率)
 * @type {Array}
 */
const PercentReportFlightType = ['普客加班', '货包', '包机', '正班', '货加', '货班', '客加班', '货加班'];

/**
 * 修正属性的类型, 主要是一些时间要格式化成 int
 * @param  {[type]} flight [description]
 * @return {[type]}        [description]
 */
const fixDateType = (flight) => {
	each(['preAtd', 'preEtd', 'sta', 'std', 'eta', 'mixEta', 'eti', 'etd', 'estimateTime', 'ata', 'atd', 'acarsOn', 'acarsIn', 'acarsOff', 'acarsOut', 'arriveFlight.sta', 'arriveFlight.ata', 'departFlight.std', 'departFlight.atd', 'departFlight.etd', 'departFlight.estimateTime'], (field) => {
		has(flight, field) && set(flight, field, parseInt(get(flight, field)));
	});
	return flight;
};
/**
 * 计算运营日和自然日, 运营日是每日4点到第二天4点
 * @param  {[type]} flight [description]
 * @return {[type]}        [description]
 */
const calcOperationDate = (flight) => {
	let scheduleTime = get(flight, 'scheduleTime');
	return extend({}, flight, {
		naturalDate: getNaturalDate(scheduleTime),
		operationDate: getOperationDate(scheduleTime),
	});
};
/**
 * 预处理部分显示字段, 比如日期格式化
 * @param  {[type]} flight [description]
 * @return {[type]}        [description]
 */
export const addDisplayField = (flight) => {
	if (!flight) {
		return flight;
	}
	let displayUpperFields = map(['sta', 'eta', 'eti', 'ata', 'std', 'etd', 'atd', 'ctot', 'cobt', 'tobt', 'ttot', 'delayTime', 'dsgt', 'tsgt', 'dstt', 'tstt'], (fieldKey) => {
		if (has(flight, fieldKey)) {
			return {
				[`display${toUpper(fieldKey)}`]: formatDate(get(flight, fieldKey), 'HHmm'),
				[`display${toUpper(fieldKey)}WithDate`]: formatDate(get(flight, fieldKey), 'HHmm(DD)'),
			};
		}
		return null;
	});

	let displayUpperFirstFields = map(
		[
			'mixEta',
			'amisEta',
			'scheduleTime',
			'actualTime',
			'estimateTime',
			'acdmEta',
			'preEtd',
			'preAtd',
			'out',
			'in',
			'preStd',
			'acdmEta',
			'variflightEta',
			'variflightEtd',
			'variflightAta',
			'variflightAtd',
			'closeDoorTime',
			'maintainTime',
			'vehicleArriveIn',
			'pushOutTime',
			'elecPublishTime',
			'maintainTime',
			'takeOffTime',
			'preOrNxtPlanTime',
			'preOrNxtActualTime',
			'blockOnStart',
			'blockOffEnd',
			'standardTakeOffTime',
			'firstLuggageEstimateArriveTime',
			'estimateGuaranteeCompleteTime',
			'firstLuggageActualArriveTime',
			'overStationMinTime',
			'overStationScheduleTime',
			'actualStartTime',
			'actualEndTime',
			'estimateStartTime',
			'estimateEndTime',
		],
		(fieldKey) => {
			if (has(flight, fieldKey)) {
				return {
					[`display${upperFirst(fieldKey)}`]: formatDate(get(flight, fieldKey), 'HHmm'),
					[`display${upperFirst(fieldKey)}WithDate`]: formatDate(get(flight, fieldKey), 'HHmm(DD)'),
				};
			}
			return null;
		},
	);

	let displayTimeFields = map(['updateTime'], (fieldKey) => {
		if (has(flight, fieldKey)) {
			return {
				[`display${upperFirst(fieldKey)}`]: formatDate(get(flight, fieldKey), 'HHmmss'),
			};
		}
		return null;
	});

	let mergedFields = concat([{}], displayUpperFields, displayUpperFirstFields, displayTimeFields);
	mergedFields = compact(mergedFields);
	let result = extend.apply(null, mergedFields);
	return extend({}, flight, result);
};
export const fixTakeOffNormalStatus = (flight) => {
	if (!flight) {
		return flight;
	}
	let result = { takeOffNormalStatusText: takeOffNormalStatus[flight.takeOffNormalStatus] };
	return extend({}, flight, result);
};

export const mergeRunway = (f) => {
	if (!f) {
		return f;
	}
	let result = { displayRunway: f.runway || f.expectRunWay };
	return extend({}, f, result);
};

export const fixDelayReasonMerge = (f) => {
	if (!f) {
		return f;
	}
	let result = { delayReasonMerge: f.delaySubReason ? f.delayMainReason + ',' + f.delaySubReason : '' };
	return extend({}, f, result);
};
/**
 * 构建航线显示字段
 */
export const fixRoutes = (flight) => {
	let routes = get(flight, 'routesExt');
	let fullRoutes = null;
	let movement = get(flight, 'movement');
	if (movement == 'A') {
		routes = orderBy(routes, ['routeNo'], ['desc']);
		fullRoutes = flow([(d) => orderBy(d, ['routeNo']), (d) => drop(d), (d) => concat(routes, d)])(get(flight, 'departFlight.routesExt'));
	} else {
		routes = orderBy(routes, ['routeNo']);
		fullRoutes = flow([(d) => orderBy(d, ['routeNo'], ['desc']), (d) => dropRight(d), (d) => concat(d, routes)])(get(flight, 'arriveFlight.routesExt'));
	}

	let displayRoutes = map(routes, (f) => {
		let iata = get(f, 'airport');
		let cityName = get(Airports, `${iata}.city`);
		if (!cityName) {
			cityName = iata;
			log.error(`can not found city name for airport ${cityName}`);
		}
		return cityName;
	});

	let displayRoutesIATA = map(routes, (f) => {
		return get(f, 'airport');
	});

	let displayFullRoutes = map(fullRoutes, (f) => {
		let iata = get(f, 'airport');
		let cityName = get(Airports, `${iata}.city`);
		if (!cityName) {
			cityName = iata;
			log.error(`can not found city name for airport ${cityName}`);
		}
		return cityName;
	});

	let displayFullRoutesIATA = map(fullRoutes, (f) => {
		return get(f, 'airport');
	});

	return extend({}, flight, {
		displayRoutes: displayRoutes,
		displayRoutesIATA: displayRoutesIATA,
		displayFullRoutes: displayFullRoutes,
		displayFullRoutesIATA: displayFullRoutesIATA,
	});
};
/**
 * 处理登机口
 */
const fixGates = (flight) => {
	let gates = map(get(flight, 'gates', []), (item) => {
		return item.gateId;
	}).join(',');
	return extend({}, flight, { displayGate: gates });
};
/**
 * 关联航班并不需要太多的属性, 这里做了一些简化
 * @param  {[type]} flights [description]
 * @return {[type]}         [description]
 */
const normalize = (flight) => {
	let movement = get(flight, 'movement');
	if (movement == 'D') {
		const pickArriveFlightProperties = ['flightId', 'flightNo', 'acarsOn', 'acarsIn', 'aircraftNo', 'aircraftType', 'aircraftTypeName', 'scheduleTime', 'sta', 'eta', 'mixEta', 'eti', 'ata', 'preAtd', 'preEtd', 'craftSizeType', 'flightIndicator', 'flightIndicatorName', 'flightTypeName', 'flightStatus', 'flightStatusText', 'flightExtRemark', 'flightExtStatus', 'flightExtStatusText', 'groundService', 'routes', 'routesExt', 'runway', 'seat', 'terminal', 'variflights'];
		let arriveFlight = pick(get(flight, 'arriveFlight'), pickArriveFlightProperties);
		arriveFlight = flow([(d) => extend({ movement: 'A' }, d), calcOperationDate, addDisplayField, fixRoutes])(arriveFlight);

		let fixedFlight = omit(flight, ['arriveFlight']);

		return extend({}, fixedFlight, { _id: get(flight, 'flightId') }, { arriveFlight: arriveFlight });
	} else if (movement == 'A') {
		const pickDepartFlightProperties = ['flightId', 'flightNo', 'acarsOff', 'acarsOut', 'aircraftNo', 'aircraftType', 'aircraftTypeName', 'scheduleTime', 'std', 'etd', 'estimateTime', 'atd', 'gates', 'craftSizeType', 'flightIndicator', 'flightIndicatorName', 'flightTypeName', 'flightStatus', 'flightStatusText', 'flightExtRemark', 'flightExtStatus', 'flightExtStatusText', 'groundService', 'routes', 'routesExt', 'runway', 'seat', 'terminal', 'variflights'];
		let departFlight = pick(get(flight, 'departFlight'), pickDepartFlightProperties);
		departFlight = flow([(d) => extend({ movement: 'D' }, d), calcOperationDate, addDisplayField, fixRoutes, fixGates])(departFlight);
		let fixedFlight = omit(flight, ['departFlight']);
		return extend({}, fixedFlight, { _id: get(flight, 'flightId'), departFlight: departFlight });
	}
	return extend({}, flight, { _id: get(flight, 'flightId') });
};

/**
 * 从航班号中提取航空公司代码（IATA 二字码）
 */
const addAirlineIATA = (flight) => {
	let flightNo = get(flight, 'flightNo');
	let iata = flightNo ? flightNo.substring(0, 2) : '';
	return extend({}, flight, { IATA: toUpper(iata) });
};

/**
 * 修正由于二字码产生的错误的航空公司中文名称
 */
export const fixAirlineCNName = (flight) => {
	let fixedFlight = {};
	let iata = get(flight, 'IATA');
	switch (iata) {
		case 'CA':
			if (indexOf(['货包', '货加', '货班', '货加班'], get(flight, 'flightTypeName')) > -1) {
				set(fixedFlight, 'airlineCnName', '中国国际货运航空公司');
			} else {
				set(fixedFlight, 'airlineCnName', '中国国际航空有限公司');
			}
			break;
		case 'UA':
			set(fixedFlight, 'airlineCnName', '美国联合航空公司');
			break;
	}
	return extend({}, flight, fixedFlight);
};

/**
 * 处理进离港显示, 包括取消 返航等
 */
const fixMovement = (flight) => {
	let diplayName = '';
	if (get(flight, 'cancel')) {
		diplayName = '取消';
	} else if (get(flight, 'return')) {
		diplayName = '返航';
	} else if (get(flight, 'alternate')) {
		diplayName = '备降';
	} else {
		diplayName = get(flight, 'movement');
	}
	return extend({}, flight, { displayMovement: diplayName });
};

/**
 * 修正航班状态显示
 */
export const fixFlightStatus = (flight) => {
	let text = get(flight, 'flightStatusText');
	let shortStatusText = '';
	text = text ? text : get(flight, 'flightStatus');
	shortStatusText = text == '前方起飞' ? '前起' : text;
	shortStatusText = shortStatusText == '催促登机' ? '催登' : shortStatusText;
	return extend({}, flight, {
		displayFlightStatus: text,
		displayShortFlightStatus: shortStatusText,
	});
};

/**
 * 修正航班外部状态显示
 * 内部调用自身方法处理关联航班状态
 */
export const fixFlightExtStatus = (flight) => {
	let externalStatusText = get(flight, 'flightExtStatusText');
	externalStatusText = externalStatusText ? externalStatusText : get(flight, 'flightExtRemark');
	let movement = get(flight, 'movement');
	let relativeFlight = movement == 'A' ? get(flight, 'departFlight') : get(flight, 'arriveFlight');
	let shortStatusText = '';

	let reg = RegExp('延误');

	if (externalStatusText == '前方起飞') {
		shortStatusText = '前起';
	} else if (externalStatusText == '催促登机') {
		shortStatusText = '催登';
	} else {
		shortStatusText = externalStatusText;
	}
	if (reg.test(externalStatusText)) {
		shortStatusText = '延误';
	}
	if (relativeFlight && get(relativeFlight, 'flightId')) {
		relativeFlight = fixFlightStatus(relativeFlight);
	}
	let fixData = {
		flightExtStatusText: externalStatusText,
		flightExtShortStatusText: shortStatusText,
	};
	let relativeFlightName = movement == 'A' ? 'departFlight' : 'arriveFlight';
	fixData[relativeFlightName] = relativeFlight;
	return extend({}, flight, fixData);
};

/**
 * 修正前站起飞, 实际起飞后显示实际, 否则显示预计
 */
const fixPreETDOrATD = (flight) => {
	let etd = get(flight, 'preEtd');
	let atd = get(flight, 'preAtd');
	let displayPreATDOrETD;
	if (etd && atd) {
		displayPreATDOrETD = `${formatDate(etd, 'HHmm')}/${formatDate(atd, 'HHmm')}(${formatDate(etd, 'DD')})`;
	} else if (etd) {
		displayPreATDOrETD = `${formatDate(etd, 'HHmm')}(${formatDate(etd, 'DD')})`;
	} else if (atd) {
		displayPreATDOrETD = `${formatDate(atd, 'HHmm')}(${formatDate(atd, 'DD')})`;
	}
	return extend({}, flight, { displayPreATDOrETD: displayPreATDOrETD });
};

const fixCounters = (flight) => {
	let counters = map(get(flight, 'counters', []), (item) => item.counterId).join(',');
	return extend({}, flight, { displayCounters: counters });
};

const fixCarousels = (flight) => {
	let carousels = map(get(flight, 'carousels', []), (item) => item.carouselId).join(',');
	return extend({}, flight, { displayCarousels: carousels });
};

/**
 * 构建可模糊搜索的字段
 */
export const buildSearchField = (flight) => {
	let searchField = map(['flightNo', 'aircraftNo', 'seat', 'displayGate', 'router', 'displayRoutes', 'displayRouter', 'arriveFlight.flightNo', 'arriveFlight.aircraftNo', 'arriveFlight.seat', 'arriveFlight.displayRoutes', 'departFlight.flightNo', 'departFlight.aircraftNo', 'departFlight.seat', 'departFlight.displayRoutes'], (key) => {
		let field = get(flight, key, '');
		return isArray(field) ? field : [field];
	});
	searchField = concat.apply(null, searchField);
	searchField = compact(searchField);
	return extend({}, flight, { search: toUpper(searchField.join('|')) });
};

/**
 * 航班取消判定
 * @param  {[type]} flight [description]
 * @return {[type]}        [description]
 */
export const calcCancel = (flight) => {
	let flightStatus = get(flight, 'flightStatus');
	let flightStatusText = get(flight, 'flightStatusText', '') || '';
	let flightExtStatus = get(flight, 'flightExtStatus');
	let flightExtStatusText = get(flight, 'flightExtStatusText', '') || '';
	let aircraftNo = get(flight, 'aircraftNo', '') || '';
	if (indexOf(['CAN', 'CAN001', 'CANCEL'], flightStatus) > -1 || flightStatusText.indexOf('取消') > -1 || indexOf(['CAN', 'CAN001', 'CANCEL'], flightExtStatus) > -1 || flightExtStatusText.indexOf('取消') > -1 || aircraftNo.indexOf('XXXX') > -1) {
		return extend({}, flight, {
			cancel: true,
		});
	} else {
		return extend({}, flight, {
			cancel: false,
		});
	}
};

/**
 * 航班返航判定
 * @param  {[type]} flight [description]
 * @return {[type]}        [description]
 */
export const calcReturn = (flight) => {
	if (get(flight, 'movement') == 'A' && get(flight, 'flightTypeName') == '返航') {
		return extend({}, flight, { return: true });
	}
	return extend({}, flight, { return: false });
};

/**
 * 航班备降判定(从其它机场备降到本场)
 * @param  {[type]} flight [description]
 * @return {[type]}        [description]
 */
export const calcAlternate = (flight) => {
	if (get(flight, 'movement') == 'A' && get(flight, 'flightTypeName') == '备降') {
		return extend({}, flight, { alternate: true });
	}
	return extend({}, flight, { alternate: false });
};

/**
 * 计算是否完成的航班
 * 进港则是已经落地
 * 离港则是已经起飞
 */
export const calcCompleted = (flight) => {
	let movement = get(flight, 'movement');
	if (movement == 'A' && has(flight, 'ata')) {
		return extend({}, flight, { completed: true });
	} else if (movement == 'D' && has(flight, 'atd')) {
		return extend({}, flight, { completed: true });
	} else {
		return extend({}, flight, { completed: false });
	}
};
/**
 * 计算航班类型是否纳入正常率的统计
 * 依赖取消的计算
 */
export const calcIncludeInPercentReport = (flight) => {
	let includeInPercentReport = indexOf(PercentReportFlightType, get(flight, 'flightTypeName')) > -1 && !get(flight, 'cancel');
	return extend({}, flight, { includeInPercentReport: includeInPercentReport });
};
/**
 * 始发判定: 同一运营日内 没有进港计划 并且离港计划大于等于6点
 * 如果同一运营日内的到港航班的机尾号不等于离港航班的机尾号则视为没有进港计划
 * 依赖运营日计算, 所以调用前要确保已经计算过运营日
 * @param  {[type]} flight [description]
 * @return {[type]}        [description]
 */
export const calcOriginated = (flight) => {
	if (get(flight, 'movement') == 'A') {
		return flight;
	}

	let arrival = get(flight, 'arriveFlight');
	let fixArrival = calcIncludeInPercentReport(arrival);

	let orCriteria = [has(flight, 'arriveFlight') !== true, get(flight, 'operationDate') !== get(flight, 'arriveFlight.operationDate'), get(flight, 'operationDate') === get(flight, 'arriveFlight.operationDate') && moment(get(flight, 'arriveFlight.sta'), 'x').hour() < 6, get(flight, 'aircraftNo') !== get(flight, 'arriveFlight.aircraftNo'), get(fixArrival, 'includeInPercentReport') !== true, get(flight, 'std') < get(fixArrival, 'sta')];
	let andCriteria = [moment(get(flight, 'std'), 'x').hour() >= 6, get(flight, 'includeInPercentReport') === true, some(orCriteria)];
	let check = every(andCriteria);
	return extend({}, flight, {
		originated: check,
	});
};


/**
 * 计算上一站离港城市
 * @param  {[type]} flight [description]
 * @return {[type]}        [description]
 */
const calcArrivalFromCity = (flight) => {
	if (get(flight, 'movement') === 'D') {
		return flight;
	}
	let result = {};
	let routes = get(flight, 'routesExt');
	let preCity = null;
	each(routes, (r) => {
		let city = toUpper(get(r, 'airport'));
		if (toUpper(city) === 'CTU') {
			set(result, 'preCity', preCity);
			set(result, 'preCityName', get(Airports, `${preCity}.city`) || preCity);
			return false;
		}
		preCity = city;
	});
	return extend({}, flight, result);
};

/**
 * 计算下一站到港城市
 * @param  {[type]} flight [description]
 * @return {[type]}        [description]
 */
const calcDepartureToCity = (flight) => {
	if (get(flight, 'movement') === 'A') {
		return flight;
	}
	let routes = get(flight, 'routes');
	let nextCity = null;
	let skipCity = false;
	each(routes, (r) => {
		nextCity = toUpper(get(r, 'airport'));
		if (skipCity) {
			return true;
		}
		if (toUpper(nextCity) === 'CTU') {
			skipCity = true;
		}
	});
	return extend({}, flight, {
		nextCity: nextCity,
		nextCityName: get(Airports, `${nextCity}.city`) || nextCity,
	});
};

/**
 * 早高峰小时, 6点到10点
 * @param  {[type]} flight [description]
 * @return {[type]}        [description]
 */
export const calcMorningBusyHourFlight = (flight) => {
	let hour = moment(get(flight, 'scheduleTime'), 'x').hour();
	return extend({}, flight, {
		morningBusyHourFlight: hour >= 6 && hour < 10,
	});
};

export const calcOriginatedMorningBusyHourFlight = (flight) => {
	let hour = moment(get(flight, 'scheduleTime'), 'x').hour();
	return extend({}, flight, {
		originatedMorningBusyHourFlight: get(flight, 'originated', false) && get(flight, 'morningBusyHourFlight', false),
	});
};

/**
 * 过滤掉共享航班, 目前 AOC 只显示主航班,
 * @param  {[type]} flights [description]
 * @return {[type]}         [description]
 */
export const filterSharedFlight = (flights) => {
	return filter(flights, (f) => !has(f, 'masterFlightId'));
};


const NeedCheckedPropertiesForChange = ['seat', 'aircraftNo', 'displayGate'];
/**
 * 检索航班属性变化, 采用的是 JSON 序列化进行对比, 只支持简单属性和数组
 * 复杂的对象属性 JSON 序列化比对会有问题,
 * e.g. {a:1, b:2} {b:2, a:1} 可能序列化后的字符串不相等, 但是实际对比的对象是相等的
 * @todo 将对象的属性Key提取为数组并排序后, 再按照排序后的属性顺序进行 JSON 序列化,
 * 而且需要递归, 虽然效率比原生的低, 但是可以保持序列化后的字符串一致性
 * @param  {Object} oldValue 历史数据
 * @param  {Object} newValue 新数据
 * @return {Object} 变化前的旧属性值
 */
export const calcPropertyChanges = (oldValue, newValue) => {
	/**
	 * 1. 取出需要比对的属性
	 * 2. 由于我们只比对有值且不相同的属性, 所以需要互相填充一下空白的属性, 此举目的是简化对比属性进行空判断
	 * 3. 进行属性对比, 只返回原始值于新值不相等的属性, 否则返回 null
	 * 4. 去除 null 属性
	 * 5. 混合差异属性
	 */
	let diff = flow([
		(d) => map(d, (i) => pick(i, NeedCheckedPropertiesForChange)),
		(d) => [extend({}, d[1], d[0]), extend({}, d[0], d[1])],
		(d) =>
			map(d[1], (v, k) => {
				if (JSON.stringify(get(d[0], k)) !== JSON.stringify(v)) {
					return {
						[k]: v,
					};
				}
				return null;
			}),
		compact,
		(d) => extend.apply(null, d),
	])([newValue, oldValue]);
	let flightId = get(oldValue, 'flightId');
	let flightNo = get(oldValue, 'flightNo');
	each(diff, (v, k) => {
		log.info(`flight ${flightNo} have changed properties: ${k}: ${v}`);
	});
	return diff;
};

export const calcDelayTime = (flight) => {
	let now = memoryStore.getItem('global').now;
	let movement = get(flight, 'movement');
	if (movement === 'A') {
		let ata = get(flight, 'ata');
		let sta = get(flight, 'sta');
		let staLimit = sta - 10 * 60 * 1000;
		if (ata && ata > staLimit) {
			return parseInt((ata - staLimit) / 60 / 1000);
		} else if (!ata && now > staLimit) {
			return parseInt((now - staLimit) / 60 / 1000);
		} else {
			return null;
		}
	} else if (movement === 'D') {
		let atd = get(flight, 'atd');
		let std = get(flight, 'std');
		let stdLimit = std + 30 * 60 * 1000;
		if (atd && atd > stdLimit) {
			return parseInt((atd - stdLimit) / 60 / 1000);
		} else if (!atd && now > stdLimit) {
			return parseInt((now - stdLimit) / 60 / 1000);
		} else {
			return null;
		}
	}
};

/**
 * 当前运营日航班统计
 * totalPlan 总计划航班数
 * completedPlan 完成航班数
 * departurePlan 离港计划数
 * arrivalPlan 到港计划数
 * completedDeparturePlan 完成离港数
 * completedArrivalPlan 完成到港数
 * return 返航数
 * cancel 取消数
 * alternate 备降数
 */
export const calcSummary = (flights) => {
	let summary = reduce(
		flights,
		(result, flight) => {
			result.totalPlan++;
			if (get(flight, 'movement') === 'A') {
				result.arrivalPlan++;
				if (has(flight, 'ata')) {
					result.completedArrivalPlan++;
					result.completedPlan++;
				}
			} else {
				result.departurePlan++;
				if (has(flight, 'atd')) {
					result.completedDeparturePlan++;
					result.completedPlan++;
				}
			}
			get(flight, 'return') && result.return++;
			get(flight, 'cancel') && result.cancel++;
			get(flight, 'alternate') && result.alternate++;
			return result;
		},
		{
			totalPlan: 0,
			completedPlan: 0,
			arrivalPlan: 0,
			completedArrivalPlan: 0,
			departurePlan: 0,
			completedDeparturePlan: 0,
			return: 0,
			cancel: 0,
			alternate: 0,
		},
	);
	return Promise.resolve(summary);
};

/**
 * 当前运营日航班率统计
 * originatedTotal 始发总数
 * originatedDelay 始发延误数
 * departureTotal 航班正常总数
 * departureDelay 航班延误数
 * takeOffTotal 放行正常总数
 * takeOffDelay 放行延误数
 * morningBusyHourTotal 早高峰航班正常总数
 * morningBusyHourDelay 早高峰航班延误数
 */


export const filterFlightsByRole = (flights, role = {}) => {
	let { reversal, data = [] } = role;
	// reversal为真就排除data里面的航班 为假就筛选data里面的航班
	let filterFlights;
	if (reversal) {
		filterFlights = filter(flights, (item) => data.indexOf(item.airlineCode) <= -1);
	} else {
		filterFlights = filter(flights, (item) => data.indexOf(item.airlineCode) > -1);
	}
	// 处理过滤了权限之后 序号变更的问题
	return map(filterFlights, (item, index) => ({ ...item, flightIndex: index + 1 }));
};

// 通过后端返回的权限过滤航班
export const filterRoleFlights = (flights) => {
	let roleFlight = memoryStore.getItem('global').roleFlights
	return filterFlightsByRole(flights, roleFlight);
};

// 其他的模块 比如除冰里面用到了航班动态的字段转换功能
export const fixField = (oFlights) => {
	let flights = map(oFlights, (item) => {
		let isItemObj = isObject(item);
		let f = flightDB.by('flightId', isItemObj ? item.flightId : item);
		return extend(f, item);
	});
	return flow([filterRoleFlights, addSerialNumber])(flights);
};

// 其他的模块 比如除冰里面用到了航班动态的字段转换功能
export const getFlightByIds = (oFlights) => {
	let flights = map(oFlights, (item) => {
		let isItemObj = isObject(item);
		let f = flightDB.by('flightId', isItemObj ? item.flightId : item);
		return f?extend({ ...f }, item):item
	});
	return flow([addSerialNumber])(flights);
};

// 实时检测WebsocketResponseData是否完成; 某些依赖于航班动态的数据可能会先加载出来
export const checkWebsocketResponseDataFinish = () => {
	return new Promise((resolve) => {
		setInterval(() => {
			if (memoryStore.getItem('global').websocketDataFinish === true) {
				resolve();
			}
		}, 300);
	});
};
export const calcMaintainTime = (flight) => {
    if (get(flight, 'movement') === 'A') {
        return flight;
    }
    let maintainTime = null;
    let takeOffDeadline = null;
    let offBlockDeadline = null;
    if (get(flight, 'originated')) {
        maintainTime = get(flight, 'std') + 30 * 60 * 1000;
        takeOffDeadline = get(flight, 'std') + 30 * 60 * 1000;
        offBlockDeadline = get(flight, 'std');
    } else if (get(flight, 'arriveFlight.ata')) {
        if (calcDelay(get(flight, 'arriveFlight'))) {
            let planTime = get(flight, 'std') - get(flight, 'arriveFlight.sta');
            maintainTime = get(flight, 'arriveFlight.ata') + planTime + (10 + 30) * 60 * 1000;
            takeOffDeadline = get(flight, 'arriveFlight.ata') + planTime + (10 + 30) * 60 * 1000;
            offBlockDeadline = get(flight, 'arriveFlight.ata') + planTime + 10 * 60 * 1000;
        } else {
            maintainTime = get(flight, 'std') + 30 * 60 * 1000;
            takeOffDeadline = get(flight, 'std') + 30 * 60 * 1000;
            offBlockDeadline = get(flight, 'std');
        }
    }
    // log.info(`maintain time ${moment(maintainTime).format('HHmm')}`);
    return extend({}, flight, {
        maintainTime: maintainTime,
        takeOffDeadline: takeOffDeadline,
        offBlockDeadline: offBlockDeadline,
    });
};

/**
 * 设置isDelay默认为false 高级搜索可用
 */
export const setDefaultDelay = (flight) => {
	let isDelay = get(flight, 'isDelay');
	return extend({}, flight, { isDelay: !!isDelay });
};

export const getFlightDelayWarn = (flight) => {
	/*
		* Ctot - 放行标准起飞时间 < -10M 绿色
			ctot - 放行标准起飞时间 > 10M 红色
			有ctot和放行标准起飞的其他 : 黄色
		* */
	let { ctot, dstt } = flight;
	let tenMin = 10 * 60 * 1000;
	if (dstt && ctot) {
		if (ctot - dstt < -tenMin) {
			return 'departWarnGreen';
		}
		if (ctot - dstt > tenMin) {
			return 'departWarnRed';
		}
		return 'departWarnYellow';
	} else {
		return false;
	}
};
