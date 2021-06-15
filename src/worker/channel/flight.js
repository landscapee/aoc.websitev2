import {memoryStore} from '../lib/memoryStore'
import {flightStart, flightStop} from "../manage/flight";
import {saveToFlightDB} from "../lib/storage";
import Logger from "../../lib/logger";
import {values, extend, forEach} from 'lodash';
import SocketWrapper from "../lib/socketWrapper";

let worker;
let clientObj = {};
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
  let client = clientObj.flightClient;

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
export const init = (worker_) => {
  worker = worker_;
  worker.subscribe('Flight.Network.Connected', (c) => {
    clientObj.flightClient = new SocketWrapper(c);
    subRetainWs()
  });
  worker.subscribe('Delays.Network.Connected', (c) => {
    clientObj.delaysClient = new SocketWrapper(c);
    // subWidespreadWSEvent();
  });




  worker.subscribe('Page.Flight.Start',(myHeader)=>{
    flightStart(worker, myHeader);
    checkClient('flightClient').then(()=>{
      subWSEvent();
      console.log('flight连接成功')
    });

    checkClient('delaysClient').then(()=>{
      subDelayWSEvent();
      console.log('Widespread连接成功')
    })
  });

  worker.subscribe('Page.Flight.Stop',()=>{
    flightStop(worker);
    forEach(clientObj,item=>{
      console.log(item)
      item.unSubAll()
    })
  })
};
