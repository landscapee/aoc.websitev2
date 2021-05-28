
export const start = (posWorker) => {
  posWorker.subscribe('Flight.Change.Sync',(data)=>{

  })
}

export const stop = (posWorker) => {
  posWorker.unsubscribe('Flight.Change.Sync')
}




export const flight_delay_backStatus = (posWorker, data) => {
  posWorker.publish('Web','flight.delay.backStatus',data)
}


