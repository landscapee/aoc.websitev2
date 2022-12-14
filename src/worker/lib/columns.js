/**
 * 接收process/channel 表头的数据
 * 接收view 表头顺序修改，锁定，显示与否
 * reference:true,表示该列被参考项，不显示
 * referenceTo:'scheduleTime',表示关联到某个列，如果是排序则用参考列排序
 */

import {get, map, each, extend, pick, keyBy, filter} from 'lodash';
import Logger from 'lib/logger';
import {memoryStore} from "@/worker/lib/memoryStore";
import {allField, defaultColumns, filedConvert} from "@/lib/flightAllFields";
const log = new Logger('columns:Define');

export const getListHeader = () => {
	let myFlightHeader = memoryStore.getItem('global').flightHeader
	myFlightHeader = !myFlightHeader ? defaultColumns : myFlightHeader
	myFlightHeader = filter(myFlightHeader, (item) => allField[item.key]); // 过滤掉本地有 代码中已经删除的列
	// return myFlightHeader
	let header = map(myFlightHeader, (h) => {
		h = extend({}, h, get(allField, [h.key]));
		if (filedConvert[h.key]) {
			return extend({}, filedConvert[h.key], h);
		} else {
			return h;
		}
	});
	return header
};
