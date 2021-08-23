import {get, map, orderBy, findIndex} from 'lodash'
// import {flightDB} from "@/worker/lib/storage";
import {getFlightDetail} from "../../lib/storage";

// export const setReduce = (worker, memoryStore) => {
//     let data = memoryStore.getItem('AdverseCondition').reduceData;
//     let current = orderBy(data, (item) => parseInt(item.reduceInfo.reduceplanNo), ['desc'])[0] || {};
//     worker.publish('Web', 'push.delayNew.data', {data: current, key: 'suggestPlan'})
//
// };
export const transRunDecisionTable = (data) => {
   map(data,(item,key)=>{
     data[key]= map(item,(k)=>{
           return getFlightDetail(JSON.stringify(k))
       })
   })
    return data
};
export const delayNewStart = (posWorker) => {
    // posWorker.subscribe('RunNewStart.Change.Sync', (data) => {
    // })
}

export const delayNewStop = (posWorker) => {
    // posWorker.unsubscribe('RunNewStart.Change.Sync')
}


