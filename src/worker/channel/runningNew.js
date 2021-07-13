import {runNewStop, runNewStart} from "../manage/runningNew";
import {mapKeys, map, extend, forEach} from 'lodash';
import SocketWrapper from "../lib/socketWrapper";

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
    let client = clientObj.runNewClient;
     // let emergencyCfg = {
    //     准备阶段: 'ready',
    //     实施阶段: 'doing',
    //     结束阶段: 'finish',
    // };

     let urlObj = {
        // 低能见运行-应急救援
        emergencyEventNode: '/adverse-condition/list/emergencyEventNode',
        // 气象灾害 - 备降外场、取消航班
        weatherStat: '/adverse-condition/meteorologyDisaster/stat',
        // 预测航班积压量
        estimatedBacklog: '/adverse-condition/meteorologyDisaster/speculative/execution',
        // 气象灾害-三大指标  航班指标-预测 实时延误航班
        // 最近一次跑道使用间隔  出港旅客数量指标  本场起降间隔指标
        indicator: '/adverse-condition/meteorologyDisaster/indicator',
        // //低能见度运行 table 数据  MDRS预警下面的表格
        runwayStandard: `/adverse-condition/runwayStandard/list`,
        //  跑道天气曲线图    RVR趋势图  露点温度与温度趋势图
        runwayWeather: `/adverse-condition/statistic/data/runway`,
        // 通行能力
        seatEvaluate_User2: `/adverse-condition/trafficCapacity/list`,
        // 动态时段
        delayBoard: `/Flight/delay/FlightDelayDetailBoard`,
    }
    map(urlObj, (val, key) => {
        client.sub(val, (data) => {
            worker.publish('Web', key, {data: data, key: key})
        })
    })

};

export const init = (worker_, httpRequest_) => {
    worker = worker_;
    ajax = httpRequest_;
    worker.subscribe('Adverse.Network.Connected', (c) => {
        clientObj.runNewClient = new SocketWrapper(c);
    });
    worker.subscribe('Page.runningNew.Start', () => {
        runNewStart(worker);
        checkClient('runNewClient').then(() => {
            subWSEvent();
            console.log('runNew连接成功')
        });
    });
    worker.subscribe('Page.runningNew.Stop', () => {
        runNewStop(worker);
        forEach(clientObj, item => {
            item.unSubAll()
        })
    })
};
