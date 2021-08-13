import {delayNewStop, delayNewStart,setReduce,transRunDecisionTable} from "../../manage/conditionalOperation/delayNew";
import { map, forEach} from 'lodash';
import SocketWrapper from "../../lib/socketWrapper";
import {memoryStore} from "../../lib/memoryStore";

let clientObj = {};
let worker, client, ajax;

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
    let client = clientObj.delayNewClient;

        client.sub('/Flight/number/Ofpeople', (data) => {
            worker.publish('Web', 'page.delayNew.data', {data: data.AOC_TODAY_PERSON_NUM, key: 'passengerSts'})
        })


};
// const AdverseClientEvent = () => {
//     let client = clientObj.AdverseClient;
//
//         client.sub('/adverse-condition/wd/data/all', (resData, body) => {
//             if (body.code === 200) {
//                 // 1常态化 2: 大面积延误
//                 let type = {
//                     type: resData.type === '0' ? '1' : resData.type,
//                 };
//                 type.type = notFixType ? resData.type : type.type; // 不修复type
//                 memoryStore.setItem('AdverseCondition', { currentDelayType: type.type });
//                 setReduce(worker,memoryStore)
//             }
//          })
//
//
// };

export const init = (worker_, httpRequest_) => {
    worker = worker_;
    ajax = httpRequest_;
    worker.subscribe('Situation.Network.Connected', (c) => {
        clientObj.delayNewClient = new SocketWrapper(c);
    });
    // worker.subscribe('Adverse.Network.Connected', (c) => {
    //     clientObj.AdverseClient = new SocketWrapper(c);
    // });

    // worker.subscribe('get.delayNew.data', (type) => {
    //      let data = memoryStore.getItem('AdverseCondition')?.reduceData
    //     if(!data){
    //         ajax.get('adverse', 'adjust/getCurrentReduce?type=' + type, null,false).then((resData) => {
    //             memoryStore.setItem('AdverseCondition', { reduceData: resData.data });
    //             setReduce(worker,memoryStore)
    //         });
    //     }else{
    //         setReduce(worker,memoryStore)
    //     }
    //
    // });
    // 恢复阶段运行决策
    worker.subscribe('get.runDecisionTable.data', (obj) => {
        ajax.post('adverse', 'statistic/calFlightRunwayStatistic', obj,false).then((res) => {
            if(res.code==200){
                let data=transRunDecisionTable(res.data.data)
                worker.publish('Web', 'push.delayNew.data', {data: data, key: 'runDecisionTable'})

            }
        });

    });
    worker.subscribe('Page.delayNew.Start', () => {
        delayNewStart(worker);
        checkClient('delayNewClient').then(() => {
            subWSEvent();
            console.log('delayNew连接成功')
        });
        // checkClient('AdverseClient').then(() => {
        //     AdverseClientEvent();
        //     console.log('Adverse连接成功')
        // });
    });

    worker.subscribe('Page.delayNew.Stop', () => {
        delayNewStop(worker);
        forEach(clientObj, item => {
            item.unSubAll()
        })
    })
};
