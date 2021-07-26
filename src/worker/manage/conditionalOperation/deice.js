
import {map,groupBy}from 'lodash'
 export const transWether = (data) => {
      let tempTime = 0;
     let weatherObj = {};
     map(data, (item) => {
         if (item.createTime > tempTime) {
             tempTime = item.createTime;
             weatherObj = item;
         }
     });
     return weatherObj
}
export const tranDeiceFlights = (data) => {
    map(data,item=>{
        // 0:待除冰 1:正在除冰 2:已完成
        if (!item.actualStartTime) {
            item.deiceStatus = 0;
        }
        if (item.actualStartTime && !item.actualEndTime) {
            item.deiceStatus = 1;
        }
        if (item.actualEndTime) {
            item.deiceStatus = 2;
        }
    })
    let obj=groupBy(data,'agencyCode')
    return obj
};
export const deiceStart = (posWorker) => {
    // posWorker.subscribe('Resource.Change.Sync', (data) => {
    // })
}

export const deiceStop = (posWorker) => {
    // posWorker.unsubscribe('Resource.Change.Sync')
}


