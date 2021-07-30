import {delayNewStop, delayNewStart} from "../../manage/conditionalOperation/delayNew";
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
    let client = clientObj.delayNewClient;

        client.sub('/Flight/number/Ofpeople', (data) => {
            worker.publish('Web', 'page.delayNew.data', {data: data.AOC_TODAY_PERSON_NUM, key: 'passengerSts'})
        })


};

export const init = (worker_, httpRequest_) => {
    worker = worker_;
    ajax = httpRequest_;
    worker.subscribe('Situation.Network.Connected', (c) => {
        clientObj.delayNewClient = new SocketWrapper(c);
    });

    worker.subscribe('Page.delayNew.Start', () => {
        delayNewStart(worker);
        checkClient('delayNewClient').then(() => {
            subWSEvent();
            console.log('delayNew连接成功')
        });


    });

    worker.subscribe('Page.delayNew.Stop', () => {
        delayNewStop(worker);
        forEach(clientObj, item => {
            item.unSubAll()
        })
    })
};
