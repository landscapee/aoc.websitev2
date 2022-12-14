
import {resourceStart,resourceStop,resourceSituationData} from "../manage/resourceMonitor";
 // import {checkWebsocketResponseDataFinish} from "../../lib/helper/flight";
import {values, extend,map, forEach} from 'lodash';
import SocketWrapper from "../lib/socketWrapper";
let clientObj = {};
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

    let client = clientObj.resourceClient;
    //停机位态势
    client.sub('/resource/stat/seatSituation', (data) => {
         resourceSituationData(worker,data,'seatSituation')
    });
    //登机口态势
    client.sub('/resource/stat/gateSituation', (data, body) => {
         if (!body.responseData) {
            return;
        }
        resourceSituationData(worker,data,'gateSituation')
    });
    //行李转盘态势
    client.sub('/resource/stat/carouselSituation', (data) => {
         resourceSituationData(worker,data,'carouselSituation')
    });
    //机位当前使用情况
    client.sub('/resource/stat/seatSituationUsing', (data) => {
         //1、先存workpage
        // memoryStore.setItem('ResourceMonitoring', { seatUsageData: data });
        worker.publish('Web','resourceUsageData',{data,key:'seatUsageData'})
    });
    //登机口当前使用情况
    client.sub('/resource/stat/gateSituationUsing', (data) => {
         //1、先存workpage
        // memoryStore.setItem('ResourceMonitoring', { gateUsageData: data });
        worker.publish('Web','resourceUsageData',{data,key:'gateUsageData'})

    });
    //行李转盘当前使用情况
    client.sub('/resource/stat/carouselSituationUsing', (data) => {
         //1、先存workpage
        // memoryStore.setItem('ResourceMonitoring', { carouselUsageData: data });
        worker.publish('Web','resourceUsageData',{data,key:'carouselUsageData'})

    });

};

export const init = (worker_,httpRequest_) => {
    worker = worker_;
    ajax = httpRequest_;
    worker.subscribe('Resource.Network.Connected', (c) => {
        clientObj.resourceClient = new SocketWrapper(c);
    });

    worker.subscribe('Page.resourceMonitoring.Start',()=>{
        resourceStart(worker);
        checkClient('resourceClient').then(()=>{
            subWSEvent();
            console.log('resourceClient连接成功')
        });
    });

    worker.subscribe('Page.resourceMonitoring.Stop',()=>{
        resourceStop(worker);
        forEach(clientObj,item=>{
            console.log(item)
            item.unSubAll()
        })
    })
};
