
 // import {values, extend,map, forEach} from 'lodash';
import SocketWrapper from "../lib/socketWrapper";
 import {memoryStore} from "../lib/memoryStore";
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
const subWSEvent = (clientId) => {
    let client = clientObj.messageClient;

    client.sub('/topic/notice/' + clientId,(res)=>{
        if(res.code==200){

        }
        memoryStore.setItem('global',{messageClientData:res.data})
        worker.publish('Web','messageClient.data',res)

    })
};

export const init = (worker_,httpRequest_,clientId) => {
    worker = worker_;
    ajax = httpRequest_;
    worker.subscribe('MSG.Network.Connected', (c) => {
        clientObj.messageClient = new SocketWrapper(c);

    });
     checkClient('messageClient').then(()=>{
         subWSEvent(clientId);
        console.log('messageClient连接成功')
    });
    worker.subscribe('Get.message.Data',()=>{
        httpRequest_.get('msg', 'notice/findCurrentNotice').then((res) => {
            if (res.code == 200 && res?.data?.length) {
                memoryStore.setItem('global',{messageClientData:res.data})
                worker.publish('Web','messageClient.data',res.data)
            }
        })
        // let messageClient = memoryStore.getItem('global').messageClient

    });



};
