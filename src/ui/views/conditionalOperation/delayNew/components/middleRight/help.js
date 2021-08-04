import {displayTimeHour} from "@/lib/helper/utility";
import {memoryStore} from "@/worker/lib/memoryStore";

import moment from "moment";
export const popColumnObj = {
    flightDelay: [
        {
            key: 'flightNo',
            label: '航班号',width:'80px'
        },
        {
            key: 'scheduleTime',
            label: '计划时间',width:'160px',
            display: ({row}) => {
                return moment(row.scheduleTime).format('yyyy-MM-DD HH:mm:ss');
            },
        },
        {
            key: 'dstt',
            label: '放行标准起飞时间',width:'140px',
            display: ({row}) => {
                return displayTimeHour(row.dstt);
            },
        },
        {
            key: 'delayTime',
            label: '延误时长',
            display: ({row}) => {
                let now = memoryStore.getItem('global').now

                if (!row.unNorMalTime) {
                    return '--';
                }
                let diffM = moment(now).diff(row.unNorMalTime, 'minute');
                let day = moment(now).diff(row.unNorMalTime, 'day');
                let h = Math.floor(diffM / 60);
                let m = diffM % 60;
                return `${day ? day + '天' : ''}${h}时${m}分`;
            },
        },
    ],
    actionWaitingkey: [
        {
            key: 'flightNo',
            label: '航班号',
        },
        {
            key: 'scheduleTime',
            label: '计划时间',
        },
        {
            key: 'closeDoorTime',
            label: '关舱等待时长',
            display: ({row}) => {
                let now = memoryStore.getItem('global').now
                return moment(now - row.closeDoorTime).format('m') + '分钟';
            },
        },
    ],
};