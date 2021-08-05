import moment from 'moment'
import postal from 'postal';
import {memoryStore} from "../lib/memoryStore";

 export const parseTime = (data) => {
     let HHMMTime = data.responseData;
      let time = moment(HHMMTime).valueOf();
      // app 页面
      postal.publish({
         channel: 'Web',
         topic: 'Time.Sync',
         data: time,
     });
     memoryStore.setItem('global', {now:time});
 } ;
export const publicktart = (posWorker) => {
    // posWorker.subscribe('Resource.Change.Sync', (data) => {
    // })
}

export const pulickStop = (posWorker) => {
    // posWorker.unsubscribe('Resource.Change.Sync')
}


