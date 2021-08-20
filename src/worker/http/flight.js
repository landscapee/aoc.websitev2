import {flightDB, processFlight, saveToFlightDB} from "../lib/storage";
import {memoryStore} from "../lib/memoryStore";
import { isString, get} from 'lodash';
import {saveToFlightHisDB} from "@/worker/lib/storageHis";
export const flightHttp = (worker,httpRequest) => {
  const getTodayFLight = () => {
    httpRequest.get('flight', 'getWebSocketResponseData').then(response => {
      saveToFlightDB(isString(response.responseData)?JSON.parse(response.responseData):response.responseData).then(() => {
        memoryStore.setItem('global', { websocketDataFinish: true });
        worker.publish('','Flight.Change.Sync',response)
      });
    }).catch()
  }

  const getColumns = () => {
    let user = memoryStore.getItem('global').user;
    let userId = get(user, 'id', '');
    httpRequest.get('flight', `getDynamicConfig?userId=${userId}`).then(response => {
      let data = response.data;
      if (JSON.stringify(data) !== '[]') {
        let c = JSON.parse(data[0].config);
        worker.publish('Worker', 'Flight.GetHeader.Res', c.options)
        worker.publish('Web', 'Flight.GetHeader.Res', c.options)
      }
    }).catch()
  }

  getTodayFLight();
  getColumns()

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
    httpRequest.post('flight','Flight/search/history/new', options).then(data=>{
      data = data.data
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

  worker.subscribe('Flight.GetOthers', (options) => {
    httpRequest.get('flight', `Flight/adjust/history/${options}`).then(res => {
      let response = res.data
      if (response.length > 0) {
        saveToFlightHisDB(response).then(() => {
          worker.publish('Worker', 'Flight.Change.Sync');
        });
      }
    });
  })

  worker.subscribe('Flight.UpdateColumn', (options) => {
    let user = memoryStore.getItem('global').user;
    let userId = user ? user.id : ''
    httpRequest.post('flight', `saveDynamicConfig?userId=${userId}`, {options: options}).then(res => {
      //
    });
  })

}
