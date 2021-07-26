import {deiceStop, deiceStart, transWether,tranDeiceFlights} from "../../manage/conditionalOperation/deice";
import {mapKeys, map, extend, forEach, keyBy, get} from 'lodash';
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
const subWSEvent = () => {
    let client = clientObj.deiceClient;

    let urlObj = {
        // 天气
        weather: '/Flight/delay/weather',
        // 天气
        // deiceStatistics: '/adverse-condition/deice/dynamic/statistic',
        // 天气
        // emergencyEventNode2: 'wwwww',
        // 天气
        // emergencyEventNode3: 'wwwww',
    }
    // key --- 页面订阅地址
    let obj = {
        weather: 'Page.deiceTop',
        weather1: 'Page.deiceTop',
    }

    map(urlObj, (val, key) => {
        client.sub(val, (data) => {
            worker.publish('Web', 'Page.deiceTop', {data: 'weather', key: 'weather'})
            let mydata = data
            if (key == 'weather') {
                mydata = transWether(mydata)
            } else if (key == 'weathe1r') {

            }

            worker.publish('Web', obj[key], {data: mydata, key: key})
        })
    })

};
const adverseClientEvent = () => {
    let client = clientObj.adverseClient;
    // 除冰车辆总数  启用总数
    client.sub('/adverse-condition/deice/dynamic/statistic', (data) => {
        worker.publish('Web', 'Page.deiceTop', {data: data, key: 'deiceStatistics'})
    });
    client.sub('/adverse-condition/stat/flightAtdRate', (data) => {
        worker.publish('Web', 'Page.deiceTop', {data: data, key: 'departureRate'})
    })
    client.sub('/adverse-condition/deice/dynamic/flight', (data) => {
        let myData=tranDeiceFlights(data)
        worker.publish('Web', 'Page.deiceBottom', {data: myData, key: 'deiceFlights'})
    })
};
const situationClientEvent = () => {
    let client = clientObj.situationClient;
    // 离港速率
    client.sub('/Flight/traffic', (data) => {
        worker.publish('Web', 'Page.deiceTop', {data: data, key: 'departRate'})
    })

};

export const init = (worker_, httpRequest_) => {
    worker = worker_;
    ajax = httpRequest_;
    worker.subscribe('RunwayWeather.Network.Connected', (c) => {
        clientObj.deiceClient = new SocketWrapper(c);
    });
    worker.subscribe('Situation.Network.Connected', (c) => {
        clientObj.situationClient = new SocketWrapper(c);
    });
    worker.subscribe('Adverse.Network.Connected', (c) => {
        clientObj.adverseClient = new SocketWrapper(c);
    });

    worker.subscribe('Page.deice.Start', () => {
        deiceStart(worker);
        checkClient('deiceClient').then(() => {
            subWSEvent();
            console.log('deice连接成功')
        });
        checkClient('adverseClient').then(() => {
            adverseClientEvent();
            console.log('adverse连接成功')
        });
        checkClient('situationClient').then(() => {
            situationClientEvent();
            console.log('situationClient连接成功')
        });
    });

    worker.subscribe('Page.deice.Stop', () => {
        deiceStop(worker);
        forEach(clientObj, item => {
            item.unSubAll()
        })
    })
};
