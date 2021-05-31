import {getFlightDetail} from "../lib/storage";
import { map} from 'lodash';

export const getFlightDatas = (data) => {
    let arr=[];
    map(data,(k,l)=>{
        if(getFlightDetail(k.flightId)){
            arr.push(getFlightDetail(k.flightId))
        }
    })
    return arr
}
export const situationStart = (posWorker) => {
   posWorker.subscribe('Situation.Change.Sync',(data)=>{

  })
}

export const situationStop = (posWorker) => {
  posWorker.unsubscribe('Situation.Change.Sync')
 }
