import {getFlightDetail} from '../lib/storage'
import {situationStart, situationStop} from "../model/runMonitor";
 import Logger from "../../common/logger";
import {values, extend, forEach} from 'lodash';
import SocketWrapper from "../lib/socketWrapper";

let worker;
let clientObj = {};
const log = new Logger('connect.flight');

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
    let client = clientObj.situationClient;
    client.sub('/Flight/delay/executableFlight',(data)=>{
        // let flights = {};
        // map(data, (flightId) => {
        //   flights[flightId] = true;
        // });
        // memoryStore.setItem('ExecutableFlights', flights, true);
    })
};


export const init = (worker_) => {
    worker = worker_;
    worker.subscribe('Situation.Network.Connected', (c) => {
        clientObj.situationClient = new SocketWrapper(c);
     });

    worker.subscribe('Page.Situation.Start',()=>{
        situationStart(worker);
        checkClient('situationClient').then(()=>{
            subWSEvent();
            console.log('situation连接成功')
        });
    });

    worker.subscribe('Page.Situation.Stop',()=>{
        situationStop(worker);
        forEach(clientObj,item=>{
            console.log(item)
            item.unSubAll()
        })
    })
};
