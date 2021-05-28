import {memoryStore} from '../lib/memoryStore'
import {start, stop,flight_delay_backStatus} from "../model/delays";
import {saveToFlightDB} from "../lib/storage";
import Logger from "../../common/logger";
import {values, extend, forEach} from 'lodash';
import SocketWrapper from "../lib/socketWrapper";

let worker;
let clientObj = {};
const log = new Logger('connect.home');

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
  let client = clientObj.delaysClient;

  let changes = {};
  // client.sub('Flight/Home/Operation', (data) => {
  //   console.log(data)
    
  // }, true);

};


const subWSEvent = () => {
  //积压
  clientObj.delaysClient.sub('/Flight/delay/backStatus', (data) => {
    flight_delay_backStatus(worker, data)
  });
  


};

export const init = (worker_) => {
  worker = worker_;
  worker.subscribe('Delays.Network.Connected', (c) => {
    clientObj.delaysClient = new SocketWrapper(c);
    subRetainWs()
  });
  worker.subscribe('Page.Delays.Start', () => {
    start(worker);
    checkClient('delaysClient').then(() => {
      console.log('delays连接成功')
      subWSEvent();
    });
  });
  worker.subscribe('Page.Delays.Stop',()=>{
    stop(worker);
    forEach(clientObj,item=>{
      item.unSubAll()
    })
  })
};
