
import {map}from 'lodash'
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
export const deiceStart = (posWorker) => {
    // posWorker.subscribe('Resource.Change.Sync', (data) => {
    // })
}

export const deiceStop = (posWorker) => {
    // posWorker.unsubscribe('Resource.Change.Sync')
}


