import {each} from "lodash";
import socket from '../lib/socket'
import {init as flightInit} from '../channel/flight'
import { init as homeInit,delaysInit} from '../channel/home'
// import { init as delaysInit } from '../connect/delays'
import {init as monitorInit} from '../channel/runMonitor'
import {init as MonitorWithRunwayInit} from '../channel/poolMonitorWithRunway'
import postal from 'postal';
import {memoryStore} from "../lib/memoryStore";
import HttpRequest from "../../lib/axios";
import {flightHttp} from "../http/flight";

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

    let posWorker = myPostal('Worker');
    let mySockets = socket(data.servers);
    let httpRequest = new HttpRequest(data.httpConfig);
    flightInit(posWorker, httpRequest);
    monitorInit(posWorker, httpRequest);
      MonitorWithRunwayInit(posWorker, httpRequest);
    flightHttp(posWorker, httpRequest);
    homeInit(posWorker, httpRequest)
    delaysInit(posWorker, httpRequest)
    memoryStore.setItem('global',{token:data.token});
    postal.subscribe({
      channel: 'Worker',
      topic: 'LoginSuccess',
      callback: (data)=>{
        memoryStore.setItem('global',{token: data.token});
      }
    })
  }
});
