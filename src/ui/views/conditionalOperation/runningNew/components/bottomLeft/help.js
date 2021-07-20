import {displayTimeDate} from '@/lib/helper/utility.js'
import {map} from 'lodash'
import iconSvg from '../../../../../components/icon-svg'
import moment from 'moment'

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
export const runwayStandardConfig = [
    {
        key: 'areaCode',
        label: '跑道',width:'50px',
        displayHeader: ({row}) => (
            `<div>
            <span>跑道</span>
         </div>`)
    },
    {
        key: 'rvr10a',

        displayHeader: ({row}) => (
            `<div>
            <span>RVR</span>
            <span class="textSecondary">m</span>
        </div>`
        ),
    },
    {
        key: 'vv',
        displayHeader: ({row}) => (
            ` <div>
            <span> 垂直能见度 </span>
            <span class = "textSecondary" > m </span>
        </div>`
        ),
        display:({row})=>{
            return row.vv||'0'
        }
    },
    {
        key: 'windF10',
        displayHeader: ({row}) => (
            ` <div>
        <span> 风速 </span>
        <span
    class = "textSecondary" > mps </span>
        </div>`
        ),
    }
    ,
    {
        key: 'windD10',
        label: '风向',
        displayHeader: ({row}) => (
            `<div>
            <span>风向</span>
         </div>`)
    }
    ,
    {
        key: 'temp',
        displayHeader:
            ({row}) => (
                ` <div>
        <span> 温度 </span>
        <span
    class = "textSecondary" >℃
    </span>
    </div>`
            ),
    }
    ,
    {
        key: 'td',
        displayHeader:
            ({row}) => (
                ` <div>
        <span> 露点温度 </span>
        <span
    class = "textSecondary" >℃</span>
    </div>`
            ),
    }
    ,
    {
        key: 'humid',
        label: '湿度',width:'50px',
        displayHeader: ({row}) => (
            `<div>
            <span>湿度</span>
         </div>`)
    }
    ,
    {
        slot: 'departureStandard',width:'130px',

    }
    ,
    {
        slot: 'arriveStandard',width:'130px',

    },
]
