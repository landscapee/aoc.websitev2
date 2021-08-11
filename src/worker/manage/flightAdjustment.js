import {memoryStore} from '../lib/memoryStore';
import {
  concat,
  every,
  extend,
  filter,
  flow,
  get,
  groupBy,
  head,
  isArray,
  last,
  map,
  merge,
  orderBy,
  toUpper
} from "lodash";
import moment from "moment";
import {flightDB} from "@/worker/lib/storage";
import {addSerialNumber, calcDelayTime, checkWebsocketResponseDataFinish, filterRoleFlights} from "@/lib/helper/flight";
import {getOperationDate} from '@/lib/helper/date'
import Logger from "@/lib/logger";
import {getListHeader} from "@/worker/lib/columns";
import {flightHisDB} from "@/worker/lib/storageHis";
let Options = { searchQueries: [{ movement: { $eq: 'D' } }] };
const log = new Logger('worker:flight');
let DISPLAYNULL = '--'
let columns = [];
let todayTopFlights;
let worker;
let flightDay = 0;

export const setFilterOption = (data) => {
  Options = data ? extend(Options, data) : { searchQueries: [{ movement: { $eq: 'D' } }] };
  //return refreshFlights(true);
};

/**
 * 通过 begin ,end 日期 和 searchKey导入航班
 * @returns {*}
 */
const loadDefaultFlights = () => {
  let now = memoryStore.getItem('global').now || 0;
  let searchQueries = get(Options, 'searchQueries');
  let begin, end;
  let beginref = flightDay;
  let endref = flightDay + 1;
  begin = moment(getOperationDate(moment(now).add(beginref, 'days')), 'YYYYMMDDHH').valueOf();
  end = moment(getOperationDate(moment(now).add(endref, 'days')), 'YYYYMMDDHH').valueOf();
  let findQuery = [{ scheduleTime: { $gte: begin } }, { scheduleTime: { $lt: end } }];
  if (searchQueries) {
    findQuery = findQuery.concat(searchQueries);
  }
  let query = {};
  // 当cancel为true的时候 后台返回的flightStatusText 有可能还是'正常' 这里特殊处理
  // let cancelIndex = findIndex(findQuery, { cancel: { $eq: true } });
  // if (cancelIndex > -1) {
  // 	findQuery.splice(cancelIndex, 1);
  // 	query['$or'] = [{ cancel: { $eq: true } }, { $and: findQuery }];
  // } else {
  // 	query = { $and: findQuery };
  // }
  query = { $and: findQuery };
  // let query = { $or: [{ cancel: { $eq: true } }, { $and: findQuery }] };
  let flights = flightDay === 0 ? flightDB.find(query) : flightHisDB.find(query);
  // let flights = flightDB.find({ $and: findQuery });
  //quick and dutty fix. 反正后序修改污染数据库, 这里克隆一下
  return map(flights, (f) => {
    return extend({}, f);
  });
};

/**
 * 把字段根据列定义转换为界面需要的数据
 * @param f
 * @returns {{flightId: *}}
 */
const proFlightField = (f) => {
  let flight = { flightId: f.flightId };
  map(columns, (column) => {
    let value = column.convert ? column.convert(f) : get(f, column.key);
    // value = value === '' ? DISPLAYNULL : value;
    flight[column.key] = value;
    if (column.referenceTo) {
      if (isArray(column.referenceTo)) {
        map(column.referenceTo, (key) => {
          flight[key] = get(f, key);
        });
      } else {
        flight[column.referenceTo] = get(f, column.referenceTo);
      }
    }
  });
  return flight;
};

const combineFlightField = (cacheFlights) => {
  return map(cacheFlights, (f, index) => {
    let flight = proFlightField(f);
    //保留排序用字段
    return flight;
  });
};

const groupByHours = (flights) => {
  flights = orderBy(flights, ['scheduleTime', 'flightNo']);
  let result = groupBy(flights, (f) => {
    return moment(f.scheduleTime).hours();
  });
  return result;
};

/**
 * 获得页面展示的航班列表数据
 * @returns {*}
 */
export const refreshFlights = () => {
  let result;
  let flights;

  flights = loadDefaultFlights();

  log.verbose(`run flight postback`);
  result = flow([filterRoleFlights, groupByHours])(flights);
  log.verbose(`run flight postback end`);
  return result;
  // } else {
  // 	log.verbose(`skip flight postback`);
  // }
};


export const flightAdjustmentStart = (posWorker) => {
  worker = posWorker;
  let flightStart = () => {
    let result = refreshFlights();
    result && posWorker.publish('Web', 'FlightByHours.Sync', result);
  };

  posWorker.subscribe(`FlightsByHours.Ws.Sync`, () => {
    let data = memoryStore.getItem('FlightByHours').adjustReduceFlights;
    worker.publish('Web', 'FlightByHours.AdjustReduceFlights.Sync', data);
  });
  posWorker.subscribe(`Flight.Connection.Sync`, flightStart);
  posWorker.subscribe(`Flight.Change.Sync`, flightStart);
  posWorker.subscribe(`flightsByHours.Filter`, (data) => {
    setFilterOption(data);
    flightStart();
  });

  posWorker.subscribe('FlightsByHours.GetOthers', (day) => {
    flightDay = parseInt(day);
    if (flightDay !== 0) {
      posWorker.publish( 'Flight.GetOthers', day);
    } else {
      // otherFlightsCatch = [];
      refreshFlights();
    }
  });

  posWorker.subscribe(`FlightsByHours.Decrease.SetReduce`, () => {
    checkWebsocketResponseDataFinish().then(() => {
      let data = memoryStore.getItem('AdverseCondition').reduceData;
      let current = orderBy(data, (item) => parseInt(item.reduceInfo.reduceplanNo), ['desc'])[0] || {};
      let adjustFlights = [];
      let reduceFlights = [];
      map(current.planDetail, (flights, airlineCode) => {
        map(flights, (item) => {
          let tempItem = { ...item };
          tempItem.sendType = current.plan[airlineCode].sendType;
          tempItem.status = current.reduceInfo.status;
          item.updateScheduleTime && (tempItem.updateScheduleTimeHour = moment(item.updateScheduleTime).format('H'));
          if (item.type === 'A') {
            let f = flightDB.by('flightId', item.flightId);
            let flightNo = f ? f.flightNo : '';
            adjustFlights.push({ ...tempItem, flightNo });
          } else if (item.type === 'R') {
            reduceFlights.push(tempItem);
          }
        });
      });
      let adjustFlightsByHour = groupBy(adjustFlights, (item) => item.updateScheduleTimeHour);
      posWorker.publish('Web', 'FlightsByHours.GetCurrentReduce.Response', { adjustFlightsByHour, currentReduce: current, adjustFlights, reduceFlights });
    });
  });

  flightStart()
}

export const flightAdjustmentStop = (posWorker) => {
  posWorker.unsubscribe('Flight.Change.Sync')
  posWorker.unsubscribe('Flight.Connection.Sync')
  posWorker.unsubscribe('flightsByHours.Filter')
  posWorker.unsubscribe('FlightsByHours.GetOthers')
  posWorker.unsubscribe('FlightsByHours.Decrease.SetReduce')
  posWorker.unsubscribe('FlightsByHours.Ws.Sync')

}
