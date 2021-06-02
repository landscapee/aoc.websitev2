 import { map} from 'lodash';


export const situationStart = (posWorker) => {
    posWorker.subscribe('Situation.Change.Sync',(data)=>{

    })
}

export const situationStop = (posWorker) => {
    posWorker.unsubscribe('Situation.Change.Sync')
}
