import { flow,mapValues,map} from 'lodash';
import { flightDB } from '../lib/storage';
import { proFlightFields } from '@/lib/helper/proFlightFields';
import { checkWebsocketResponseDataFinish, getFlightByIds, filterRoleFlights, addSerialNumber,filterFlightsByRole } from '@/lib/helper/flight';

let worker;



let rolePath = {};
let Options = {};

export const setFilterOption = (data) => {
	rolePath = data.rolePath;
	Options = data ? data : {};
	queryFlight();
	//return refreshFlights(true);
};
const getStatistics = (flights) => {
	let result = {
		total: flights.length,
		movementA: 0,
		movementD: 0,
		return: 0,
		alternate: 0,
		cancel: 0,
		concern: 0,
		isAlternateLandingFlight: 0,
		isPassagerFlight: 0,
		originated: 0,
		isExecutableFlight: 0,
	};
	map(flights, (f) => {
		// if (f.return) result.return += 1;
		// if (f.alternate) result.alternate += 1;
		// if (f.cancel) result.cancel += 1;
		// if (f.concern) result.concern += 1;
		// if (f.isAlternateLandingFlight) result.isAlternateLandingFlight += 1;
		// if (f.isPassagerFlight) result.isPassagerFlight += 1;
		// if (f.originated) result.originated += 1;
		// if (f.isExecutableFlight) result.isExecutableFlight += 1;
		if (f.movement === 'A') result.movementA += 1;
		if (f.movement === 'D') result.movementD += 1;
	});
	return result;
};


let queryFlight = () => {
	checkWebsocketResponseDataFinish().then(() => {
		let query = [];
		map(Options.backEndFilter, (item) => {
			if (item[Object.keys(item)[0]] && JSON.stringify(item[Object.keys(item)[0]]) !== '{}') {
				query.push(item);
			}
		});
		// Options.backEndFilter && query.push(...Options.backEndFilter);
		Options.search && query.push({ search: { $regex: Options.search } });
		Options.flightNo && query.push({ flightNo: { $regex: Options.flightNo } });
		// Options.airlineCode && query.push({ airlineCode: Options.airlineCode });
		// console.log('Options:', Options);
		// console.log('query:', query);
		let dbFlight = flightDB.find({ $and: query, cancel: false });
		let flightsNoMovement = filterFlightsByRole(dbFlight, rolePath);
		Options.movement && query.push({ movement: Options.movement });
		let flights = filterFlightsByRole(flightDB.find({ $and: query, cancel: false }), rolePath);
		flights = flow([proFlightFields, addSerialNumber])(flights);
		// proFlightFields(flights);
		let statistics = getStatistics(flightsNoMovement);
		worker.publish('Web', 'AdjustReduction.QueryFlight.Response', { flights, statistics });
	});
};
const getFlights = (data) => {
	checkWebsocketResponseDataFinish().then(() => {
		let flights = getFlightByIds(data)
		worker.publish('Web', 'AdjustReduction.GetFlights.Res', flights);
	});
};

export const init = (worker_) => {
    worker = worker_;
	worker.subscribe(`AdjustReduction.SetFilterOption`, setFilterOption);
	worker.subscribe(`AdjustReduction.GetFlights`, getFlights); // 调整调减的航班列表
	
};