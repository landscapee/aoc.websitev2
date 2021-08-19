import {displayTimeDate} from '@/lib/helper/utility.js'
import {map} from 'lodash'
 import {tranAtaAtd} from '@/ui/lib/transTimeByKey.js'
// 备降航班统计
export const LandingConfig=	 [

    {slot: 'flightNo', type: 'slot',label: '航班号',width:'45px'},
    {key: 'aircraftNo', type: 'simple',label: '机号',width:'45px' },
    {key: 'flightStatusText', type: 'simple',label: '状态',width:'45px'},
    {key: 'seat', type: 'simple',label: '机位',width:'40px'},
    {key: 'ata', type: 'simple',label: '落地时间', width:'60px'  ,
        display: ({row}) => {

            return tranAtaAtd(row);
        },},
    {key: 'waitTime', type: 'simple',label: '机上等待', width:'60px',
        display: ({row}) => {
             return `${row.waitTime||'--'}(M)`;
        },
    },
    {
        key: 'dropOffTime', type: 'simple',label: '下客时间', width:'60px',
        display: ({row}) => {
            return displayTimeDate(row.dropOffTime);
        },
    },
    {
        slot: 'displayRouter', type: 'slot',label: '航线', width:'255px',
    },
    {key: 'dropOffNum', type: 'simple',label: '下客人数', width:'50px'},
    {
        key: 'securityCheck', type: 'simple',label: '使用安检', width:'50px',
        display: ({row}) => {
            return row.securityCheck === 0 ? '是' : row.securityCheck === 1 ? '否' : '--';
        },
    },
    {key: 'isCancel', type: 'simple',label: '是否取消', width:'50px',
        display: ({row}) => {
            return `${row.isCancel?'是':'否'}`;
        },
    },
    {slot: 'option1', type: 'slot',label: '操作', width:'50px'},
];
// 临时机位
export const tempSeatConfig=[

    {
        key: 'seat',
        type: 'simple',label: '临时机位',
        width:'70px'
    },
    {
        key: 'aircraftNo',
        type: 'simple',label: '机号',
        width:'55px'
    },
    {
        slot: 'flightNo',
        type: 'simple',label: '航班号',
        width:'60px'
    },
    {
        key: 'timeStartReal',
        type: 'simple',label: '拖行到位时间',
        width:'90px',
        display: ({row}) => {
            return displayTimeDate(row.timeStartReal);
        },
    },
    {
        key: 'waitTime',
        type: 'simple',label: '使用时长(分)',
    },
    {
        key: 'leaveSeat',
        type: 'simple',label: '空出机位',
        width:'70px'
    },
    {
        key: 'leaveFlightNo',
        type: 'simple',label: '预计保障航班/机号',
        width:'110px',
    },
    {
        key: 'usedFlag',
        type: 'simple',label: '启用结束',
        display: ({row}) => {
            return row.usedFlag == '1' ? '是' : '否';
        },
    },
];
// 应急下客区
export const exigencyConfig=[

    {
        key: 'seat',
        type: 'simple',label: '机位', width:'55px'
    },
    {
        slot: 'flightNo',
        type: 'simple',label: '航班号', width:'65px'
        
    },
    {
        key: 'aircraftNo',
        type: 'simple',label: '机号', width:'55px'
        
    },
    {
        key: 'ata',
        type: 'simple',label: '落地时间',
        width:'65px',
        display: ({row}) => {
            return tranAtaAtd(row) ;
        },
    },
    {
        key: 'waitTime',
        type: 'simple',label: '已等待时间',
    },
    // {
    //     key: 'dropOffFlag',
    //     type: 'simple',label: '已下客',
    // },
    {
        key: 'dropOffNum',
        type: 'simple',label: '下客人数',
    },
    {
        key: 'securityCheck',
        type: 'simple',label: '使用安检',
        display: ({row}) => {
            return row.securityCheck === 0 ? '是' : row.securityCheck === 1 ? '否' : '--';
        },
    },
    {slot: 'option1', type: 'slot',label: '操作', width:'80px'},

];