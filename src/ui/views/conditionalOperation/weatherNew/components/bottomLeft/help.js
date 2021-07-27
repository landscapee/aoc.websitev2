import {displayTimeDate} from '@/lib/helper/utility.js'
import {map} from 'lodash'



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
