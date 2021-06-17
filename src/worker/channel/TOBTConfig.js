
import {tobtConfigStart,tobtConfigStop} from "../manage/TOBTConfig";
 import {values, extend,map, forEach} from 'lodash';
import SocketWrapper from "../lib/socketWrapper";
 let clientObj = {};
 let   worker, client, ajax;

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
    let client = clientObj.adverseClient;

    client.sub('/adverse-condition/constant/tobt/data',(res)=>{
         worker.publish('Web','tobtConfig',res)
    })
};

export const init = (worker_,httpRequest_) => {
    worker = worker_;
    ajax = httpRequest_;
    worker.subscribe('Adverse.Network.Connected', (c) => {
        clientObj.adverseClient = new SocketWrapper(c);
    });

    worker.subscribe('Page.tobtConfig.Start',()=>{
        tobtConfigStart(worker);
        checkClient('adverseClient').then(()=>{
            subWSEvent();
            console.log('tobtConfig连接成功')
        });
    });
    worker.subscribe('Page.tobtConfig.Stop',()=>{
        tobtConfigStop(worker);
        forEach(clientObj,item=>{
            console.log(item)
            item.unSubAll()
        })
    })
};
