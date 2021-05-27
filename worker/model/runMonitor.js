
export const situationStart = (posWorker) => {
   posWorker.subscribe('Flight.Change.Sync',(data)=>{

  })
}

export const situationStop = (posWorker) => {
  posWorker.unsubscribe('Flight.Change.Sync')
 }
