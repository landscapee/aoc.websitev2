import {each, has, isFunction, isObject, isString} from "lodash";
import postal from "postal";

export default class PostalStore {
  constructor() {
    this.postalArr = []
  }
  sub(...args){
    let params = null;
    switch (args.length) {
      case 1: //{channel,topic,callback}
        if (isObject(args[0]) && has('channel', args[0]) && has('topic', args[0]) && has('callback', args[0])) {
          params = args[0];
        }
        break;
      case 2: //topic, callback
        if (isString(args[0]) && isFunction(args[1])) {
          params = {
            channel: 'Web',
            topic: args[0],
            callback: args[1],
          };
        }
        break;
      case 3: //channel,topic,callback
        params = {
          channel: args[0],
          topic: args[1],
          callback: args[2],
        };
        break;
    }
    if (params === null) {
      throw new Error(`bad paramters for subscribe`);
    }

    let signal = postal.subscribe(params);
    let postalArr = this.postalArr;
    postalArr.push(signal);
  }

  pub(...args){
    let params = null;
    switch (args.length) {
      case 1: //{channel,topic,callback}
        if (isObject(args[0]) && has('channel', args[0]) && has('topic', args[0]) && has('callback', args[0])) {
          params = args[0];
        }
        break;
      case 2: //topic, callback
        if (isString(args[0]) && isFunction(args[1])) {
          params = {
            channel: 'Worker',
            topic: args[0],
            callback: args[1],
          };
        }
        break;
      case 3: //channel,topic,callback
        params = {
          channel: args[0],
          topic: args[1],
          callback: args[2],
        };
        break;
    }
    if (params === null) {
      throw new Error(`bad paramters for subscribe`);
    }
    postal.publish(params);
  }

  unsubAll(){
    let postalArr = this.postalArr;
    each(postalArr, (topic) => {
      topic.unsubscribe && topic.unsubscribe();
    });
  }
}
