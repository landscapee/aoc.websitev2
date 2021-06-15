
import {situationStart, situationStop,grounpStatus,getFlightDatas,transRunwayData} from "../manage/Monitor";
import Logger from "../../lib/logger";
import {checkWebsocketResponseDataFinish} from "../../lib/helper/flight";
import {values, extend,map, forEach} from 'lodash';
import SocketWrapper from "../lib/socketWrapper";
let clientObj = {};
const log = new Logger('connect.flight');
let   worker, client, ajax;
import {memoryStore} from "../../worker/lib/memoryStore";

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
        
        let data=getFlightDatas(res,true)
        worker.publish('Web','poolMonitorWithRunway.table',{data:data,key:'delayFlights2'})
    });
    //快速过站池
    client.sub('/Flight/monitor/overStation',(res)=>{
        checkWebsocketResponseDataFinish().then((d)=>{
            let data=grounpStatus(res,'fastEnter','overStationStatus')
            worker.publish('Web','poolMonitorWithRunway.table',{data:data,key:'fastEnter'})
        })
    });
    //临界延误池
    client.sub('/Flight/monitor/criticalDelay',(res)=>{
         let data=grounpStatus(res,'critical','criticalDelayStatus')
          worker.publish('Web','poolMonitorWithRunway.table',{data:data,key:'critical'})
    });
    //始发航班池
    client.sub('/Flight/monitor/initialFlights',(res)=>{
        let data=getFlightDatas(res)
        worker.publish('Web','poolMonitorWithRunway.table',{data:data,key:'initialFlights2'})
    })
    //长期延误池
    client.sub('/Flight/monitor/alwaysDelay',(res)=>{
        checkWebsocketResponseDataFinish().then((d)=>{
            let data=getFlightDatas(res)
            worker.publish('Web','poolMonitorWithRunway.table',{data:data,key:'alwaysDelay'})
        })
    })
    //起飞保障池
    client.sub('/Flight/monitor/departureGuarantee',(res)=>{
        
        let data=getFlightDatas(res)
        worker.publish('Web','poolMonitorWithRunway.table',{data:data,key:'departGuarantee'})
    })
     //time flight
    client.sub('/Flight/monitor/queue',(res)=>{
        memoryStore.setItem('Pools', { monitorQueue: res })
        let data=transRunwayData(worker )
        // worker.publish('Web','monitor.queue',{data:res})
    });
    //跑道模式和禁用状态
    client.sub('/Flight/runwayModels',(res)=>{
        memoryStore.setItem('Pools', { runwayModels: res })

        let data=transRunwayData(worker )
        // let data=getFlightDatas(res)
        // worker.publish('Web','runwayModels',{data:res})
    })

};

export const init = (worker_,httpRequest_) => {
    worker = worker_;
    ajax = httpRequest_;
    worker.subscribe('Situation.Network.Connected', (c) => {
        clientObj.situationClient = new SocketWrapper(c);
    });
    worker.subscribe('QueuesMonitor.TimeFilter', (time) => {
        transRunwayData(worker,time )
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
