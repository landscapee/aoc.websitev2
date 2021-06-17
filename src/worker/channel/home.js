import {memoryStore} from '../lib/memoryStore'
import {
  start,
  stop,
  flight_home,
  flight_monthClearance,
  flight_lastestAta,
  flight_lastestAtd,
  flight_FlightStatistic,
  flight_delay_backStatus,
  flight_direction,
  flight_traffic,
  flight_estimateCtotRelease,
  flight_runwayTraffic,
  flight_runwayModels
} from "../manage/home";
import Logger from "../../lib/logger";
import { forEach} from 'lodash';
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



const subWSEvent = () => {
  let homeClient = clientObj.homeClient
  //总数据
  homeClient.sub('/Flight/Home/Operation', (data) => {
    flight_home(worker,data)
  })
  // 月度放行正常率目标
  homeClient.sub('/Flight/monthClearance/stat', (data) => {
    flight_monthClearance(worker,data)
  });
  // 最近实际落地航班
  homeClient.sub('/Flight/lastestAta', (data) => {
    flight_lastestAta(worker,data)
  });
  // 最近实际起飞航班
  homeClient.sub('/Flight/lastestAtd', (data) => {
    flight_lastestAtd(worker,data)
  });
  //走廊口方向放行率
	homeClient.sub('/Flight/direction', (data) => {
		flight_direction(worker,data)
  });
  //流量信息
  homeClient.sub('/Flight/traffic', (data) => {
    flight_traffic(worker,data)
  });
  //下小时预计放行
  homeClient.sub('/Flight/estimateCtotRelease', (data) => {
    flight_estimateCtotRelease(worker,data)
  });
  //综合速率
  homeClient.sub('/Flight/runwayTraffic', (data) => {
    flight_runwayTraffic(worker,data)
	});
  //跑道
  homeClient.sub('/Flight/runwayModels', (data) => {
    console.log(data)
    flight_runwayModels(worker,data)
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





let delays_clientObj = {}
let delays_worker = {}

/*
* 检查服务是否在线
* */
export const delays_checkClient = (clientField,) => {
  return new Promise((resolve) => {
    setInterval(() => {
      if (delays_clientObj[clientField]) {
        resolve();
      }
    }, 50);
  });
};


const delays_subWSEvent = () => {
  //积压
  delays_clientObj.delaysClient.sub('/Flight/delay/backStatus', (data) => {
    flight_delay_backStatus(worker, data)
  });

};

export const delaysInit = (worker_) => {
  delays_worker = worker_;
  delays_worker.subscribe('Delays.Network.Connected', (c) => {
    delays_clientObj.delaysClient = new SocketWrapper(c);
  });
  delays_worker.subscribe('Page.Delays.Start', () => {
    // start(worker);
    delays_checkClient('delaysClient').then(() => {
      console.log('delays连接成功')
      delays_subWSEvent();
    });
  });
  delays_worker.subscribe('Page.Delays.Stop',()=>{
    // stop(worker);
    forEach(delays_clientObj,item=>{
      item.unSubAll()
    })
  })
};






