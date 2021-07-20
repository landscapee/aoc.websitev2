import {displayTimeDate} from '@/lib/helper/utility.js'
import {map} from 'lodash'
import iconSvg from '../../../../../components/icon-svg'
import moment from 'moment'

 export const alternateLanding = [
    {
        type: 'index',
        label: '序号',
       
    },
    {
        key: 'flightNo',
        label: '航班号',
       
    },
    {
        key: 'aircraftNo',
        label: '机号',
       
    },
    {
        key: 'preAtdDisplay',
        label: '前站实际离港',width:'110px',
    },
    {
        key: 'displayATA',
        label: '实际到达',
    },
    {
        key: 'city',
        label: '备降城市',
    },
    {
        key: 'concern',
        label: '关注',
    },
]
export const cancelOpen = [
    {
        type: 'index',
        label: '序号',
    },
    {
        key: 'flightNo',
        label: '航班号',
       
    },
    {
        key: 'movement',
        label: '进离港',
       
    },
    {
        key: 'routingDisplay',
        label: '航线',
        display:({row})=>{
            return `${row.routing[0]}-${row.routing[1]}`
        },
        width: '160px',
    },
    {
        key: 'hallwayCn',
        label: '城市方向',
       
    },
    {
        key: 'directionCountPercent',
        label: '方向占比',
        display:({row})=>{
            return row.directionCount?`${row.directionCount}/${row.directionAllCount1}`:'--'
        },
    },
]
