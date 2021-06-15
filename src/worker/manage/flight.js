import {memoryStore} from '../lib/memoryStore';
import {every, extend, filter, flow, get, head, isArray, last, map, merge, orderBy, toUpper} from "lodash";
import moment from "moment";
import {flightDB} from "@/worker/lib/storage";
import {addSerialNumber, calcDelayTime, filterRoleFlights} from "@/lib/helper/flight";
import {getOperationDate} from '@/lib/helper/date'
import Logger from "@/lib/logger";
import {getListHeader} from "@/worker/lib/columns";
let Options = { day: 'Today', all: true };
const log = new Logger('worker:flight');
let DISPLAYNULL = '--'
let columns = [];
let todayTopFlights;
/**
 * 通过 begin ,end 日期 和 searchKey导入航班
 * @returns {*}
 */
const loadDefaultFlights = () => {
  // let now = 1622800842466;
  let now = moment().valueOf();
  //now = now - 3 * 24 * 60 * 60 * 1000;
  let day = get(Options, 'day') || 'Today';
  let dayProperty = get(Options, 'dayProperty') || 'naturalDay';
  let diffHours = dayProperty === 'naturalDay' ? '00' : '04';
  let begin, end;
  let searchKey = get(Options, 'searchKey');
  let searchType = get(Options, 'searchType');
  let searchQueries = get(Options, 'searchQueries');
  searchType = searchType == 'all' || !searchType ? 'search' : searchType;
  let findQuery = [];

  if (day) {
    switch (day) {
      case 'Yesterday':
        begin = moment(getOperationDate(moment(now).add(-1, 'days')) + diffHours, 'YYYYMMDDHH').valueOf();
        end = moment(getOperationDate(now) + diffHours, 'YYYYMMDDHH').valueOf();
        // begin = moment(getLastOperationDate(now), 'YYYYMMDDHH').valueOf();
        // end = moment(getOperationDate(now), 'YYYYMMDDHH').valueOf();
        break;
      case 'Today':
        let a = moment(now).add(1, 'd');
        begin = moment(getOperationDate(now) + diffHours, 'YYYYMMDDHH').valueOf();
        end = moment(getOperationDate(a) + diffHours, 'YYYYMMDDHH').valueOf();
        // begin = moment(getOperationDate(now), 'YYYYMMDDHH').valueOf();
        // end = moment(getNextOperationDate(now), 'YYYYMMDDHH').valueOf();
        break;
      case 'Tomorrow':
        begin = moment(getOperationDate(moment(now).add(1, 'days')) + diffHours, 'YYYYMMDDHH').valueOf();
        end = moment(getOperationDate(moment(now).add(2, 'days')) + diffHours, 'YYYYMMDDHH').valueOf();
        // begin = moment(getNextOperationDate(now), 'YYYYMMDDHH').valueOf();
        // end = moment(getOperationDate(moment(now).add(2, 'days')), 'YYYYMMDDHH').valueOf();
        break;
      case 'All':
        begin = moment(getOperationDate(moment(now).add(-1, 'days')) + diffHours, 'YYYYMMDDHH').valueOf();
        end = moment(getOperationDate(moment(now).add(2, 'days')) + diffHours, 'YYYYMMDDHH').valueOf();
      // begin = moment(getLastOperationDate(now), 'YYYYMMDDHH').valueOf();
      // end = moment(getOperationDate(moment(now).add(2, 'days')), 'YYYYMMDDHH').valueOf();
    }
    findQuery = [{ scheduleTime: { $gte: begin } }, { scheduleTime: { $lt: end } }];
  }

  searchKey && findQuery.push({ [searchType]: { $regex: new RegExp(toUpper(searchKey)) } });
  if (searchQueries) {
    findQuery = findQuery.concat(searchQueries);
  }

  let flights = flightDB.find({ $and: findQuery });
  // map(flights, (item) => {
  // 	if (item.delayTime) {
  // 		console.log('========', item);
  // 	}
  // });
  log.verbose(`${day} begin: ${moment(begin).format('YYYY-MM-DD HH:mm:ss')}`);
  log.verbose(`${day} end: ${moment(end).format('YYYY-MM-DD HH:mm:ss')}`);
  //quick and dutty fix. 反正后序修改污染数据库, 这里克隆一下
  let executableFlights = memoryStore.getItem('ExecutableFlights');
  return map(flights, (f) => {
    if (executableFlights[f.flightId]) {
      return extend({}, f, { isExecutableFlight: true });
    } else {
      return extend({}, f, { isExecutableFlight: false });
    }
  });
};
/**
 * 通过web的过滤项, 过滤航班
 * @param cacheFlights
 * @returns {*}
 */
const filterFlight = (cacheFlights) => {
  let opt = merge({}, Options);
  let result = filter(cacheFlights, (i) => {
    let filterResult = every(['All', 'movement', 'return', 'cancel', 'alternate', 'concern', 'isAlternateLandingFlight', 'isPassagerFlight', 'originated', 'isExecutableFlight'], (key) => {
      return get(opt, key, null) !== null ? get(opt, key) === get(i, key) : true;
    });
    return filterResult;
  });
  log.verbose(`send flights changes ${result.length}`);
  return result;
};

/**
 * 把字段根据列定义转换为界面需要的数据
 * @param f
 * @returns {{flightId: *}}
 */
const proFlightField = (f) => {
  let flight = { flightId: f.flightId };
  map(columns, (column) => {
    let value = column.convert ? column.convert(f) : get(f, column.key, DISPLAYNULL);
    value = value === '' ? DISPLAYNULL : value;
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

/**
 * 添加AOC的排序字段
 * @param f
 * @returns {*}
 */
const getPosition = (f) => {
  let now = memoryStore.getItem('global').now;
  let defaultDiff = '000000000';
  //优先级 分组 重点航班A或者Z  延误航班A/Z VIP航班A/Z
  let position = '',
    diffTime,
    executeTime;
  // if (!todayTopFlights) {
  //   todayTopFlights = remote.getGlobal('flightSetTop')[moment(now).format('YYYYMMDD')] || {};
  // }
  //手动置顶放最上面
  // position += todayTopFlights[f.flightId] ? 'A' : 'Z';
  //取消的航班放最后
  position += f.cancel ? 'Z' : 'A';
  //完成的放后面
  position += f.movement === 'D' ? (f.atd ? 'Z' : 'A') : f.ata ? 'Z' : 'A';
  //延误 加上了 A1 Z0
  // position += (f.delayed ? 'A' : 'Z') + (9 - f.delayed);
  // position += (f.markD ? 'A' : 'Z') + (9 - f.markD);
  position += f.markD === '1' ? 'A' : 'Z';
  //VIP 加上了 A1 Z0
  position += f.markV === '1' && !f.atd ? 'A' : 'Z';
  let delayTime = 1440 - calcDelayTime(f) || 0;
  // if (delayTime) {
  // 	delayTime = defaultDiff + delayTime;
  // 	delayTime = delayTime.substring(delayTime.length - 9, delayTime.length);
  // }
  position += delayTime;
  //重点保障航班
  // let keyMaintaince = parseInt(f.keyMaintaince || '0');
  // position += (keyMaintaince ? 'A' : 'Z') + (9 - keyMaintaince);

  //与当前时间差
  executeTime = f.movement === 'D' ? f.atd || f.etd || f.std : f.ata || f.eta || f.sta;
  if (executeTime) {
    diffTime = Math.abs((executeTime.valueOf() || executeTime) - now);
    diffTime = defaultDiff + diffTime;
    diffTime = diffTime.substring(diffTime.length - 9, diffTime.length);
  }
  position += diffTime;

  //最近更新时间
  // position += f.updateTime;
  return position;
};

export const combineFlightField = (cacheFlights) => {
  return map(cacheFlights, (f, index) => {
    let flight = flow([proFlightField])(f);
    //保留排序用字段
    flight.position = getPosition(f);
    // flight.setTop = todayTopFlights[f.flightId] ? 1 : 0;
    flight.isSeatConflict = f.isSeatConflict;
    flight.milestoneStatusType = f.milestoneStatusType;
    flight.flightLabel = f.flightLabel;
    flight.markLate = f.markLate;
    flight.movement = f.movement;
    return flight;
  });
};
/**
 * 去重然后排序
 * @param cacheFlights
 * @returns {*}
 */
const sortFlights = (cacheFlights) => {
  let isDisplayTodayFlights = (get(Options, 'day') || 'Today') == 'Today';
  let sortKey = get(Options, 'sort.key') || (isDisplayTodayFlights ? 'position' : 'scheduleTime');
  let sortOrder = get(Options, 'sort.order') || 'asc';
  let flights = orderBy(cacheFlights, [sortKey], [sortOrder]);
  flights = orderBy(flights, 'setTop', 'desc');
  return flights;
};
/**
 * 获得页面展示的航班列表数据
 * @returns {*}
 */
export const refreshFlights = (arg) => {
  let result={};
  let flights;

  if (typeof arg === 'object') {
    result = extend({}, arg);
    flights = result.flights;
  } else {
    flights = loadDefaultFlights();
    // result = getStatistics(flights);
  }
  // if (now !== lastRunTime || immediately) {
  // lastRunTime = parseInt(new Date().getTime() / 1000 / refreshRate);
  log.verbose(`run flight postback`);
  result.flights = flow([filterRoleFlights, filterFlight, combineFlightField, sortFlights, addSerialNumber])(flights);
  log.verbose(`run flight postback end`);
  return result;
  // } else {
  // 	log.verbose(`skip flight postback`);
  // }
};

export const flightStart = (posWorker, myHeader) => {
  columns = myHeader;
  memoryStore.setItem('global',{now: moment().valueOf()})
  let flightStart = (data) => {
    let result = refreshFlights(data);
    result.flights && posWorker.publish('Web', 'Flight.Sync', result);
  };
  posWorker.subscribe('Flight.Change.Sync',(data)=>{
    flightStart()
  })

  //修改表头
  posWorker.subscribe('Flight.UpdateHeader', (newColumns) => {
    memoryStore.setItem('global', {flightHeader: newColumns});
    columns = getListHeader();
  });
}

export const flightStop = (posWorker) => {
  posWorker.unsubscribe('Flight.Change.Sync')
  // const data = memoryStore.getItem('ExecutableFlights')
}
