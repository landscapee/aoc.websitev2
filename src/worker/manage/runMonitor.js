import {getFlightDetail} from "../lib/storage";

export const getFlightDatas = (data) => {
    let arr=[];
    data.map&&data.map((k,l)=>{
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
