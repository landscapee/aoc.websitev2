import {weatherStop, weatherStart} from "../../manage/conditionalOperation/weather";
import { map, forEach} from 'lodash';
import SocketWrapper from "../../lib/socketWrapper";

let clientObj = {};
let worker, client, ajax;

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
    let client = clientObj.weatherClient;

        // client.sub('/adverse-condition/meteorologyDisaster/warnInfo', (data) => {
        //     worker.publish('Web', 'page.weather.data', {data: data, key: 'weatherWarnInfo'})
        // })


};

export const init = (worker_, httpRequest_) => {
    worker = worker_;
    ajax = httpRequest_;
    worker.subscribe('Adverse.Network.Connected', (c) => {
        clientObj.weatherClient = new SocketWrapper(c);
    });

    worker.subscribe('Page.weather.Start', () => {
        weatherStart(worker);
        checkClient('weatherClient').then(() => {
            subWSEvent();
            console.log('weather连接成功')
        });


    });

    worker.subscribe('Page.weather.Stop', () => {
        weatherStop(worker);
        forEach(clientObj, item => {
            item.unSubAll()
        })
    })
};
