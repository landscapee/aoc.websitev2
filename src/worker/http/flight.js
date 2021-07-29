import {flightDB, processFlight, saveToFlightDB} from "../lib/storage";
import {memoryStore} from "../lib/memoryStore";
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

  worker.subscribe('Flight.GetHistory',(options)=>{
    httpRequest.post('flight','Flight/search/history', options, true).then(data=>{
      console.log(data)
      data = JSON.parse(data.data)
      let result = {
        movementA: data.movementTotalA || 0,
        movementD: data.movementTotalD || 0,
        total: data.total,
        return: data.return || 0,
        alternate: data.alternate || 0,
        cancel: data.cancel || 0,
        flights: processFlight(data.dataList),
        concern: data.concern || 0,
        isAlternateLandingFlight: data.alternateLanding || 0,
        isPassagerFlight: data.passenger || 0,
        originated: data.original || 0,
      };
      worker.publish('Worker', 'Flight.GetHistory.Response', result);
    });
  })

}
