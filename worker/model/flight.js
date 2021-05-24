import {memoryStore} from '../lib/memoryStore';

export const flightStart = (posWorker) => {
  const data = memoryStore.getItem('ExecutableFlights')
  posWorker.subscribe('Flight.Change.Sync',(data)=>{

  })
}

export const flightStop = (posWorker) => {
  posWorker.unsubscribe('Flight.Change.Sync')
  // const data = memoryStore.getItem('ExecutableFlights')
}
