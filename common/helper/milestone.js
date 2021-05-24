import moment from 'moment';
import { cloneDeep, compact, concat, each, every, extend, filter, find, flow, get, has, head, indexOf, keyBy, keys, map, max, omit, orderBy, pick, reduce, set, some, toLower, toUpper, upperFirst } from 'lodash';
import { formatDate, getNaturalDate, getOperationDate } from 'helper/date';
import Logger from 'logger';

const log = new Logger('helper:milestone');

/**
 * 修正里程碑显示名称, 添加缩写
 */
const fixMilestoneName = (milestoneItem) => {
	let orgName = get(milestoneItem, 'mileStoneName');
	let key = `${get(milestoneItem, 'mileStoneName')}-${get(milestoneItem, 'mileStoneStepName')}`;

	let shortName = orgName;
	each(
		{
			'首件行李交付-首件行李交付': '行李交付',
			'垃圾回收完成-垃圾回收完成': '垃圾回收',
			'货邮单送达-货邮单送达': '货邮单',
			'牵引车到位-牵引车到位': '牵引车',
			'舱单送达-舱单送达': '舱单',
			'国内登机-开始': '国内登机开始',
			'国内登机-结束': '国内登机结束',
			'国际登机-开始': '国际登机开始',
			'国际登机-结束': '国际登机结束',
			'关货仓门-关货仓门': '关货舱门',
		},
		(newName, name) => {
			if (key == name) {
				shortName = newName;
				return false;
			}
		},
	);
	return extend({}, milestoneItem, {
		shortMilestoneName: shortName,
	});
};

/**
 * 修正里程碑时间显示格式
 */
const fixDisplayTime = (milestoneItem) => {
	let addedField = map(['planTime', 'actualTime', 'estimatedTime'], (key) => {
		let time = get(milestoneItem, key, null);
		time = moment(time, 'x');
		if (time.isValid()) {
			return {
				[`display${upperFirst(key)}`]: time.isValid() ? time.format('HH:mm') : null,
			};
		}
		return null;
	});
	addedField = compact(addedField);
	let fileds = concat([milestoneItem], addedField);
	return extend.apply(null, fileds);
};

const importantMilestoneKeys = [
	{ '上轮挡-结束': '上轮挡-结束' },
	{ '下客完成-下客完成': '下客完成-下客完成' },
	{ '签署放行-签署放行': '签署放行-签署放行' },
	{ '允许登机-允许登机': '允许登机-允许登机' },
	{ '国内登机-开始': '登机-开始' },
	{ '国内登机-结束': '登机-结束' },
	{
		'国际登机-开始': '登机-开始',
	},
	{
		'国际登机-结束': '登机-结束',
	},
	{
		'关客舱门-关客舱门': '关客舱门-关客舱门',
	},
	{
		'关货仓门-关货仓门': '关货仓门-关货仓门',
	},
	{
		'边海放行-边海放行': '边海放行-边海放行',
	},
	{
		'撤轮档-撤轮档': '撤轮档-撤轮档',
	},
	{
		'保障结束-保障结束': '保障结束-保障结束',
	},
	{
		'牵引车到位-牵引车到位': '牵引车到位-牵引车到位',
	},
	{
		'飞机推出-飞机推出': '飞机推出-飞机推出',
	},
	{
		'COBT-COBT': 'COBT-COBT',
	},
	{
		'CTOT-CTOT': 'CTOT-CTOT',
	},
];

export const addImportantMark = (milestone) => {
	let key = `${get(milestone, 'mileStoneName')}-${get(milestone, 'mileStoneStepName')}`;
	return extend(
		{
			important: some(importantMilestoneKeys, key),
		},
		milestone,
	);
};

/**
 * 提取航控关心的重要里程碑
 */
export const getImportantMilestone = (milestone) => {
	let milestoneList = get(milestone, 'mileStoneList', []);
	let mapper = extend.apply(null, importantMilestoneKeys);
	return flow([
		(d) =>
			map(d, (m) => {
				let key = `${get(m, 'mileStoneName')}-${get(m, 'mileStoneStepName')}`;
				return extend(m, {
					primaryKey: key,
				});
			}),
		(d) =>
			filter(d, (m) => {
				return some(importantMilestoneKeys, get(m, 'primaryKey'));
			}),
		(d) =>
			map(d, (m) => {
				return {
					[mapper[get(m, 'primaryKey')]]: omit(m, ['primaryKey']),
				};
			}),
		(d) => {
			return extend.apply(null, d);
		},
	])(milestoneList);
};

const hiddenMilestoneKeys = ['对准跑道-对准跑道', '上轮挡-开始', '机上清洁-开始', 'COBT-COBT', 'CTOT-CTOT'];

/**
 * 隐藏部分不适合的里程碑
 */
export const hideMilestone = (milestone) => {
	let key = `${get(milestone, 'mileStoneName')}-${get(milestone, 'mileStoneStepName')}`;
	return indexOf(hiddenMilestoneKeys, key) > -1 ? null : milestone;
};

/**
 * 提取重要的数据的COBT CTOT
 * ATC: Air Traffic Control
 */
export const getImportantData = (milestone) => {
	let list = get(milestone, 'mileStoneList');
	return flow([
		(d) =>
			map(d, (item) => {
				let key = `${get(item, 'mileStoneName')}-${get(item, 'mileStoneStepName')}`;
				let actualTime = get(item, 'actualTime');
				if (indexOf(['COBT-COBT', 'CTOT-CTOT'], key) > -1 && actualTime) {
					return {
						[`${get(item, 'mileStoneName')}ByATC`]: actualTime,
					};
				}
				if (key == '保障结束-保障结束' && actualTime) {
					return {
						TOBT: actualTime,
					};
				}
				return null;
			}),
		(d) => compact(d),
		(d) => extend.apply(null, d),
	])(list);
};
/**
 * 构建特殊的里程碑节点，边海放行
 * 边海放行的计划时间为：边防放行和海关放行两个里程碑的最大值
 * 边海放行的实际时间为：当边防放行和海关放行有一个未完成时，实际时间为空；当边防放行和海关放行都完成时，取两个实际完成时间的最大值作为边海放行的实际时间
 *
 * 因为混合航班，例如成都到青岛再到名古屋，只有一个节点
 * 所以有一个只取一个
 * @param mileStoneList
 * @returns {*}
 */
const combineCustomMilestone = (milestoneList) => {
	let sliceIndex = [],
		list = milestoneList;
	let couple = compact(
		map(milestoneList, (m, i) => {
			if (m.mileStoneName === '离港边防' || m.mileStoneName === '离港海关') {
				sliceIndex.push(i);
				return m;
			}
		}),
	);
	if (couple.length === 0) {
		return list;
	} else {
		// if(couple.length === 1){
		//     log.info('couple.length === 1');
		// }
		return flow([
			(d) => {
				return reduce(
					d,
					(result, item) => {
						item.planTime && result.planTime.push(item.planTime);
						item.actualTime && result.actualTime.push(item.actualTime);

						result.taskId = item.taskId;
						result.flightId = item.flightId;
						return result;
					},
					{ planTime: [], actualTime: [] },
				);
			},
			(d) => {
				let actualTime = null;
				//如果有两个计划时间表示有两个节点
				d.planTime.length === 1 && (actualTime = d.actualTime[0]);
				d.planTime.length === 2 && d.actualTime.length === 2 && (actualTime = max(d.actualTime));

				return {
					planTime: max(d.planTime),
					actualTime: actualTime,
				};
			},
			(d) => {
				return extend(d, {
					stepId: 'customMilestone',
					mileStoneName: '边海放行',
					mileStoneStepName: '边海放行',
				});
			},
			(d) => {
				list.splice(max(sliceIndex) + 1, 0, d);
				return list;
			},
		])(couple);
	}
};
/**
 * 处理里程碑
 */
export const processMilestone = (milestone) => {
	let milestoneList = get(milestone, 'mileStoneList', []);

	let fixedMilestoneList = flow([
		combineCustomMilestone,
		(d) =>
			map(d, (m) => {
				return flow([fixMilestoneName, fixDisplayTime, addImportantMark, hideMilestone])(m);
			}),
	])(milestoneList);

	return extend({}, milestone, {
		mileStoneList: compact(fixedMilestoneList),
	});
};

export const fixMilestoneDisplayTime = fixDisplayTime;
