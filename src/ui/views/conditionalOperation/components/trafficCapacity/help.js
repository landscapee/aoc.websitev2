import {displayTimeDate} from '@/lib/helper/utility.js'
import {map} from 'lodash'
 

// 动态时段
export const timeRangeConfig = [
    {
        key: 'someTime',
        label: '动态时段',
    },
    {
        key: 'closeDoorPerVo',
        label: '关舱门', width: '60px'

    },
    {
        key: 'boardingUsedPerVo',
        label: '登机', width: '50px'
    },
    {
        key: 'unboardingUsed-unArrived',
        label: '未登机/未到达', width: '110px'
    },
    {
        key: 'abrogateFlight',
        label: '取消', width: '50px'
    },
    {
        key: 'estimateFloat',
        label: '预计流量',
    },
    {
        key: 'departurePlan',
        label: '计划起飞',
    },
    {
        key: 'departureActual',
        label: '本小时实际起飞', width: '110px'
    },
    {
        key: 'backFlight-executableFlight',
        label: '航班积压量/可执行',
        width: '120px'
    },
    {
        key: 'passenger',
        label: '候机楼等候人数', width: '110px'
    },
]
