import {runNewStop, runNewStart, getRunwayWeather, getIndicator } from "../../manage/conditionalOperation/runningNew";
import {mapKeys, map, extend, forEach, keyBy,get} from 'lodash';
import SocketWrapper from "../../lib/socketWrapper";

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
    let urlObj = {
        // 低能见运行-应急救援
        emergencyEventNode: '/adverse-condition/list/emergencyEventNode',
        // 气象灾害 - 备降外场、取消航班
        weatherStat: '/adverse-condition/meteorologyDisaster/stat',
        // 预测航班积压量
        estimatedBacklog: '/adverse-condition/meteorologyDisaster/speculative/execution',
        // 气象灾害-三大指标  实时延误航班 最近一次跑道使用间隔
        //   航班指标  - 预测  出港旅客数量指标  本场起降间隔指标
        indicator: '/adverse-condition/meteorologyDisaster/indicator',
        // //低能见度运行 table 数据  MDRS预警下面的表格
        runwayStandard: `/adverse-condition/runwayStandard/list`,
        //  跑道天气曲线图   垂直能见度趋势图  RVR趋势图  露点温度与温度趋势图
        runwayWeather: `/adverse-condition/statistic/data/runway`,

    }
    let obj={
        weatherStat:'emergencyEventNode',
        emergencyEventNode:'emergencyEventNode',
        estimatedBacklog:'emergencyEventNode',
        indicator:'indicator',
        runwayStandard:'runwayStandard',
        runwayWeather:'runwayWeather',
     }
    map(urlObj, (val, key) => {
        client.sub(val, (data) => {
            let mydata = data
            if (key == 'runwayWeather') {
                mydata = getRunwayWeather(mydata)
            } else if (key === 'indicator') {
                mydata = getIndicator(mydata)
                worker.publish('Web', 'emergencyEventNode', {data: data, key: key})
            }
            let key1=obj[key]
            worker.publish('Web', key1, {data: mydata, key: key})
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
