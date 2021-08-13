import {get} from 'lodash';
import moment from 'moment';
export const tranAtaAtd=(row)=>{
    let movement = get(row, 'movement');
    let time= movement === 'D'?row.atd:row.ata
    return time?moment(time).format('HH:mm')+`(${moment(time).format('DD')})`:'--'
}
export const tranStaStd=(row)=>{
    let movement = get(row, 'movement');
    let time= movement === 'D'?row.std:row.sta
    return time?moment(time).format('HH:mm'):'--'
};
export const tranEtaCtot=(row)=>{
    let movement = get(row, 'movement');
    let time= movement === 'D'?row.ctot:row.eta
    return time?moment(time).format('HH:mm'):'--'
}
