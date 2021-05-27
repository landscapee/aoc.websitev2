import {memoryStore} from '../lib/memoryStore'
import {start, stop,initData} from "../model/home";
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
  let client = clientObj.homeClient;

  let changes = {};
  // client.sub('Flight/Home/Operation', (data) => {
  //   console.log(data)
    
  // }, true);

};


const subWSEvent = (worker) => {
  clientObj.homeClient.sub('/Flight/Home/Operation', (data) => {
    initData(worker,data)
  })
};

export const init = (worker_) => {
  worker = worker_;
  worker.subscribe('Situation.Network.Connected', (c) => {
    clientObj.homeClient = new SocketWrapper(c);
    subRetainWs()
  });
  worker.subscribe('Page.Home.Start', () => {
    // start(worker);
    checkClient('homeClient').then(() => {
      console.log('home连接成功')
      subWSEvent(worker);
    });
  });
  worker.subscribe('Page.Home.Stop',()=>{
    stop(worker);
    forEach(clientObj,item=>{
      item.unSubAll()
    })
  })
};
