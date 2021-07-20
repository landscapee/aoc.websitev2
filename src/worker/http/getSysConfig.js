
import {memoryStore} from "../lib/memoryStore";

export const getSysConfigHttp = (worker,httpRequest) => {
    worker.subscribe('Delay.GetCity', () => {
        let cityData = memoryStore.getItem('cityData');
        if (JSON.stringify(cityData)=="{}") {
            httpRequest.get('delays', 'Flight/FlightSchedule/allAirport').then(res => {
                if (res.data) {
                    let data = JSON.parse(res.data)
                    memoryStore.setItem('cityData', data);
                    worker.publish('Web', `Delay.GetCity`, data);
                }
                
            });
        } else {
            worker.publish('Web', `Delay.GetCity20`, cityData);
        }
    })

    worker.subscribe('Delay.GetCity20', () => {
        let cityData20 = memoryStore.getItem('cityData20');
        if (JSON.stringify(cityData20)=="{}") {
            httpRequest.get('delays', 'Flight/FlightSchedule/rankAirport').then(res => {
                if (res.data) {
                    let data = JSON.parse(res.data)
                    memoryStore.setItem('cityData20', data);
                    worker.publish('Web', `Delay.GetCity20`, data);
                }
                
            });
        } else {
            worker.publish('Web', `Delay.GetCity20`, cityData20);
        }
  })
}