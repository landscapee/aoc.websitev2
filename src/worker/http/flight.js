import {flightDB, saveToFlightDB} from "../lib/storage";
import { memoryStore } from "../lib/memoryStore";
import { isString} from 'lodash';

export const flightHttp = (worker,httpRequest) => {
  const getTodayFLight = () => {
    httpRequest.get('flight', 'getWebSocketResponseData').then(response => {
      saveToFlightDB(isString(response.responseData)?JSON.parse(response.responseData):response.responseData).then(() => {
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

  worker.subscribe('Flight.GetMore',(options)=>{
    httpRequest.post('flight','Flight/Screening', options, true).then(res=>{
      saveToFlightDB(isString(res.responseData)?JSON.parse(res.responseData):res.responseData).then(() => {
        worker.publish('Worker','Flight.Change.Sync','')
      })
    });
  })

}
