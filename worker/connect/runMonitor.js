import {getFlightDetail} from '../lib/storage'
import {situationStart, situationStop} from "../model/runMonitor";
 import Logger from "../../common/logger";
import {values, extend,map, forEach} from 'lodash';
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
    //批量关注池
    function getFlightDatas(data){
        let arr=[]
        data.map((k,l)=>{
            if(getFlightDetail(k.flightId)){
                arr.push(getFlightDetail(k.flightId))
            }

        })
        return arr
    };
    client.sub('Flight/monitor/batchConcern',(res)=>{
        let data=getFlightDatas(res)
        worker.publish('Web','batchConcern',data)
    });
    //提前落地池
    client.sub('/Flight/monitor/advanceArrive',(res)=>{
        let data=getFlightDatas(res)
        worker.publish('Web','advanceArrive',data)
    });
    //地面保障池
    client.sub('Flight/monitor/guaranteeWarn',(res)=>{
        let data=getFlightDatas(res)
        worker.publish('Web','guaranteeWarn',data)
    });
    //要客航班池
    client.sub('Flight/monitor/vvpFlights',(res)=>{
        let data=getFlightDatas(res)
        worker.publish('Web','vvpFlights',data)
    })
};


export const init = (worker_) => {
    worker = worker_;
    worker.subscribe('Situation.Network.Connected', (c) => {
        clientObj.situationClient = new SocketWrapper(c);
     });

    worker.subscribe('Page.RunMonitor.Start',()=>{
        situationStart(worker);
        checkClient('situationClient').then(()=>{
            subWSEvent();
            console.log('situation连接成功')
        });
    });

    worker.subscribe('Page.RunMonitor.Stop',()=>{
        situationStop(worker);
        forEach(clientObj,item=>{
            console.log(item)
            item.unSubAll()
        })
    })
};
