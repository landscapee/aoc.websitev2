import {saveToFlightDB} from "../lib/storage";
import {memoryStore} from "../lib/memoryStore";

export const flightHttp = (worker,httpRequest) => {
  const getTodayFLight = () => {
    httpRequest.get('flight', 'getWebSocketResponseData').then(response => {
      saveToFlightDB(response).then(() => {
        memoryStore.setItem('global', { websocketDataFinish: true });
        worker.publish('Worker','Flight.Change.Sync',response)
      });
    })
  }

  getTodayFLight()

  worker.subscribe('Test',()=>{
    httpRequest.get('situation','runningState/delayCode').then(res=>{
      worker.publish('Web','Test',res)
    });
  })

}
