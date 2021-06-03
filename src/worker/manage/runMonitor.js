import {getFlightDetail} from "../lib/storage";
import { forEach,map} from 'lodash';
export const getFlightDatas = (data) => {
    let arr=[];
    map(data,(k,l)=>{
        if(getFlightDetail(k.flightId)){
            arr.push(getFlightDetail(JSON.stringify(k.flightId)))
        }
    })
    return arr
}
export const grounpStatus = (res,key) => {
    let data={

    }
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
    data[key+'_noRequested']=getFlightDatas(criticalNoRequested)
    data[key+'_requested']=getFlightDatas(criticalRequested)

    return data
}
export const situationStart = (posWorker) => {
   posWorker.subscribe('Situation.Change.Sync',(data)=>{

  })
}

export const situationStop = (posWorker) => {
  posWorker.unsubscribe('Situation.Change.Sync')
 }
