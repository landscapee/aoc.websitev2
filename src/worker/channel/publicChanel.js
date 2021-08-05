// import {values, extend,map, forEach} from 'lodash';
import SocketWrapper from "../lib/socketWrapper";
import {memoryStore} from "../lib/memoryStore";
import {parseTime} from "../manage/publick";
import {orderBy} from 'lodash'
let clientObj = {};
let worker, client, ajax;
const convert = (msg) => {

    let statusCfg = {
        '1': '未处理',
        '2': '处理中',
        '3': '完成',
        '4': '撤销',
    };
    let operateCfg = {
        '1': '已读',
        '2': '回复',
        '3': '结束',
        '4': '撤销',
        '5': '转发',
    };
    let data = extend(msg, {
        from: msg.createDeptName,
        to: map(msg.receivers, (item) => {
            return item.receiveDeptName;
        }),
        level: msg.applyLevel,
        type: msg.specificType,
        scheme: msg.closeScheme,
        status: statusCfg[msg.status],
        reply: map(msg.messages, (item) => {
            return {
                createTime: item.createTime,
                from: item.createDeptName,
                status: operateCfg[item.operateType],
                content: item.operateType == 2 ? item.content : operateCfg[item.operateType],
            };
        }),
    });
    return data;
};
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

        memoryStore.setItem('global', {messageClientData:convert(res) })
        worker.publish('Web', 'push.message.Data', res)
    })



};

const subWSEventSituation = (clientId) => {
    let SituationClient = clientObj.SituationClient;
    //跑道模式和禁用状态 // 跑道模式
    SituationClient.sub('/Flight/runwayModels', (res) => {
        memoryStore.setItem('Pools', {runwayModels: res})
         worker.publish('Web', 'push.runway.Data', res)
         worker.publish('push.runway.Data', res)
    })
    //服务器时间
    SituationClient.sub('/Flight/CurrentTime', (res) => {
        parseTime(res)
    })
    SituationClient.sub('/topic/time/cur_time', (res) => {
        parseTime(res)
    })
};


let subAdverseWSEvent = () => {
    let adverseClient = clientObj.adverseClient;
	adverseClient.sub('/adverse-condition/message/push', (data) => {
		worker.publish('Web', 'Public.GetMsg.Sync', data);
	});
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

    //头部信息获取
    worker.subscribe('Adverse.Network.Connected', (c) => {
		clientObj.adverseClient = new SocketWrapper(c);
	});
    checkClient('adverseClient').then(() => {
        subAdverseWSEvent(clientId);
        console.log('adverseClient连接成功')
    });

    //  跑道模式  跑道模式和禁用状态
    worker.subscribe('Situation.Network.Connected', (c) => {
        clientObj.SituationClient = new SocketWrapper(c);
    });
    checkClient('SituationClient').then(() => {
        subWSEventSituation();
        console.log('SituationClient连接成功')
    });
    worker.subscribe('Get.runway.Data', (() => {
            let runwayData = memoryStore.getItem('Pools').runwayModels
            worker.publish('Web', 'push.runway.Data', runwayData)
            worker.publish('push.runway.Data', runwayData)
        })
    )


    // 主动获取消息
    worker.subscribe('Get.message.Data', () => {
        let data = memoryStore.getItem('global').messageClientData
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


};
