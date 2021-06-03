 import { forEach,map} from 'lodash';


export const situationStart = (posWorker) => {
    posWorker.subscribe('Situation.Change.Sync',(data)=>{

    })
}
export const grounpStatus = (res) => {
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
    return data
}

export const situationStop = (posWorker) => {
    posWorker.unsubscribe('Situation.Change.Sync')
}
