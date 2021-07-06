import { flow, get, isArray, map } from 'lodash';
import { filedConvert } from '../flightAllFields';
let DISPLAYNULL = '--';
const proFlightField = (flights) => {
	return map(flights, (f) => {
		let flight = { ...f };
		map(filedConvert, (column, key) => {
			let value = column.convert ? column.convert(f) : get(f, key, DISPLAYNULL);
			value = value === '' ? DISPLAYNULL : value;
			flight[key] = value;
			// if (column.referenceTo) {
			// 	if (isArray(column.referenceTo)) {
			// 		map(column.referenceTo, (key) => {
			// 			flight[key] = get(f, key);
			// 		});
			// 	} else {
			// 		flight[column.referenceTo] = get(f, column.referenceTo);
			// 	}
			// }
		});
		return flight;
	});
};

export const proFlightFields = (flights) => {
	return flow([proFlightField])(flights);
};
