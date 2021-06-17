import {forEach, map} from 'lodash';
import {flightDB} from "@/worker/lib/storage";
import {memoryStore} from "../lib/memoryStore";

export const resourceSituationData = (worker, data,key) => {
    let tabs=[{name:'全部',key:'全部'}]
    map(data,(item,key)=>{
        if(key!=='全部'){
            tabs.push({name:key,key})
        }
    })
    data.tabs=tabs
    memoryStore.setItem('ResourceMonitoring', { [key]: data });

    worker.publish('Web','resourceSituationData',{[key]:data})
}
export const resourceStart = (posWorker) => {
    posWorker.subscribe('Resource.Change.Sync', (data) => {
    })
}

export const resourceStop = (posWorker) => {
    posWorker.unsubscribe('Resource.Change.Sync')
}


