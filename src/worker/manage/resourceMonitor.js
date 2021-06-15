import {forEach, map} from 'lodash';
import {flightDB} from "@/worker/lib/storage";

export const resourceSituationData = (worker, data) => {
    worker.publish('Web', 'resourceSituationData', data)
}
export const resourceStart = (posWorker) => {
    posWorker.subscribe('Resource.Change.Sync', (data) => {
    })
}

export const resourceStop = (posWorker) => {
    posWorker.unsubscribe('Resource.Change.Sync')
}


