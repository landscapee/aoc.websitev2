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
    let client = clientObj.alternateClient;
    // import { displayTimeHour } from 'helper/utility';
    // let emergencyCfg = {
    //     准备阶段: 'ready',
    //     实施阶段: 'doing',
    //     结束阶段: 'finish',
    // };

    let user = {}
    let urlObj = {
        // 低能见运行-应急救援
        emergencyEventNode: '/adverse-condition/list/emergencyEventNode',
        // 气象灾害 - 备降外场、取消航班
        weatherStat: '/adverse-condition/meteorologyDisaster/stat',
        // 预测航班积压量
        estimatedBacklog: '/adverse-condition/meteorologyDisaster/speculative/execution',
        // 气象灾害-三大指标  航班指标预测 实时延误航班 最近一次跑道使用间隔
        indicator: '/adverse-condition/meteorologyDisaster/indicator',
        // 机位空出3小时
        seatEvaluate_User1: `adverse-condition`,
        // 机位空出3小时
        seatEvaluate_User2: `adverse-condition`,
        // 机位空出3小时
        seatEvaluate_User3: `adverse-condition`,
        // 机位空出3小时
        seatEvaluate_User: `adverse-condition`,


    }
    map(urlObj, (val, key) => {
        client.sub(val, (data) => {
            worker.publish('Web', 'runNewData', {data: data, key: key})
        })
    })

};

export const init = (worker_, httpRequest_) => {
    worker = worker_;
    ajax = httpRequest_;
    worker.subscribe('Adverse.Network.Connected', (c) => {
        clientObj.runNewClient = new SocketWrapper(c);
    });
    worker.subscribe('Page.runNew.Start', () => {
        runNewStart(worker);
        checkClient('runNewClient').then(() => {
            subWSEvent();
            console.log('runNew连接成功')
        });
    });
    worker.subscribe('Page.runNew.Stop', () => {
        runNewStop(worker);
        forEach(clientObj, item => {
            item.unSubAll()
        })
    })
};
