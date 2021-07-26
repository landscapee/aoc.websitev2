import {trafficCapacity, getDelayBoard,getIndicator,getRunwayWeather} from "../../manage/conditionalOperation/common";
import {mapKeys, map, extend, forEach, keyBy, get} from 'lodash';
import SocketWrapper from "../../lib/socketWrapper";
import {memoryStore} from "../../lib/memoryStore";

let clientObj = {};
let worker, client, ajax;
import {flightDB} from '@/worker/lib/storage';

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

// situation 服务的连接

const subWSEvent = () => {
    let client = clientObj.AdverseClient;
    // 通行能力 trafficCapacity
    client.sub(`/adverse-condition/trafficCapacity/list`, (data) => {
        let mydata = data
        mydata = trafficCapacity(mydata)
        memoryStore.setItem('trafficCapacity', {txnl: mydata})
        worker.publish('Web', 'push.trafficCapacity.Data', {data: mydata, key: 'trafficCapacity'})
    });
    // 气象灾害-三大指标  实时延误航班 最近一次跑道使用间隔
    //   航班指标  - 预测  出港旅客数量指标  本场起降间隔指标
     client.sub(`/adverse-condition/meteorologyDisaster/indicator`, (data) => {
        let mydata = data
        mydata = getIndicator(mydata)
        memoryStore.setItem('indicator', {indicator: mydata})
        worker.publish('Web', 'push.trafficCapacity.Data', {data: mydata, key: 'indicator'})
    });

};

// 动态时段
const DelaysEvent = () => {
    let client = clientObj.DelaysClient;

    // delayBoard: `/Flight/delay/FlightDelayDetailBoard`,
    client.sub('/Flight/delay/FlightDelayDetailBoard', (data) => {
        let mydata = data
        mydata = getDelayBoard(mydata)
        memoryStore.setItem('trafficCapacity', {dtsd: mydata})
        worker.publish('Web', 'push.trafficCapacity.Data', {data: mydata, key: 'delayBoard'})
    })

};

export const init = (worker_, httpRequest_) => {
    worker = worker_;
    ajax = httpRequest_;
    worker.subscribe('Adverse.Network.Connected', (c) => {
        clientObj.AdverseClient = new SocketWrapper(c);
    });
    worker.subscribe('Delays.Network.Connected', (c) => {
        clientObj.DelaysClient = new SocketWrapper(c);
    });
    // // 获取通行能力  动态时段
    // worker.subscribe('Get.trafficCapacity.Data', (c) => {
    //     let data = memoryStore.getItem('trafficCapacity')
    //     let txnl = data?.txnl  //通行能力
    //     let dtsd =data?.dtsd  //动态时段
    //      txnl && worker.publish('Web', 'push.trafficCapacity.Data', {data: txnl, key: 'trafficCapacity'})
    //     dtsd && worker.publish('Web', 'push.trafficCapacity.Data', {data: dtsd, key: 'delayBoard'})
    //
    // });
    // // 获取通行能力  动态时段
    // worker.subscribe('Get.indicator.Data', (c) => {
    //     let data = memoryStore.getItem('indicator')
    //      let indicator =data?.indicator  //折线图  航班指标     出港旅客数量指标  本场起降间隔指标
    //     indicator && worker.publish('Web', 'push.trafficCapacity.Data', {data: indicator, key: 'indicator'})
    //
    // });

    worker.subscribe('Page.conditionalOperation.Start', () => {
        checkClient('AdverseClient').then(() => {
            subWSEvent();
            console.log('conditionalOperation连接成功')
        });
        checkClient('DelaysClient').then(() => {
            DelaysEvent();
        });

    });

    worker.subscribe('Page.conditionalOperation.Stop', () => {
        forEach(clientObj, item => {
            item.unSubAll()
        })
    })
};
