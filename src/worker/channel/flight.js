import {memoryStore} from '../lib/memoryStore'
import {flightStart, flightStop} from "../manage/flight";
import {saveToFlightDB} from "../lib/storage";
import Logger from "../../lib/logger";
import {values, extend, forEach, map} from 'lodash';
import SocketWrapper from "../lib/socketWrapper";

let worker;
let clientObj = {};
let retainsFlightWs; // 页面销毁连接不断的client
let retainsSituationWs; // 页面销毁连接不断的client
const log = new Logger('connect.flight');

/*
* 检查服务是否在线
* */
export const checkClient = (clientField) => {
  return new Promise((resolve) => {
    setInterval(() => {
      if (clientObj[clientField]) {
        resolve();
      }
    }, 50);
  });
};

// 长时间连接的ws 不管页面是否存续
const subRetainWs = () => {
  let client = retainsFlightWs

  let changes = {};
  client.sub('/Flight/Change', (data) => {
    log.verbose(`received Flight/Change`);
    if (changes[data.flightId]) {
      extend(changes[data.flightId], data);
    } else {
      changes[data.flightId] = data;
    }
  });

  let lastUpdateFinish = true;
  setInterval(() => {
    if (lastUpdateFinish) {
      let _changes = values(changes);
      if (_changes.length > 0) {
        changes = {};
        lastUpdateFinish = false;
        saveToFlightDB(_changes).then(() => {
          lastUpdateFinish = true;
          worker.publish('Flight.Change.Sync');
        });
      }
    }
  }, 1000);

};

const subSituationRetainsWS = () => {
  retainsSituationWs.sub('/Flight/delayReason', (data) => {
    memoryStore.setItem('delayFlight', data);
    console.log(data)
    let datas = map(data, (item) => ({ ...item, isDelay: true }));
    saveToFlightDB(datas).then((res) => {
      worker.publish('Flight.Change.Sync');
    });
  });
}

// flight服务的连接
const subWSEvent = () => {

};

// delay服务的连接
const subDelayWSEvent = () => {
  let client = clientObj.delaysClient;
  client.sub('/Flight/delay/executableFlight',()=>{
    // let flights = {};
    // map(data, (flightId) => {
    //   flights[flightId] = true;
    // });
    // memoryStore.setItem('ExecutableFlights', flights, true);
  })
};

// adverse服务的连接
const subAdverseClient = () => {
  let client = clientObj.adverseClient;
  // 除冰的连接
  client.sub('/adverse-condition/deice/dynamic/flight',(data)=>{
    console.log(data);
    saveToFlightDB(data).then(() => {
      worker.publish('Flight.Change.Sync');
    });
  })
};
export const init = (worker_) => {
  worker = worker_;
  worker.subscribe('Flight.Network.Connected', (c) => {
    clientObj.flightClient = new SocketWrapper(c);
    retainsFlightWs = c
    subRetainWs()
  });
  worker.subscribe('Delays.Network.Connected', (c) => {
    clientObj.delaysClient = new SocketWrapper(c);
    // subWidespreadWSEvent();
  });

  worker.subscribe('Adverse.Network.Connected', (c) => {
    clientObj.adverseClient = new SocketWrapper(c);
    // subWidespreadWSEvent();
  });

  worker.subscribe('Situation.Network.Connected', (c) => {
    // clientObj.adverseClient = new SocketWrapper(c);
    retainsSituationWs = c;
    subSituationRetainsWS();
  });




  worker.subscribe('Page.Flight.Start',(header)=>{
    flightStart(worker, header);
    checkClient('flightClient').then(()=>{
      subWSEvent();
    });

    checkClient('delaysClient').then(()=>{
      subDelayWSEvent();
      console.log('Widespread连接成功')
    })

    checkClient('adverseClient').then(()=>{
      subAdverseClient();
      console.log('adverseClient')
    })
  });

  worker.subscribe('Page.Flight.Stop',()=>{
    flightStop(worker);
    forEach(clientObj,item=>{
      console.log('flight销毁',item)
      item.unSubAll()
    })
  })
};
