import {extend, filter, get, map, pick} from "lodash";
import {allField, defaultColumns} from "@/lib/flightAllFields";
import postal from 'postal'
var myFlightHeader;
const combineHeader = (columns) => {
  return map(columns, (item) => {
    let def = get(allField, item.key);
    return extend({}, def, item);
  });
};

export const updateListHeader = (columns) => {
  let newColumns = map(columns, (item) => {
    return pick(item, ['key', 'lock']);
  });
  localStorage.setItem('personalColumns', JSON.stringify(newColumns));
  postal.publish({
    channel: 'Web',
    topic: 'Flight.GetHeader.Res',
    data: columns,
  });
  postal.publish({
    channel: 'Worker',
    topic: 'Flight.GetHeader.Res',
    data: JSON.parse(JSON.stringify(columns)),
  });
  postal.publish({
    channel: 'Worker',
    topic: 'Flight.UpdateColumn',
    data: newColumns,
  });
  // myFlightHeader = combineHeader(columns);
};
export const reSetHeader = () => {
  localStorage.removeItem('personalColumns');
  myFlightHeader = combineHeader(defaultColumns);
};

/**
 * 如果本地有值，依据规则合并
 * 以后有编辑顺序和是否显示还要做调整！
 */
export const getListHeader = () => {
  if (!myFlightHeader) {
    let localColumns = JSON.parse(localStorage.getItem('personalColumns'));
    localColumns = filter(localColumns, (item) => allField[item.key]); // 过滤掉本地有 代码中已经删除的列
    let personalColumns = localStorage.getItem('personalColumns') ? localColumns : defaultColumns;
    myFlightHeader = combineHeader(personalColumns);
  }
  return myFlightHeader;
};
