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
        setInterval(() => {
            if (clientObj[clientField]) {
                resolve();
            }
        }, 50);
    });
};
// situation 服务的连接
const subWSEvent = (clientId) => {
    // 消息
    let messageClient = clientObj.messageClient;

    messageClient.sub('/topic/notice/' + clientId, (res) => {
        if (res.code == 200) {

        }
        memoryStore.setItem('global', {messageClientData: res.data})
        worker.publish('Web', 'messageClient.data', res)

    })
    // 跑道模式
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
        subWSEvent(clientId);
        console.log('messageClient连接成功')
    });
    worker.subscribe('Get.message.Data', () => {
        httpRequest_.get('msg', 'notice/findCurrentNotice').then((res) => {
            if (res.code == 200 && res?.data?.length) {
                memoryStore.setItem('global', {messageClientData: res.data})
                worker.publish('Web', 'messageClient.data', res.data)
            }
        })
    });
    // 跑道模式  跑道模式和禁用状态
    worker.subscribe('Situation.Network.Connected', (c) => {
        clientObj.runweyClient = new SocketWrapper(c);

    });
    worker.subscribe('Get.runway.Data', (() => {
            let runwayData = memoryStore.getItem('Pools').runwayData
            worker.publish('Web', 'push.runway.Data', runwayData)
        })
    )


};
