import {each, find, get} from "lodash";
import socket from '../lib/socket'
import {init as flightInit} from '../channel/flight'
import {init as flightAdjustmentInit} from '../channel/flightAdjustment'
import {init as homeInit, delaysInit} from '../channel/home'
// import { init as delaysInit } from '../connect/delays'
import {init as monitorInit} from '../channel/runMonitor'
import {init as resourceMonitorInit} from '../channel/resourceMonitor'
import {init as MonitorWithRunwayInit} from '../channel/poolMonitorWithRunway'
import {init as TOBTConfigInit} from '../channel/TOBTConfig'
import { init as alternateConfigInit } from '../channel/conditionalOperation/alternate'
import { init as decreaseInit } from '../channel/decrease'
import { init as runningNew } from '../channel/conditionalOperation/runningNew'
import { init as publicChanelInit } from '../channel/publicChanel'
import { init as adjustmentReductionInit } from '../channel/adjustmentReduction'
import { init as deiceInit } from '../channel/conditionalOperation/deice'
import { init as conditionalOperationInit } from '../channel/conditionalOperation/commonChanel'
import { init as delayNewInit } from '../channel/conditionalOperation/delayNew'

import postal from 'postal';
import {memoryStore} from "../lib/memoryStore";
import HttpRequest from "../../lib/axios";
import {flightHttp} from "../http/flight";
import {getSysConfigHttp} from "../http/getSysConfig";

const channels = {
    Worker: postal.channel('Worker'),
    Web: postal.channel('Web'),
};

const registeredTopic = {
    Worker: {},
    Web: {},
};

const myPostal = (channel) => {
    return {
        subscribe: (topic, func) => {
            let signal = channels[channel].subscribe(topic, func);
            registeredTopic[channel][topic] = signal;
        },
        publish: (channel_, topic, data) => {
            if (channel_ === '*') {
                each(channels, (c) => {
                    c.publish(topic, data);
                });
            } else {
                if (channels[channel_]) {
                    channels[channel_].publish(topic, data);
                } else {
                    channels[channel].publish(channel_, topic);
                }
            }
            //postal.publish(channel, topic, data);
        },
        unsubscribe: (topic) => {
            let signal = registeredTopic[channel][topic];
            signal && signal.unsubscribe();
        },
    };
};

postal.subscribe({
    channel: 'Worker',
    topic: 'init',
    callback: (data) => {
        setGlobal({
            now: data.now,
            clientId: data.clientId,
            token:data.user.token
        }, data.user)

        let posWorker = myPostal('Worker');
        let mySockets = socket(data.servers);
        let httpRequest = new HttpRequest(data.httpConfig);
        flightInit(posWorker, httpRequest);
        flightAdjustmentInit(posWorker, httpRequest);
        monitorInit(posWorker, httpRequest);
        MonitorWithRunwayInit(posWorker, httpRequest);
        alternateConfigInit(posWorker, httpRequest);
        runningNew(posWorker, httpRequest);
        resourceMonitorInit(posWorker, httpRequest);
        adjustmentReductionInit(posWorker, httpRequest)

        flightHttp(posWorker, httpRequest);
        homeInit(posWorker, httpRequest)
        decreaseInit(posWorker, httpRequest)
        delaysInit(posWorker, httpRequest)
        getSysConfigHttp(posWorker, httpRequest);
        TOBTConfigInit(posWorker, httpRequest)
        publicChanelInit(posWorker, httpRequest,data.clientId)
        deiceInit(posWorker, httpRequest)
        conditionalOperationInit(posWorker, httpRequest)
         delayNewInit(posWorker, httpRequest)



        postal.subscribe({
            channel: 'Worker',
            topic: 'LoginSuccess',
            callback: (user) => {
                //登录成功token,服务器时间
                setGlobal({
                    token: user.token,
                    now: user.now
                },user)
            }
        })
         
    }
})


const setGlobal = (global, user) => {
    

    memoryStore.setItem('global', global);
    if (user) {// 根据权限过滤航班
        let roleData = find(user.roles, (item) => item.code.indexOf('DATA') > -1);
        let roleFlights = get(roleData, 'menus.0.path');
        roleFlights = roleFlights ? JSON.parse(roleFlights)[0] : { reversal: true, data: [] };
        memoryStore.setItem('global', {roleFlights},false);
    }
    
}
