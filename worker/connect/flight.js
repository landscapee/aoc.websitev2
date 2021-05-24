import {memoryStore} from '../lib/memoryStore'
import {flightStart, flightStop} from "../model/flight";
import {saveToFlightDB} from "../lib/storage";
import {socketWrapprer} from "../lib/utils";
import Logger from "../../common/logger";
import {values, extend} from 'lodash';
import axios from 'lib/axios';

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
const subLongWs = () => {

  let changes = {};
  clientObj.flightClient.sub('/Flight/Change', (data) => {
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
let flightClientList = new Set();
const subWSEvent = () => {
  // flightClientList.add('/Flight/Change');
  // clientObj.flightClient.sub('/Flight/Change',(data)=>{
  //   console.log(data)
  // })
};

// delay服务的连接
let delayClientList = new Set();
const subDelayWSEvent = () => {
  //可执行积压
  // delayClientList.add('/Flight/delay/executableFlight');
  // clientObj.delaysClient.sub('/Flight/delay/executableFlight', (data) => {
  //
  // });
  socketWrapprer(delayClientList, clientObj.delaysClient,'/Flight/delay/executableFlight',(data)=>{
    // let flights = {};
    // map(data, (flightId) => {
    //   flights[flightId] = true;
    // });
    // memoryStore.setItem('ExecutableFlights', flights, true);
  })
};
export const init = (worker_, httpConfig) => {
  worker = worker_;
  worker.subscribe('Flight.Network.Connected', (c) => {
    clientObj.flightClient = c;
    subLongWs()
  });
  worker.subscribe('Delays.Network.Connected', (c) => {
    clientObj.delaysClient = c;
    // subWidespreadWSEvent();
  });


  worker.subscribe('Page.Flight.Start',()=>{
    axios.get(`${httpConfig['situation']}runningState/delayCode`).then(res=>{
      console.log(res)
    })
    flightStart(worker);
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
    // 航班动态的sock服务取消订阅
    flightClientList.forEach((item)=>{
      clientObj.flightClient && clientObj.flightClient.unSub(item)
    });

    // 大面积延误的sock服务取消订阅
    delayClientList.forEach((item)=>{
      clientObj.delaysClient && clientObj.delaysClient.unSub(item)
    })

  })
};
