import loki from 'lokijs';
import Promise from 'bluebird';
import { has, extend, get, groupBy, each, omit, flatMap, map, flow, orderBy, remove, concat, compact, isArray, toUpper, keyBy, includes } from 'lodash';
import { calcCancel, calcReturn, calcAlternate, calcCompleted, calcOriginated, addDisplayField, buildSearchField, fixTakeOffNormalStatus } from 'lib/helper/flight';

import Logger from '@/lib/logger';
// import { remote } from 'electron';
import { formatDate } from 'lib/helper/date';
import { fiterStr } from 'lib/helper/utility';
import { memoryStore } from './memoryStore';
import { fixDelayReasonMerge, mergeRunway } from 'lib/helper/flight';

const log = new Logger('worker:lib:storage');
const flightSegment = '1';
var DB = new loki('ctu.db', { adapter: 'memory' });
// var RadarDB = new loki('ctu.db', { adapter: 'memory' });

export var flightDB = DB.addCollection('flights', {
  unique: ['flightId'],
  // indices: ['scheduleTime', 'seat', 'movement', 'markD', 'markV'],
  indices: ['scheduleTime'],
});

export var seatFlightsDB = DB.addCollection('seatFlights', {
  unique: ['seatId'],
  indices: ['flightNo', 'seatNo'],
});
export var intelligenceDB = DB.addCollection('intelligence', {
  unique: ['id'],
  indices: ['createTime'],
});
flightDB.ensureUniqueIndex('flightId');
seatFlightsDB.ensureUniqueIndex('seatId');

export var personalDB = DB.addCollection('personal', {
  indices: ['type', 'pageKey'],
});
//flightStatusText flightTypeName
export const processFlight = (flights) => {
  let processer = flow([
    // normalize,
    // addAirlineIATA,
    // fixAirlineCNName,
    // fixGates,
    // // fixDateType,
    // fixFlightStatus,
    // fixFlightExtStatus,
    // fixRoutes,
    // fixCounters,
    // fixCarousels,
    // fixPreETDOrATD,
    // calcCancel,
    // calcReturn,
    // calcAlternate,
    calcCompleted,
    fixTakeOffNormalStatus,
    fixDelayReasonMerge,
    // fixMovement,
    // calcOperationDate,
    // calcArrivalFromCity,
    // calcDepartureToCity,
    // calcIncludeInPercentReport,
    // calcOriginated,
    // calcMaintainTime,
    // calcMorningBusyHourFlight,
    // calcOriginatedMorningBusyHourFlight,
    mergeRunway,
    addDisplayField,
    buildSearchField,
  ]);
  return map(flights, (f) => {
    f.flightTypeName = f.flightStatusText;
    f.aircraftNo = f.tailNo;
    f.return = f.homewardVoyage;
    f.milestoneStatusCn = get(f, 'milestoneStatus.statusCn', '--');
    f.milestoneStatusType = get(f, 'milestoneStatus.type', '--');
    f.startCatering = f.startCatering ? formatDate(parseInt(f.startCatering), 'HHmm') : '';
    f.endCatering = f.endCatering ? formatDate(parseInt(f.endCatering), 'HHmm') : '';
    f.startDeicing = f.startDeicing ? formatDate(parseInt(f.startDeicing), 'HHmm') : '';
    f.endDeicing = f.endDeicing ? formatDate(parseInt(f.endDeicing), 'HHmm') : '';
    f.startRefueling = f.startRefueling ? formatDate(parseInt(f.startRefueling), 'HHmm') : '';
    f.endRefueling = f.endRefueling ? formatDate(parseInt(f.endRefueling), 'HHmm') : '';
    return processer(f);
  });
};
const saveToDB = (dataList, IDName, DB) => {
  return Promise.map(dataList, (item) => {
    let fixedItem = omit(item, ['$loki', 'meta']);

    let itemId = get(fixedItem, IDName);
    if (itemId === 'null') {
      log.error(IDName, 'itemId is string null');
      return Promise.resolve();
    }
    if (itemId === 'undefined') {
      log.error(IDName, 'itemId is string undefined');
      return Promise.resolve();
    }
    if (!has(fixedItem, IDName)) {
      // log.error('missed key seatId for', fixedItem);
      return Promise.resolve();
    }
    //尝试Insert, 如果失败就Update
    try {
      let existItem = DB.by('seatId', itemId);
      if (!existItem) {
        DB.insert(fixedItem);
      } else {
        DB.update(extend(existItem, fixedItem));
      }
    } catch (ex) {
      log.error(fixedItem, ex);
    }
    return Promise.resolve();
  });
};
export const saveToFlightDBOriginal = (flights) => {
  return Promise.map(flights, (item) => {
    //忽略内存数据库的特有属性
    // let fixedItem = omit(item, ['$loki', 'meta']);
    let fixedItem = item;

    if (has(fixedItem, 'deleted') && get(fixedItem, 'deleted')) {
      let flightId = get(fixedItem, 'flightId');
      let removeFlight = flightDB.by('flightId', flightId);
      if (removeFlight) {
        flightDB.remove(removeFlight);
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
      let existFlight = flightDB.by('flightId', flightId);
      if (!existFlight) {
        flightDB.insert(fixedItem);
      } else {
        flightDB.update(extend(existFlight, fixedItem));
      }
    } catch (ex) {
      log.error(fixedItem, ex);
    }
    return Promise.resolve();
  });
};

export const saveToFlightDB = (flights) => {
  let newFlights = [];
  map(flights, (f) => {
    let flightId = f.flightId + '';
    let preFlight = flightDB.by('flightId', flightId);
    if (preFlight) {
      newFlights.push(extend(omit(preFlight, ['$loki', 'meta']), { ...f, flightId: flightId }));
    } else {
      newFlights.push({ ...f, flightId: flightId });
    }
  });
  return saveToFlightDBOriginal(processFlight(newFlights));
};

export const upDateFlightDetail = (flights) => {
  let newFlights = map(flights, (f) => {
    let preFlight = flightDB.by('flightId', f.flightId);
    return preFlight && preFlight.detail ? extend(preFlight, { detail: extend(preFlight.detail, f.detail) }) : f;
  });
  return saveToFlightDBOriginal(newFlights);
};

const buildSeatSearchField = (flight) => {
  let searchField = map(['flightNo', 'seat', 'arrive.flightNo', 'arrive.flightId', 'arrive.VIP', 'depart.flightNo', 'depart.flightId', 'depart.VIP'], (key) => {
    let field = get(flight, key, '');
    return isArray(field) ? field : [field];
  });
  searchField = concat.apply(null, searchField);
  searchField = compact(searchField);
  return extend({}, flight, { search: toUpper(searchField.join('|')) });
};
const convertSeatFlightFiled = (f, seat) => {
  // seat_publish_state说明
  // 人工对尚未发布的机位进行调整后，不立即发布
  // 0    未预分
  // 1	智能预分
  // 2	智能预分+发布
  // 3	人工预分+自动发布
  // 4	人工预分+人工提前发布
  // 5	人工预分+未发布
  //
  // 8	挂起+人工分配
  // 9	挂起+智能分配

  let flightNo;
  if (f.arriveFlightNo && f.departFlightNo) {
    let fiter = fiterStr(f.arriveFlightNo, f.departFlightNo);
    flightNo = fiter.diffStr2.length > 1 ? `${f.arriveFlightNo}/${fiter.diffStr2}` : `${f.arriveFlightNo}/${f.departFlightNo.substr(f.departFlightNo.length - 1, 1)}`;
  } else if (f.arriveFlightNo) {
    flightNo = `${f.arriveFlightNo}/-`;
  } else {
    flightNo = `-/${f.departFlightNo}`;
  }
  // let startTime = f.beginTime;
  // let endTime = f.endTime;
  let publish = [2, 3, 4, 8, 9].includes(f.arriveSeatPublishState) || [2, 3, 4, 8, 9].includes(f.departSeatPublishState);
  // log.verbose('f.endTime', flightNo, endTime, moment(endTime).format('hh:mm(DD)'));
  //aircraftOut":1547178791000,"arriveAircraftNo":"B6226","arriveAircraftType":"C","arriveDeice":0,"arriveDelay":0,"arriveFlightDeleted":1,"arriveFlightId":"11696889","arriveFlightIndicator":"I","arriveFlightNo":"CA438","arriveFlightType":"319","arriveScheduleTime":1547035800000,"arriveSeatPublishState":0,

  let { beginTime: startTime, endTime, rstd, rconfirm, lockFlag: lock, actionUser: lockUser, lockReason, arriveDeice: deice, rqBridge, rqDraft, apron, previousSplit, nextSplit, previousLocation, nextLocation } = f;
  let flight = {
    flightNo,
    rstd,
    rconfirm,
    publish,
    lock,
    lockUser,
    lockReason,
    deice,
    rqBridge,
    rqDraft,
    apron,
    previousSplit,
    nextSplit,
    previousLocation,
    nextLocation,
    aircraftType: f.arriveFlightType || f.departFlightType,
    craftSizeType: f.arriveAircraftType || f.departAircraftType,
    seat: seat || 'undefined',
    startTime: startTime || endTime - 60 * 60 * 1000,
    endTime: f.rstd || endTime || startTime + 48 * 60 * 60 * 1000,
    type: f.flightStatus || 1,
    manualSeat: [3, 4, 5].includes(f.arriveSeatPublishState) || [3, 4, 5].includes(f.departSeatPublishState),
    pending: ([8, 9].includes(f.arriveSeatPublishState) || [8, 9].includes(f.departSeatPublishState)) && f.flightStatus == 4,
    aircraftNo: get(f, 'arriveAircraftNo') || get(f, 'departAircraftNo'),
    manualOperation: false, //前台手动分配暂用字段
    preSeat: null, //前台手动分配暂用字段
    arrive: {
      VIP: f.arriveFlightVipMark ? true : false,
      indicator: f.arriveFlightIndicator,
      flightNo: get(f, 'arriveFlightNo', '-'),
      flightId: get(f, 'arriveFlightId', '-'),
      cancel: get(f, 'arriveCancel'),
      aircraftNo: get(f, 'arriveAircraftNo'),
    },
    depart: {
      VIP: f.departFlightVipMark ? true : false,
      indicator: f.departFlightIndicator,
      flightNo: get(f, 'departFlightNo', '-'),
      flightId: get(f, 'departFlightId', '-'),
      cancel: get(f, 'departCancel'),
      aircraftNo: get(f, 'departAircraftNo'),
    },
  };
  return buildSeatSearchField(flight);
};

//全部存离散的航班，有关联航班单独存 ，通过relatedFlightId 找到主数据
//1.如果之前只有arrive，更新有进港和离港，需要先删除进港
//2.如果之前有进港和离港，更新只有进港，需要删除离港
export const saveToSeatFlights = (items) => {
  let flights = [];
  map(items, (item) => {
    let oldD;
    let oldA;
    let oldA1;
    if (item) {
      let f = item.flightDomain;
      let cFlight = convertSeatFlightFiled(f, item.seatDomain.reservationCode);
      let relatedFlight;
      f.segment = f.segment || flightSegment;
      if (f.departFlightId && f.arriveFlightId) {
        cFlight.flightId = f.departFlightId + f.segment;
        cFlight.OFlightId = f.departFlightId;
        cFlight.deleted = f.departFlightDeleted;
        relatedFlight = {
          flightId: f.arriveFlightId + f.segment,
          OFlightId: f.arriveFlightId,
          relatedFlightId: f.departFlightId + f.segment,
          ORelatedFlightId: f.departFlightId,
          deleted: f.arriveFlightDeleted,
        };
        //1.更新有进港和离港,如果之前只有arrive,需要先删除进港
        oldD = flightDB.by('flightId', cFlight.flightId);
        oldA = flightDB.by('flightId', relatedFlight.flightId);
        //这个oldD 可能已经和别的关联上了？？？还存在，但是需要删除oldA
        if (oldA && (!oldD || get(oldD, 'arrive.flightId') !== f.arriveFlightId)) {
          flightDB.remove(oldA);
        }
        //1.更新有进港A和离港D,之前是A和D1, 没有影响

        //1.更新有进港A和离港D,之前是A1和D,需要删除A1
        let AflightId = get(oldD, 'arrive.flightId');
        if (AflightId && cFlight.arrive.flightId !== AflightId) {
          oldA1 = flightDB.by('flightId', oldD.arrive.flightId + f.segment);
          if (oldA1) flightDB.remove(oldA1);
        }
        flights.push(relatedFlight);
        flights.push(cFlight);
        return cFlight.flightId;
        //2.更新有进港和离港,如果之前只有离港没有进港,不需要处理
      } else if (f.arriveFlightId && !f.departFlightId) {
        cFlight.OFlightId = f.arriveFlightId;
        cFlight.flightId = f.arriveFlightId + f.segment;
        cFlight.deleted = f.arriveFlightDeleted;
        // cFlight.relatedFlightId = false;
        // cFlight.ORelatedFlightId = false;

        //3.更新只有进港, 之前有进港和离港，需要删除离港，吧之前进港关联的数据删除
        oldA = flightDB.by('flightId', cFlight.flightId);
        if (oldA && oldA.relatedFlightId) {
          oldD = flightDB.by('flightId', oldA.relatedFlightId);
          if (oldD) flightDB.remove(oldD);
          flightDB.remove(oldA); //进港数据一并删除了
        }
        flights.push(cFlight);
        return cFlight.flightId;
      } else if (!f.arriveFlightId && f.departFlightId) {
        cFlight.flightId = f.departFlightId + f.segment;
        cFlight.OFlightId = f.departFlightId;
        //只有离港的航班直接删除？？？
        // cFlight.deleted = true;

        cFlight.deleted = f.departFlightDeleted;

        // cFlight.depart.cancel = true;
        //4.更新只有离港, 之前有进港和离港，需要删除进港数据
        oldD = flightDB.by('flightId', cFlight.flightId);
        if (oldD && get(oldD, 'arrive.flightId')) {
          oldA = flightDB.by('flightId', oldD.arrive.flightId + f.segment);
          if (oldA) flightDB.remove(oldA);
        }
        // oldA = flightDB.by('flightId', cFlight.flightId);
        // if (oldA && oldA.relatedFlightId) {
        //     oldD = flightDB.by('flightId', oldA.relatedFlightId);
        //     oldD && flightDB.remove(oldD);
        // }
        flights.push(cFlight);
        return cFlight.flightId;
      }
    }
  });
  //return promise.all([saveToDB(seats, 'seatId', seatFlightsDB), saveToFlightDBOriginal(flights)]);
  return saveToFlightDBOriginal(flights);
};

export const UpdateSeatFlightsInfo = (data) => {
  let items = data.data;
  let flights = map(items, (item) => {
    let f = item.flightDomain;
    let { seatDomain } = item;
    //机库的动态
    if (seatDomain.location === 1) {
      let hangerId = item.seatDomain.reservationCode;
      let seatsData = memoryStore.getItem('seats');
      let { planes } = seatsData;
      planes = planes || {};
      let { allHangars } = seatsData;
      let hangersById = keyBy(allHangars, 'id');
      let hangersBySeatNo = keyBy(allHangars, 'seatNo');
      let hanger = hangersById[hangerId] || hangersBySeatNo[hangerId];
      if (!hanger) return;
      //{"flightDomain":{"arriveAircraftNo":"B6822","arriveAircraftType":"C","arriveDeice":0,"arriveDelay":0,"arriveFlightDeleted":0,"arriveFlightId":"11867476","arriveFlightIndicator":"D","arriveFlightNo":"CA4226","arriveFlightType":"320","arriveScheduleTime":1550669700000,"arriveSeatPublishState":2,"beginTime":1550715454000,"departDeice":0,"departFlightDeleted":0,"departSeatPublishState":0,"flightStatus":2,"nextSplit":0,"previousSplit":1,"segment":1},"seatDomain":{"index":0,"location":1,"reservationCode":"14c26f93e7db49fd8cf732ffb57f0773"}}
      let plane = {
        flightId: f.arriveFlightId,
        aircraftNo: f.arriveAircraftNo,
        seat: hanger.name,
        hangerId: hangerId,
        flightNo: f.arriveFlightNo,
        operateTime: f.beginTime,
        startTime: f.beginTime,
        endTime: f.beginTime + 3 * 60 * 60 * 1000,
        type: 2,
        hangar: true,
        craftSizeType: f.arriveAircraftType,
        arrive: {
          flightNo: get(f, 'arriveFlightNo', '-'),
          flightId: get(f, 'arriveFlightId', '-'),
        },
        depart: {
          flightNo: get(f, 'departFlightNo', '-'),
          flightId: get(f, 'departFlightId', '-'),
        },
        // aircraftType:plane.model
      };
      //拖入机库以后，离港航班要暂时取消
      if (seatDomain.toHangar == 1) {
        if (!planes[hanger.name]) {
          planes[hanger.name] = [];
        }
        planes[hanger.name].push(plane);
        // f.departCancel = 1;
        // f.deleted = 1;
        return item;
      } else if (seatDomain.toHangar == 2) {
        remove(planes[hanger.name], (plane) => f.arriveAircraftNo == plane.aircraftNo);
      } else {
        return;
      }
      memoryStore.setItem('seats', { planes: planes });
    } else {
      return item;
    }
  });
  return saveToSeatFlights(flights);
};

export const UpdateSeatFlightsSeat = (data, callback) => {
  let sample = [{ status: 1, flightId: 11349982, seat: '614' }];
  let flights;
  let nullFlights = [];
  let now = remote.getGlobal('now');
  if (data.airportSeat) {
    flights = map(data.airportSeat, (item) => {
      let flight = flightDB.by('flightId', item.flightId + (item.segment || flightSegment));
      if (flight) {
        flight = flight.relatedFlightId ? flightDB.by('flightId', flight.relatedFlightId) : flight;
        let publish = [2, 3, 4, 8, 9].includes(item.status);
        return extend({}, flight, { seat: item.seat, oldSeat: flight.seat, newSeat: item.seat, updateSeatTime: now, publish });
      } else {
        nullFlights.push(item.flightId);
      }
    });
  }
  //conflictSeat: Array(1)
  // 0:
  // firFlt: 11235600
  // seat: "305"
  // secFlt: 11234023
  if (data.conflictSeat) {
    map(data.conflictSeat, (item) => {
      let flight = flightDB.by('flightId', item.flightId);
      if (flight) {
        flight = flight.relatedFlightId ? flightDB.by('flightId', flight.relatedFlightId) : flight;
        flights.push(extend({}, flight, { seatWarning: true }));
      } else {
        nullFlights.push(item.flightId);
      }
    });
  }
  callback && callback(nullFlights);
  return saveToFlightDBOriginal(flights);
};

//特情
const saveOneToIntelligenceDB = (data) => {
  try {
    let id = get(data, 'id');
    let exist = intelligenceDB.by('id', id);
    if (!exist) {
      intelligenceDB.insert(data);
    } else {
      intelligenceDB.update(extend(exist, data));
    }
  } catch (ex) {
    log.error(data, ex);
  }
};
export const saveToIntelligenceDB = (msg, convert) => {
  if (isArray(msg)) {
    map(msg, (item) => {
      saveOneToIntelligenceDB(convert(item));
    });
  } else {
    saveOneToIntelligenceDB(convert(msg));
  }
  return Promise.resolve(msg);
};
export const getFlightDetail = (flightId) => {
    let f = flightDB.by('flightId', flightId + '') || {flightId:flightId};
    if (f.relatedId) {
        let relatedF = flightDB.by('flightId', f.relatedId);
        if (f.movement == 'A') {
            f.departFlight = relatedF;
        } else {
            f.arriveFlight = relatedF;
        }
    }
    return f;
};
