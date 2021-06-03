
import {situationStart, situationStop,grounpStatus,getFlightDatas} from "../manage/runMonitor";
import Logger from "../../lib/logger";
import {checkWebsocketResponseDataFinish} from "../../lib/helper/flight";
import {values, extend,map, forEach} from 'lodash';
import SocketWrapper from "../lib/socketWrapper";
let clientObj = {};
const log = new Logger('connect.flight');
let   worker, client, ajax;

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
    //已延误池

    client.sub('/Flight/normalMonitor/delayFlight',(res)=>{
        
        let data=getFlightDatas(res.unNormal)
        worker.publish('Web','poolMonitorWithRunway.channel',{data:data,key:'delayFlights2'})
    });
    //快速过站池
    client.sub('/Flight/monitor/overStation',(res)=>{
        let data=grounpStatus(res,'fastEnter')
        worker.publish('Web','poolMonitorWithRunway.channel',{data:data,key:'fastEnter'})
    });
    //临界延误池
    client.sub('/Flight/monitor/criticalDelay',(res)=>{
         let data=grounpStatus(res,'critical')
        worker.publish('Web','poolMonitorWithRunway.channel',{data:data,key:'critical'})
    });
    //始发航班池
    client.sub('/Flight/monitor/initialFlights',(res)=>{
        let data=getFlightDatas(res)
        worker.publish('Web','poolMonitorWithRunway.channel',{data:data,key:'initialFlights2'})
    })
    //长期延误池
    client.sub('/Flight/monitor/alwaysDelay',(res)=>{
        checkWebsocketResponseDataFinish().then((d)=>{
            let data=getFlightDatas(res)
            worker.publish('Web','poolMonitorWithRunway.channel',{data:data,key:'alwaysDelay'})
        })
    })
    //起飞保障池
    client.sub('/Flight/monitor/departureGuarantee',(res)=>{
        
        let data=getFlightDatas(res)
        worker.publish('Web','poolMonitorWithRunway.channel',{data:data,key:'departGuarantee'})
    })
};

export const init = (worker_,httpRequest_) => {
    worker = worker_;
    ajax = httpRequest_;
    worker.subscribe('Situation.Network.Connected', (c) => {
        clientObj.situationClient = new SocketWrapper(c);
    });

    worker.subscribe('Page.poolMonitorWithRunway.Start',()=>{
        situationStart(worker);
        checkClient('situationClient').then(()=>{
            subWSEvent();
            console.log('situation连接成功')
        });
    });

    worker.subscribe('Page.poolMonitorWithRunway.Stop',()=>{
        situationStop(worker);
        forEach(clientObj,item=>{
            console.log(item)
            item.unSubAll()
        })
    })
};
