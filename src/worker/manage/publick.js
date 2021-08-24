import moment from 'moment'
import postal from 'postal';
import {memoryStore} from "../lib/memoryStore";
let serverTime=null
 export const parseTime = (data,posWorker) => {
     let HHMMTime = data.responseData;
     let PCNow = new Date().getTime();
     let time = moment(HHMMTime).valueOf();
        let PCOffsetTime


     PCOffsetTime = time - PCNow;
     serverTime = time;
        // 页面初始化 接入服务器时间 刷新 触发更新
     postal.publish({
         channel: 'Web',
         topic: 'Time.Sync.page',
         data: time,
     });

      // index.js
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
         console.log(666);
         let PCNow = new Date().getTime();
         let timeNew = PCNow + PCOffsetTime;
         pushApp(timeNew)
         memoryStore.setItem('global', {now:timeNew});
     }, 600);
     // posWorker.subscribe('', (data) => {
     // })
 } ;
export const publicktart = (posWorker) => {
    // posWorker.subscribe('Resource.Change.Sync', (data) => {
    // })
}

export const pulickStop = (posWorker) => {
    // posWorker.unsubscribe('Resource.Change.Sync')
}


