import moment from 'moment'
import postal from 'postal';
import {memoryStore} from "../lib/memoryStore";
let serverTime=null
 export const parseTime = (data,num) => {
     let HHMMTime = data.responseData;
     let PCNow = new Date().getTime();
     let time = moment(HHMMTime).valueOf();
        let PCOffsetTime


     PCOffsetTime = time - PCNow;
     serverTime = time;
      // app 页面
     let pushApp=(t)=>{
         postal.publish({
             channel: 'Web',
             topic: 'Time.Sync',
             data: t,
         });
     }
     pushApp(time)
     memoryStore.setItem('global', {now:time});
     setInterval(() => {
         let PCNow = new Date().getTime();
         let timeNew = PCNow + PCOffsetTime;
         pushApp(timeNew)
         memoryStore.setItem('global', {now:timeNew});
     }, 3000);
 } ;
export const publicktart = (posWorker) => {
    // posWorker.subscribe('Resource.Change.Sync', (data) => {
    // })
}

export const pulickStop = (posWorker) => {
    // posWorker.unsubscribe('Resource.Change.Sync')
}


