import { flow,mapValues,map,merge,forEach} from 'lodash';
import { flightDB } from '../../lib/storage';
import { proFlightFields } from '@/lib/helper/proFlightFields';
import { checkWebsocketResponseDataFinish, getFlightByIds, filterRoleFlights, addSerialNumber } from '@/lib/helper/flight';
import { decreaseHttp } from '../../http/decrease';
import SocketWrapper from "../../lib/socketWrapper";
import {memoryStore} from "../../lib/memoryStore";

let worker;
let clientObj = {}
let ajax;
let adverseClient;

/*
* 检查服务是否在线
* */
export const checkClient = (clientField) => {
    return new Promise((resolve) => {
       let timer= setInterval(() => {
            if (clientObj[clientField]) {
                clearInterval(timer)
                resolve();
            }
        }, 50);
    });
};

let getReduceFlights = (reduceFlight) => {
	checkWebsocketResponseDataFinish().then(() => {
		let flightsWithAirline = mapValues(reduceFlight, (item) => flow([addSerialNumber])(getFlightByIds(item)));
		_.map(flightsWithAirline, (item, key) => {
			let arrs = item.filter(flight => {
				return flight.flightNo
			})
			flightsWithAirline[key] =arrs
		})
		worker.publish('Web', 'Decrease.GetReduceFlights.Response', flightsWithAirline);
	});
};


let getFlight = (query) => {
    checkWebsocketResponseDataFinish().then(() => {
        let flights = flightDB.find({ $and: query });
        flights = flow([filterRoleFlights])(flights);
        worker.publish('Web','AdverseCondition.GetFlight.Response',flights)
	});
};

let subAdverseWSEvent = () => {
    let changeReduceData = (data) => {
		let oData = memoryStore.getItem('AdverseCondition').reduceData;
		let reduceId = data.reduceId;
		if (oData) {
			let hasSetData = map(oData, (item) => {
				if (item.reduceId === reduceId) {
					return merge(item, data);
				}
				return item;
			});
			memoryStore.setItem('AdverseCondition', { reduceData: hasSetData });
			worker.publish('Web', 'AdverseCondition.Decrease.SetReduce', hasSetData);
			worker.publish('Worker', 'FlightsByHours.Decrease.SetReduce', hasSetData);
		}
	};
    // 轮次信息ws链接
	adverseClient.sub('/adverse-condition/wd/data/plan', (data) => {
		changeReduceData(data);
	});
	// 轮次信息ws链接
	adverseClient.sub('/adverse-condition/wd/data/planAndPlanDetail', (data) => {
		changeReduceData(data);
	});
	// 轮次信息ws链接
	adverseClient.sub('/adverse-condition/wd/data/reduceInfo', (data) => {
		changeReduceData(data);
	});
	// 全部轮次信息ws链接
	adverseClient.sub('/adverse-condition/wd/data/all', (data) => {
		console.log(data)
		let currentDelayType = memoryStore.getItem('AdverseCondition').currentDelayType;
		if (data.type == currentDelayType) {
			if (data.reduceInfo.reduceplanNo == 1) {
				memoryStore.setItem('AdverseCondition', { reduceData: [data] });
				changeReduceData(data);
				return;
			}
			let oData = memoryStore.getItem('AdverseCondition').reduceData;
			oData.push(data);
			memoryStore.setItem(oData);
			changeReduceData(data);
		}
	});
};
export const init = (worker_,httpRequest) => {
    worker = worker_;
	ajax = httpRequest
    worker.subscribe(`AdverseCondition.GetFlight`, getFlight);
	worker.subscribe(`Decrease.GetReduceFlights`, getReduceFlights);
	

    //头部信息获取
    worker.subscribe('Adverse.Network.Connected', (c) => {
    	adverseClient = c
			clientObj.adverseClient = new SocketWrapper(c);
	});
    checkClient('adverseClient').then(() => {
        subAdverseWSEvent();
        console.log('adverseClient连接成功')
	});
	

	
    
	decreaseHttp(worker, httpRequest);
	
	worker.subscribe('Page.Decrease.Stop',()=>{
		forEach(clientObj, item => {
			item.unSubAll()
		})
	})
};