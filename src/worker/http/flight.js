import {flightDB, saveToFlightDB} from "../lib/storage";
import {memoryStore} from "../lib/memoryStore";

export const flightHttp = (worker,httpRequest) => {
  const getTodayFLight = () => {
    httpRequest.get('flight', 'getWebSocketResponseData').then(response => {
      saveToFlightDB(JSON.parse(response.responseData)).then(() => {
        memoryStore.setItem('global', { websocketDataFinish: true });
        worker.publish('','Flight.Change.Sync',response)
      });
    }).catch()
  }

  getTodayFLight()

  worker.subscribe('Test',()=>{
    httpRequest.get('situation','runningState/delayCode').then(res=>{
      worker.publish('Web','Test',res.data)
    });
  })

}
