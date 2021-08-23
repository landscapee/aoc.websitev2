
import {alternateConfigStop,alternateConfigStart} from "../../manage/conditionalOperation/alternate";
 import { mapKeys,map, extend,forEach,orderBy} from 'lodash';
import SocketWrapper from "../../lib/socketWrapper";
 let clientObj = {};
 let   worker, client, ajax;
import { flightDB } from '@/worker/lib/storage';

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
    let client = clientObj.alternateClient;

    let user={}
    let urlObj={
        // 备降航班统计
        alternateLanding:'/adverse-condition/stat/alternateLanding',
        // 临时机位
        tempSeat:'/adverse-condition/stat/tempSeat',
        // 应急下客区
        exigencyDropOffArea:'/adverse-condition/list/exigencyDropOffArea',
        // 机位空出3小时
        seatEvaluate:'/adverse-condition/stat/seatEvaluate',
        // 机位空出3小时(点对点)
        // seatEvaluate_User:`/adverse-condition/user/${user.id}/stat/seatEvaluate`,

        // 临时等待区
        tempWaitArea:'/adverse-condition/stat/tempWaitArea',
        // 紧急加油机位
        exigencyRefuelSeat:'/adverse-condition/list/exigencyRefuelSeat',
    }
    map(urlObj,(val,key)=>{
        client.sub(val,(data)=>{
            let mykey=key
            let myDate=data
            if(key=='seatEvaluate'){
                // 机位空出2小时 当前
                let myDate = mapKeys(data.info, (item) => item.seatType);
                // 当前+30分钟
                if (data.type === 2) {
                    mykey='seatEvaluate_30'
                }
                // memoryStore.setItem('AdverseCondition', { [mykey]: obj });
            }
            // else if(key=='seatEvaluate_User'){
                // 机位空出2小时(点对点)
                // let obj = mapKeys(data.info, (item) => item.seatType);
            // }
            // 合并航班动态的数据
            if(key=='alternateLanding'||key=='exigencyDropOffArea'||key=='tempSeat'){
                myDate=map(myDate,(k,l)=>{
                    let f = flightDB.by('flightId', k.flightId);
                    return extend(f,k)
                })
                myDate=orderBy(myDate, ['actualTime', 'eta', 'ctot'], ['asc']);

            }

            worker.publish('Web','alternateData',{data:myDate,key:mykey})
        })
    })

};

export const init = (worker_,httpRequest_) => {
    worker = worker_;
    ajax = httpRequest_;
    worker.subscribe('Adverse.Network.Connected', (c) => {
        clientObj.alternateClient = new SocketWrapper(c);
    });
    worker.subscribe('Page.alternate.Start',()=>{
        alternateConfigStart(worker);
        checkClient('alternateClient').then(()=>{
            subWSEvent();
            console.log('alternate连接成功')
        });
    });
    worker.subscribe('Page.alternate.Stop',()=>{
        alternateConfigStop(worker);
        forEach(clientObj,item=>{
             item.unSubAll()
        })
    })
};
