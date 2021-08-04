import {memoryStore} from '../lib/memoryStore'
import {
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
import { forEach,map,extend} from 'lodash';
import SocketWrapper from "../lib/socketWrapper";


import { flightDB } from '../lib/storage';
import { checkWebsocketResponseDataFinish } from '@/lib/helper/flight';

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
    flight_runwayModels(worker,data)
	});
  //运行
  homeClient.sub('/Flight/Flight/FlightStatistic', (data) => {
    flight_FlightStatistic(worker,data)
  });
  //积压
  homeClient.sub('/Flight/delay/backStatus', (data) => {
		console.log('积压',data)
	});
};

let getFlightsByIds = ({ids,webSubName,getTitleSpan}) => {
	checkWebsocketResponseDataFinish().then(() => {
			let flights = map(ids, (flightId, index) => {
				let f = flightDB.by('flightId', flightId + '');
				f = extend({}, f, { index001: index + 1 });
				return f;
      });
			worker.publish('Web', webSubName, {data:flights,getTitleSpan});
		});
};


const delays_subWSEvent = () => {
  let delaysClient = clientObj.delaysClient
  //积压
  delaysClient.sub('/Flight/delay/backStatus', (data) => {
    flight_delay_backStatus(worker, data)
  });
};

export const init = (worker_) => {
  worker = worker_;
  worker.subscribe('Situation.Network.Connected', (c) => {
    clientObj.homeClient = new SocketWrapper(c);
  });
  worker.subscribe('Page.Home.Start', () => {
    checkClient('homeClient').then(() => {
      console.log('home连接成功')
      subWSEvent();
    });
  });
  
  


  worker.subscribe('Delays.Network.Connected', (c) => {
    clientObj.delaysClient = new SocketWrapper(c);
  });
  worker.subscribe('Page.Delays.Start', () => {
    checkClient('delaysClient').then(() => {
      console.log('delays连接成功')
      delays_subWSEvent();
    });
  });


  worker.subscribe(`Home.GetFlightsByIds`, getFlightsByIds);

  worker.subscribe('Page.Home.Stop',()=>{
    forEach(clientObj, item => {
      item.unSubAll()
    })
  })





};













