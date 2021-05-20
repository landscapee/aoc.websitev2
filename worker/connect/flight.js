
let worker,client;

export const checkClient = () => {
  return new Promise((resolve) => {
    setInterval(() => {
      if (client) {
        resolve();
      }
    }, 50);
  });
};
const subWSEvent = () => {
  client.sub('/Flight/Change',(data)=>{
    console.log(data)
  })
};
export const init = (worker_) => {
  worker = worker_;
  worker.subscribe('Flight.Network.Connected', (c) => {
    client = c;
  });
  worker.subscribe('Page.Flight.Start',()=>{
    checkClient().then(()=>{
      subWSEvent();
      console.log('flight连接成功')
    })
  });

  worker.subscribe('Page.Flight.Stop',()=>{
    client && client.unSub('/Flight/Change')
  })
};
