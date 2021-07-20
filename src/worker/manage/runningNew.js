import {displayTimeHour} from '../../lib/helper/utility'
import {get, map,sortBy,drop} from 'lodash'

export const getRunwayWeather = (cache) => {
    let formatField = (data, namePrefix) => {
        let xData = map(get(data, 'times', []), (item) => displayTimeHour(item));
        let keys = Object.keys(get(data, 'values.0', {}));
        let yData = map(keys, (item) => {
            return {name: (namePrefix || '') + item, data: map(data.values, (current) => current[item])};
        });
        return [ xData, yData];
    };
     let {rvr, vv, temp, td} = cache;
    rvr = formatField(rvr);
    vv = formatField(vv);
    temp = formatField(temp, '温度');
    td = formatField(td, '露点温度');
    temp=[temp[0],[...td[1],...temp[1]]]
    return {rvr, vv, temp, td};
 };
export const getIndicator = (indicator) => {
    let hourReduce = map(indicator.hour, (item) => item - 1);
    let xDataReduce = map(hourReduce, (item) => (item < 10 ? `0${item}:00` : `${item}:00`));
    let xData = map(indicator.hour, (item, index) => (item < 10 ? `${xDataReduce[index]}-0${item}:00` : `${xDataReduce[index]}-${item}:00`));
    let {flightIndicator, passengerIndicator, spaceIndicator} = indicator;
    flightIndicator = flightIndicator.delay
    spaceIndicator = spaceIndicator.average
    let yData = (data, name) => {
        return {name: name, data: data}
    }
    return {
        flightIndicator:[xData,yData(flightIndicator,'航班指标')],
        spaceIndicator:[xData,yData(spaceIndicator,'本场起降间隔指标')],
        passengerIndicator:[xData,yData(passengerIndicator,'出港旅客数量指标')],
    };
};
export const getDelayBoard = (mydata) => {
   return map(mydata, (data, index) => {
        let boardingUsedPer = ((data.boardingUsed * 100) / data.departurePlan).toFixed(0);
        let boardingUsedPerVo = `${boardingUsedPer}% 【${data.boardingUsed}/${data.departurePlan}】`;
        let unboardingUsedPer = ((data.unboardingUsed * 100) / data.departurePlan).toFixed(0);
        let unboardingUsedPerVo = `${unboardingUsedPer}% 【${data.unboardingUsed}/${data.departurePlan}】`;
        return {
            backFlight: data.backFlight,
            executableFlight: data.executableFlight,
            boardingTotal: data.departurePlan,
            boardingUsed: data.boardingUsed,
            boardingUsedPer: boardingUsedPer,
            boardingUsedPerVo: data.boardingUsed||'0',
            closeDoorPer: ((data.closeDoorM * 100) / data.departurePlan).toFixed(0),
            closeDoorPerVo: data.closeDoorM || data.closedDoors || '0',
            closeDoorTotal: data.departurePlan,
            closeDoorUsed: data.closedDoors,
            departureActual: data.departureActual||'0',
            departurePlan: data.departurePlan||'0',
            estimateFloat: data.estimateFloat||'0',
            estimateFloatM: data.estimateFloatM,
            'unboardingUsed-unArrived': data.unboardingUsed + '/' + data.stopShortOfFlight,
            'backFlight-executableFlight': data.backFlight + '/' + data.executableFlight,
            //id: 'a3b7e0cacf0f4603b5013aa33401f8a0',
            num: index,
            // passager: 8492,
            passenger: data.passenger||'0',
            someTime: data.dateTime,
            unboardingUsed: data.unboardingUsed,
            unboardingUsedPer: unboardingUsedPer,
            unboardingUsedPerVo: unboardingUsedPerVo,
            widespreadDelayId: data.delayedId,
            abrogateFlight: data.abrogateFlight,
        };
    });
};
export const trafficCapacity = (data) => {
    let trafficCapacity = sortBy(data, (item) => parseInt(item.hour));
    let xAxis= drop(map(trafficCapacity, (item) => item.hour), 1)
    let series=[{ name: '已延误航班统计', data: map(trafficCapacity, (item) => item.capacity) }]
    return {xAxis,series}
};
export const runNewStart = (posWorker) => {
    posWorker.subscribe('RunNewStart.Change.Sync', (data) => {
    })
}

export const runNewStop = (posWorker) => {
    posWorker.unsubscribe('RunNewStart.Change.Sync')
}


