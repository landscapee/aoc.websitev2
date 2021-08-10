
import {flightDB, saveToFlightDB} from "../lib/storage";
import {memoryStore} from "../lib/memoryStore";

export const decreaseHttp = (worker, httpRequest) => {
    worker.subscribe('Flight.GetCoordinateArg', () => {
        // let coordinateArg = memoryStore.getItem('coordinateArg');
        // if (JSON.stringify(coordinateArg)=="{}") {
            httpRequest.get('flight', 'dynamicAdjust/coordinateArg/list').then(res => {
                if (res.data) {
                    memoryStore.setItem('coordinateArg', res.data);
                    worker.publish('Web', 'Flight.GetCoordinateArg.Response', res.data);
                }
            });
        // } else {
        //     console.log(11111111)
        //     worker.publish('Web', `Flight.GetCoordinateArg.Response`, coordinateArg);
        // }
    })


    worker.subscribe('Decrease.GetCurrentReduce', (data) => {
        
        memoryStore.setItem('AdverseCondition', { currentDelayType: data });

        httpRequest.get('adverse', 'adjust/getCurrentReduce?type=' + data).then(res => {
            if (res.data) {
                memoryStore.setItem('AdverseCondition', { reduceData: res.data });
                worker.publish('Web', 'AdverseCondition.Decrease.SetReduce', res.data);
                worker.publish('Worker', 'FlightsByHours.Decrease.SetReduce', res.data);
            }
        });
    })




}