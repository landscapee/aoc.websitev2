import {displayTimeDate} from '@/lib/helper/utility.js'
import {map} from 'lodash'
import moment from 'moment'
// 待除冰
let tranTime=(time)=>{
    return time?moment(time).format('HH:mm'):'--'
}
export const needDeiceConfig = [
    {
        type: 'index',
        label: '序号',width:'55px',
    },
    {
        key: 'flightNo',
        label: '航班号',
    },
    {
        key: 'displayScheduleTime',
        label: '计划出港',
        display:({row})=>{
            return tranTime(row.scheduleTime)
        }
    },
    {
        key: 'displayEstimateStartTime',
        label: '预计开始除冰',
        display:({row})=>{
            return tranTime(row.estimateStartTime)
        }
    },
    {
        key: 'displayEstimateEndTime',
        label: '预计完成除冰',
        display:({row})=>{
            return tranTime(row.estimateEndTime)
        }
    },
];
// 正在除冰

export const deiceConfig = [
    {
        type: 'index',
        label: '序号',width:'55px',
    },
    {
        key: 'flightNo',
        label: '航班号',
    },
    {
        key: 'displayScheduleTime',
        label: '计划出港',
        display:({row})=>{
            return tranTime(row.scheduleTime)
        }
    },
    {
        key: 'displayActualStartTime',
        label: '实际开始除冰',
        display:({row})=>{
            return tranTime(row.actualStartTime)
        }
    },
    {
        key: 'seat',
        label: '机位',
    },
];
// 已完成除冰

export const finishConfig = [
    {
        type: 'index',
        label: '序号',width:'55px',
    },
    {
        key: 'flightNo',
        label: '航班号',
    },
    {
        key: 'displayScheduleTime',
        label: '计划出港',
        display:({row})=>{
            return tranTime(row.scheduleTime)
        }
    },
    {
        key: 'displayActualEndTime',
        label: '实际结束除冰',
        display:({row})=>{
            return tranTime(row.actualEndTime)
        }
    },
    {
        key: 'seat',
        label: '机位',
    },
];
