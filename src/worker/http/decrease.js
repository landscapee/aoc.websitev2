
import {flightDB, saveToFlightDB} from "../lib/storage";
import {memoryStore} from "../lib/memoryStore";

export const decreaseHttp = (worker, httpRequest) => {
    worker.subscribe('Flight.GetCoordinateArg', () => {
        let coordinateArg = memoryStore.getItem('coordinateArg');
        if (JSON.stringify(coordinateArg)=="{}") {
            httpRequest.get('flight', 'dynamicAdjust/coordinateArg/list').then(res => {
                if (res.data) {
                    let data = JSON.parse(res.data)
                    memoryStore.setItem('coordinateArg', data);
                    worker.publish('Web', 'Flight.GetCoordinateArg.Response', data);
                }
            });
        } else {
            console.log(11111111)
            worker.publish('Web', `Flight.GetCoordinateArg.Response`, coordinateArg);
        }
    })

}