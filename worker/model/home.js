
import postal from 'postal';
export const start = (posWorker) => {
  posWorker.subscribe('Flight.Change.Sync',(data)=>{

  })
}

export const stop = (posWorker) => {
  posWorker.unsubscribe('Flight.Change.Sync')
}




export const initData = (posWorker, data) => {

  

  postal.publish({
    channel: 'Web',
    topic: 'home.init.data',
    data: data,
  });
  // posWorker.pu('Flight.Change.Sync','')
}
