// import {values, extend,map, forEach} from 'lodash';
import SocketWrapper from "../lib/socketWrapper";
import {memoryStore} from "../lib/memoryStore";
import {transRunwayData} from "../manage/Monitor";

let clientObj = {};
let worker, client, ajax;

/*
* 检查服务是否在线
* */
export const checkClient = (clientField) => {
    return new Promise((resolve) => {
       let timer= setInterval(() => {
            if (clientObj[clientField]) {
                clearInterval(timer)
                resolve();
            }
        }, 50);
    });
};
// situation 服务的连接
const subWSEventMSG = (clientId) => {
    // 消息
    let messageClient = clientObj.messageClient;
    messageClient.sub('/topic/notice/' + clientId, (res) => {
        if (res.code == 200) {

        }
        memoryStore.setItem('global', {messageClientData: res.data})
        worker.publish('Web', 'push.message.data', res)
    })
};
// 跑道模式
const subWSEventRunwey = (clientId) => {
    let runweyClient = clientObj.runweyClient;
    //跑道模式和禁用状态
    runweyClient.sub('/Flight/runwayModels', (res) => {
        memoryStore.setItem('Pools', {runwayModels: res})
        transRunwayData(worker)
        worker.publish('Web', 'push.runway.Data', res)
    })
};

export const init = (worker_, httpRequest_, clientId) => {
    worker = worker_;
    ajax = httpRequest_;
    // 消息
    worker.subscribe('MSG.Network.Connected', (c) => {
        clientObj.messageClient = new SocketWrapper(c);
    });
    checkClient('messageClient').then(() => {
        subWSEventMSG(clientId);
        console.log('messageClient连接成功')
    });
    worker.subscribe('Get.message.Data', () => {
        let data = memoryStore.getItem('Pools').messageClientData
        if(data){
            worker.publish('Web', 'push.message.Data', data)
        }else{
            httpRequest_.get('msg', 'notice/findCurrentNotice').then((res) => {
                if (res.code == 200 && res?.data?.length) {
                    memoryStore.setItem('global', {messageClientData: res.data})
                    worker.publish('Web', 'push.message.Data', res.data)
                }
            })
        }

    });


    //  跑道模式  跑道模式和禁用状态
    worker.subscribe('Situation.Network.Connected', (c) => {
        clientObj.runweyClient = new SocketWrapper(c);
    });
    checkClient('runweyClient').then(() => {
        subWSEventRunwey();
        console.log('runweyClient连接成功')
    });
    worker.subscribe('Get.runway.Data', (() => {
            let runwayData = memoryStore.getItem('Pools').runwayData
            worker.publish('Web', 'push.runway.Data', runwayData)
        })
    )


};
