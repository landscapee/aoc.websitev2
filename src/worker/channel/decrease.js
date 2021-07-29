import { flow,mapValues} from 'lodash';
import { flightDB } from '../lib/storage';
import { proFlightFields } from '@/lib/helper/proFlightFields';
import { checkWebsocketResponseDataFinish, getFlightByIds, filterRoleFlights, addSerialNumber } from '@/lib/helper/flight';
import { decreaseHttp } from '../http/decrease';

let worker;

let getReduceFlights = (reduceFlight) => {
	checkWebsocketResponseDataFinish().then(() => {
    let flightsWithAirline = mapValues(reduceFlight, (item) => flow([addSerialNumber])(getFlightByIds(item)));
		worker.publish('Web', 'Decrease.GetReduceFlights.Response', flightsWithAirline);
	});
};


let getFlight = (query) => {

    checkWebsocketResponseDataFinish().then(() => {
        let flights = flightDB.find({ $and: query });
        flights = flow([filterRoleFlights])(flights);
        worker.publish('Web','AdverseCondition.GetFlight.Response',flights)
	});
};
export const init = (worker_,httpRequest) => {
    worker = worker_;

    worker.subscribe(`AdverseCondition.GetFlight`, getFlight);
    worker.subscribe(`Decrease.GetReduceFlights`, getReduceFlights);
    
    decreaseHttp(worker,httpRequest);
};