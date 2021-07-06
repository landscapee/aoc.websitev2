import {displayTimeDate} from '@/lib/helper/utility.js'
import {map} from 'lodash'

// 备降航班统计
export const LandingConfig=	 [

    {key: 'flightNo', label: '航班号',width:'50px'},
    {key: 'aircraftNo', label: '机号',width:'50px' },
    {key: 'flightStatus', label: '状态',width:'50px'},
    {key: 'seat', label: '机位',width:'50px'},
    {key: 'ata', label: '落地时间', width:'60px'  },
    {key: 'waitTime', label: '机上等待',
        display: ({row}) => {
             return `${row.waitTime||'--'}(M)`;
        },
    },
    {
        key: 'dropOffTime', label: '下客时间', width:'60px',
        display: ({row}) => {
            return displayTimeDate(row.dropOffTime);
        },
    },
    {
        slot: 'displayRouter', label: '航线', width:'200px',


    },
    {key: 'dropOffNum', label: '下客人数',},
    {
        key: 'securityCheck', label: '使用安检',
        display: ({row}) => {
            return row.securityCheck === 0 ? '是' : row.securityCheck === 1 ? '否' : '--';
        },
    },
    {key: 'isCancel', label: '是否取消',display: ({row}) => {
            return `${row.isCancel?'是':'否'}`;
        },},
    {slot: 'option1', label: '操作', width:'60px'},
];
// 临时机位
export const tempSeatConfig=[

    {
        key: 'seat',
        label: '临时机位',
        width:'70px'
    },
    {
        key: 'aircraftNo',
        label: '机号',
        width:'55px'
    },
    {
        key: 'flightNo',
        label: '航班号',
        width:'60px'
    },
    {
        key: 'timeStartReal',
        label: '拖行到位时间',
        width:'90px',
        display: ({row}) => {
            return displayTimeDate(row.timeStartReal);
        },
    },
    {
        key: 'waitTime',
        label: '使用时长(分)',
    },
    {
        key: 'leaveSeat',
        label: '空出机位',
        width:'70px'
    },
    {
        key: 'leaveFlightNo',
        label: '预计保障航班/机号',
        width:'110px',
    },
    {
        key: 'usedFlag',
        label: '启用结束',
        display: ({row}) => {
            return row.usedFlag == '1' ? '是' : '否';
        },
    },
];
// 应急下客区
export const exigencyConfig=[

    {
        key: 'seat',
        label: '机位', width:'55px'
    },
    {
        key: 'flightNo',
        label: '航班号', width:'65px'
        
    },
    {
        key: 'aircraftNo',
        label: '机号', width:'55px'
        
    },
    {
        key: 'ata-atd',
        label: '落地时间',
        width:'65px'
    },
    {
        key: 'waitTime',
        label: '已等待时间',
    },
    {
        key: 'dropOffFlag',
        label: '已下客',
    },
    {
        key: 'dropOffNum',
        label: '下客人数',
    },
    {
        key: 'securityCheck',
        label: '使用安检',
        display: ({row}) => {
            return row.securityCheck === 0 ? '是' : row.securityCheck === 1 ? '否' : '--';
        },
    },
    {slot: 'option1', label: '操作', width:'60px'},

];