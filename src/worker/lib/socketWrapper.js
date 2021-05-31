import {each, forEach} from 'lodash';

export default class SocketWrapper {
  constructor(client) {
    this.client = client;
    this.topicArray = new Set();
  }

  /*
  * @retain 是否在页面销毁的时候保留连接
  * */
  sub(topic,callback,retain){
    !retain && this.topicArray.add(topic)
    this.client.sub(topic,callback)
  }

  unSubAll(){
    this.topicArray.forEach(item=>{
      this.client.unSub(item)
    })

  }
}
