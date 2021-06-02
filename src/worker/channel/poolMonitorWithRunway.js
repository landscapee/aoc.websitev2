
import {situationStart, situationStop} from "../manage/poolMonitorWithRunway";
import Logger from "../../lib/logger";
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
    client.sub('Flight/normalMonitor/delayFlight',(res)=>{
        
        worker.publish('Web','poolMonitorWithRunway.channel',{delayFlights2:res,key:'delayFlights2'})
    });
    //快速过站池
    client.sub('/Flight/monitor/overStation',(res)=>{
        

        let fastEnterNoRequested = [];
        let fastEnterRequested = [];
        forEach(res, (item) => {
            // status 0:未协调 1:已协调 2:已拒绝
            if (!item.overStationStatus && item.overStationStatus !== 0) {
                fastEnterNoRequested.push(item);
            } else {
                fastEnterRequested.push(item);
            }
        });
        let data={
            fastEnter_noRequested:fastEnterNoRequested,
            fastEnter_requested:fastEnterRequested,
        }
        worker.publish('Web','poolMonitorWithRunway.channel',{data:data,key:'fastEnter'})
    });
    //临界延误池
    client.sub('Flight/monitor/criticalDelay',(res)=>{
        let criticalNoRequested = [];
        let criticalRequested = [];
        forEach(res, (item) => {
            // status 0:未协调 1:已协调 2:已拒绝
            if (!item.overStationStatus && item.overStationStatus !== 0) {
                criticalNoRequested.push(item);
            } else {
                criticalRequested.push(item);
            }
        });
        let data={
            critical_noRequested:criticalNoRequested,
            critical_requested:criticalRequested,
        }
        worker.publish('Web','poolMonitorWithRunway.channel',{data:data,key:'critical'})
    });
    //始发航班池
    client.sub('Flight/monitor/initialFlights',(res)=>{
        
        worker.publish('Web','poolMonitorWithRunway.channel',{data:res,key:'initialFlights2'})
    })
    //长期延误池
    client.sub('Flight/monitor/alwaysDelay',(res)=>{
        
        worker.publish('Web','poolMonitorWithRunway.channel',{data:res,key:'alwaysDelay'})
    })
    //起飞保障池
    client.sub('Flight/monitor/departureGuarantee',(res)=>{
        
        worker.publish('Web','poolMonitorWithRunway.channel',{data:res,key:'departureGuarantee'})
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
