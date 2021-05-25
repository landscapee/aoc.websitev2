import {map, each, times, extend, random} from 'lodash';
import uuid from 'uuid/v4';

let flight = {
        flightId:'10622109',
        STASTD:'11:45(45)',
        c:'2',
        d:'2',
        e:'2',
        f:'2',
        g:'2',
        h:'2',
        // flightNO:'xxxxxxxxxx-xxxxxxxxxxxxx-xxxxxxxxxxxx',
        flightNO:'CA4463',
        j:'2',
        k:'2',
        l:'2',
        m:'2',
        n:'2',
        o:'2',
};

let flightTypes = ['A','B','C','D','E'];


export const getTempData = () => {
    let count = 200;  
    
    return times(count, i => {
        return extend({}, extend({},flight, {
            id: uuid(), 
            count: i,
            c: flightTypes[random(0,4)]
        }));
    });
}

