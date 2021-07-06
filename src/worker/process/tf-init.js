import {each, find, get} from "lodash";
import socket from '../lib/socket'
import {init as flightInit} from '../channel/flight'
import {init as homeInit, delaysInit} from '../channel/home'
// import { init as delaysInit } from '../connect/delays'
import {init as monitorInit} from '../channel/runMonitor'
import {init as resourceMonitorInit} from '../channel/resourceMonitor'
import {init as MonitorWithRunwayInit} from '../channel/poolMonitorWithRunway'
import {init as TOBTConfigInit} from '../channel/TOBTConfig'
import { init as alternateConfigInit } from '../channel/alternate'
import { init as decreaseInit } from '../channel/decrease'

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
        //
   channel: 'Worker',
  topic: 'init',
  callback: (data) => {
    //
    let posWorker = myPostal('Worker');
    let mySockets = socket(data.servers);
    let httpRequest = new HttpRequest(data.httpConfig);
    flightInit(posWorker, httpRequest);
    monitorInit(posWorker, httpRequest);
    MonitorWithRunwayInit(posWorker, httpRequest);
    resourceMonitorInit(posWorker, httpRequest);
    flightHttp(posWorker, httpRequest);
    homeInit(posWorker, httpRequest)
    decreaseInit(posWorker, httpRequest)
    delaysInit(posWorker, httpRequest)
    getSysConfigHttp(posWorker, httpRequest);
    TOBTConfigInit(posWorker, httpRequest)
    memoryStore.setItem('global', {token: data.token});
    postal.subscribe({
      channel: 'Worker',
      topic: 'LoginSuccess',
      callback: (user) => {
        //登录成功
        // 根据权限过滤航班
        let roleData = find(user.roles, (item) => item.code.indexOf('DATA') > -1);
        let roleFlights = get(roleData, 'menus.0.path');
        roleFlights = roleFlights ? JSON.parse(roleFlights)[0] : {reversal: true, data: []};
         let posWorker = myPostal('Worker');
        let mySockets = socket(data.servers);
        let httpRequest = new HttpRequest(data.httpConfig);
        flightInit(posWorker, httpRequest);
        monitorInit(posWorker, httpRequest);
        MonitorWithRunwayInit(posWorker, httpRequest);
        resourceMonitorInit(posWorker, httpRequest);
        alternateConfigInit(posWorker, httpRequest);
        flightHttp(posWorker, httpRequest);
        homeInit(posWorker, httpRequest)
        delaysInit(posWorker, httpRequest)
        getSysConfigHttp(posWorker, httpRequest);
        TOBTConfigInit(posWorker, httpRequest)
        memoryStore.setItem('global', {token: data.token});
        postal.subscribe({
            channel: 'Worker',
            topic: 'LoginSuccess',
            callback: (user) => {
                //登录成功
                // 根据权限过滤航班
                let roleData = find(user.roles, (item) => item.code.indexOf('DATA') > -1);
                let roleFlights = get(roleData, 'menus.0.path');
                roleFlights = roleFlights ? JSON.parse(roleFlights)[0] : {reversal: true, data: []};
                let posWorker = myPostal('Worker');
                // let mySockets = socket(data.servers);
                memoryStore.setItem('global', {
                    token: user.token,
                    roleFlights,
                    now: user.now
                });
            }
        })
    }
})
