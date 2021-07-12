import {flightDB, saveToFlightDB} from "../lib/storage";
import {memoryStore} from "../lib/memoryStore";

export const flightHttp = (worker,httpRequest) => {
  const getTodayFLight = () => {
    httpRequest.get('flight', 'getWebSocketResponseData').then(response => {
      saveToFlightDB(JSON.parse(response.responseData)).then(() => {
        memoryStore.setItem('global', { websocketDataFinish: true });
        worker.publish('Worker','Flight.Change.Sync',response)
      });
    }).catch()
  }

  getTodayFLight()

  worker.subscribe('Test',()=>{
    httpRequest.get('situation','runningState/delayCode').then(res=>{
      worker.publish('Web','Test',res.data)
    });
  })

  worker.subscribe('Flight.GetMore',(options)=>{
    httpRequest.post('flight','Flight/Screening', options, true).then(res=>{
      saveToFlightDB(JSON.parse(res.responseData)).then(() => {
        worker.publish('Worker','Flight.Change.Sync','')
      })
    });
  })

}
