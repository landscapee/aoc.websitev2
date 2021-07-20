import {runNewStop, runNewStart} from "../manage/runningNew";
import {mapKeys, map, extend, forEach, keyBy, get} from 'lodash';
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
    let client = clientObj.deiceClient;

    let urlObj = {
        // 低能见运行-应急救援
        emergencyEventNode: 'wwwww',
        // 气象灾害 - 备降外场、取消航班
    }
    let obj = {
        weatherStat: 'emergencyEventNode',
    }
    map(urlObj, (val, key) => {
        client.sub(val, (data) => {
            let mydata = data
            worker.publish('Web', key, {data: mydata, key: key})
        })
    })

};

export const init = (worker_, httpRequest_) => {
    worker = worker_;
    ajax = httpRequest_;
    worker.subscribe('Adverse.Network.Connected', (c) => {
        clientObj.deiceClient = new SocketWrapper(c);
    });
    // worker.subscribe('Delays.Network.Connected', (c) => {
    //     clientObj.DelaysClient = new SocketWrapper(c);
    // });
    worker.subscribe('Page.deice.Start', () => {
        runNewStart(worker);
        checkClient('deiceClient').then(() => {
            subWSEvent();
            console.log('deice连接成功')
        });
    });

    worker.subscribe('Page.deice.Stop', () => {
        runNewStop(worker);
        forEach(clientObj, item => {
            item.unSubAll()
        })
    })
};
