/*
* 检查client是否在线
* */
export const checkClient = (c) => {
  console.log('进入检查client')
  return new Promise((resolve) => {
    setInterval(() => {
      if (c) {
        resolve();
      }
    }, 50);
  });
};


export const socketWrapprer = (clientList,client,topic, cb) => {
  clientList.add(topic);
  client.sub(topic, (data) => {
    cb && cb(data)
  });
};
