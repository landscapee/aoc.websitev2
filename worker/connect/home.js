import {memoryStore} from '../lib/memoryStore'
import {start, stop,flight_home,flight_monthClearance,flight_lastestAta,flight_lastestAtd,flight_FlightStatistic} from "../model/home";
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


const subWSEvent = () => {
  //总数据
  clientObj.homeClient.sub('/Flight/Home/Operation', (data) => {
    flight_home(worker,data)
  })
  // 月度放行正常率目标
  clientObj.homeClient.sub('/Flight/monthClearance/stat', (data) => {
    flight_monthClearance(worker,data)
  });
  // 最近实际落地航班
  clientObj.homeClient.sub('/Flight/lastestAta', (data) => {
    flight_lastestAta(worker,data)
  });
  // 最近实际起飞航班
  clientObj.homeClient.sub('/Flight/lastestAtd', (data) => {
    flight_lastestAtd(worker,data)
  });
  //积压
  clientObj.homeClient.sub('/Flight/delay/backPool', (data) => {
    // flight_delay_backStatus(worker, data)
    console.log(data)
  });
  
  //运行
  clientObj.homeClient.sub('/Flight/Flight/FlightStatistic', (data) => {
    flight_FlightStatistic(worker,data)
  });


};

export const init = (worker_) => {
  worker = worker_;
  worker.subscribe('Situation.Network.Connected', (c) => {
    clientObj.homeClient = new SocketWrapper(c);
    subRetainWs()
  });
  worker.subscribe('Page.Home.Start', () => {
    start(worker);
    checkClient('homeClient').then(() => {
      console.log('home连接成功')
      subWSEvent();
    });
  });
  worker.subscribe('Page.Home.Stop',()=>{
    stop(worker);
    forEach(clientObj,item=>{
      item.unSubAll()
    })
  })
};
