const DISPLAYNULL = '--';
import {get} from 'lodash';

export const titleMessage = {
    fastEnter: (
        `<div>
            <p align="left" style="line-height: 20px"> 
                    1.满足是离港航班 <br/>
                     2.满足有关联航班 <br/>
                     3.满足能根据机尾号获取最大客座数(有最大客座数就能获取最小过站时间)<br/>
                     4.计划时间不能为空 <br/>
                      5.计算过站时间:<br/>
                 <span style="display:inline-block;text-indent: 20px;line-height: 20px" >
                    1.实际过站时间:当前离港的航班的计划时间-离港航班关联的进港航班的时间(有实际落地时间取实际落地时间，没有则取预计落地时间)
                </span><br/>
                <span style="display:inline-block;text-indent: 20px;line-height: 20px">
                    2.计划过站时间:当前离港的航班的计划时间-离港航班关联的进港航班的计划时间 有实际过站时间取实际过站时间，无则取计划过站时间</span><br/>
              6.满足计算出来的过站时间\<最小过站时间且计算出来的过站时间\>最小过站时间-10分钟则入池 <br/>
              7.不满足条件自动出池
              </p>
        </div>`
    ),
    critical: (
        `<div style="line-height: 20px">
            1.满足是离港航班<br/>
            2.满足离港航班的ctot时间-当前时间<=55分钟<br/>
            3.满足放行标准起飞时间-离港航班的ctot时间<=10分钟<br/>
            4.满足离港航班的ctot时间-放行标准起飞时间<=10分钟<br/>
            5.满足放行标准起飞时间+25分钟>当前时间<br/>
            6.航班起飞后自动出池
        </div>
`
    ),
    initialFlights2: (
        `<div style="line-height: 20px">
            1.排除删除航班<br/>
            2.满足正加货包<br/>
            3.满足离港未起飞<br/>
            4.排除关联航班没有实际落地时间<br/>
            5.是始发航班且该航班未起飞
        </div>`),
    alwaysDelay: (
        `<div style="line-height: 20px">
           1.取全场航班<br/>
            2.按照放行正常率规则计算出航班是否放行正常<br/>
            3.(航班历史正常数量/总数量)*100 < 50 (低于50%则入池)<br/>
            4.航班起飞后自动出池
        </div>
`
    ),
    departGuarantee: (
        `<div style="line-height: 20px">
            1.离港航班<br/>
            2.未推出<br/>
            3.未起飞<br/>
            4.当前时间>计划时间<br/>
            5.航班起飞则出池
        </div>`),
    delayFlights2:
        `<div>
            <p align="left">按照判断六个率(放行、始发、正常、起飞、落地、早始发)是否正常的规则，展示不正常的且未起飞的航班。航班起飞后自动出池。 </p>
        </div>`
    ,
}

export const setting = {
    //始发航班池
    initialFlights2: [
        {

            key: 'ind',
            type: 'index', width: '20px', label: '序号',
        },
        {
            key: 'flightNo',
            type: 'slot', width: '40px', label: '航班号',

        },
        {
            key: 'displayPreOrNxtPlanTime',
            type: 'simple', width: '60px', label: '前站计划时间',
        },
        {
            key: 'direction',
            type: 'simple', width: '40px', label: '进港方向',
        },

        {
            key: 'reasonType',
            reference: true,
        },
        {
            key: 'concernReason',
            reference: true,
        },
    ],

    // title: '延误航班池',

    delayFlights2: [
        {
            key: 'ind',
            type: 'index', width: '20px', label: '序号',
        },
        {
            key: 'flightNo',
            type: 'slot', width: '40px', label: '航班号',

        },
        {
            key: 'aircraftNo',
            type: 'simple', width: '30px', label: '机号',
        },
        {
            key: 'sta-std',
            type: 'simple', width: '40px', label: '计划时间',
            display: (row) => {
                let movement = row.movement;
                return movement === 'D' ? get(row, 'displaySTDWithDate', DISPLAYNULL) : get(row, 'displaySTAWithDate', DISPLAYNULL);

            }
        },
        {
            key: 'eta-ctot',
            type: 'simple', width: '40px', label: '预计时间',
            display: (row) => {
                let movement = row.movement;
                return movement === 'D' ? get(row, 'displayCTOT', DISPLAYNULL) : get(row, 'displayETA', DISPLAYNULL);

            }
        },
        {
            key: 'reasonType',
            reference: true,
        },
        {
            key: 'concernReason',
            reference: true,
        },
    ],
    // title: '长期延误池',

    alwaysDelay: [
        {
            key: 'ind',
            type: 'index', width: '20px', label: '序号',

        },
        {
            key: 'flightNo',
            type: 'slot', width: '40px', label: '航班号',

        },
        {
            key: 'seat',
            type: 'simple', width: '20px', label: '机位',
        },
        {
            key: 'displayPreOrNxtPlanTime',
            type: 'simple', width: '60px', label: '前站计划时间',
        },
        {
            key: 'displayCTOT',
            type: 'simple', width: '30px', label: 'CTOT',
        },

        {
            key: 'reasonType',
            reference: true,
        },
        {
            key: 'concernReason',
            reference: true,
        },
    ],
    // title: '快速过站池', fastEnter
    // title: '过站时间不足',
    fastEnter_noRequested: [
        {
            key: 'ind',
            type: 'index', width: '20px', label: '序号',

        },
        {
            key: 'flightNo',
            type: 'slot', width: '40px', label: '航班号',

        },
        {
            key: 'displayCOBT',
            type: 'simple', width: '30px', label: 'COBT',
        },
        {
            key: 'displayCTOT',
            type: 'simple', width: '30px', label: 'CTOT',
        },
        {
            key: 'noRequestedHandle',
            type: 'slot', width: '20px', label: '操作',

        },
    ],
    // title: '协调快速保障',
    fastEnter_requested: [
        {
            key: 'ind',
            type: 'index', width: '20px', label: '序号',

        },
        {
            key: 'flightNo',
            type: 'slot', width: '40px', label: '航班号',


        },
        {
            key: 'displayCOBT',
            type: 'simple', width: '30px', label: 'COBT',
        },
        {
            key: 'displayCTOT',
            type: 'simple', width: '30px', label: 'CTOT',
        },
        {
            key: 'deptName',
            type: 'simple', width: '30px', label: '部门',
        },
        {
            key: 'requestedHandle',
            type: 'slot', width: '30px', label: '操作',

        },
    ],

    // title: '临界延误池',critical
    // title: '临界保障延误'
    critical_noRequested: [
        {
            key: 'ind',
            type: 'index', width: '20px', label: '序号',

        },
        {
            key: 'flightNo',
            type: 'slot', width: '40px', label: '航班号',

        },
        {
            key: 'displayCOBT',
            type: 'simple', width: '60px', label: '放行标准起飞时间',
        },
        {
            key: 'displayCTOT',
            type: 'simple', width: '30px', label: 'CTOT',
        },
        {
            key: 'noRequestedHandle',
            type: 'slot', width: '20px', label: '操作',


        },
    ],
    // title: '协调临界保障',
    critical_requested: [
        {
            key: 'ind',
            type: 'index', width: '20px', label: '序号',

        },
        {
            key: 'flightNo',
            type: 'slot', width: '40px', label: '航班号',
        },
        {
            key: 'displayCOBT',
            type: 'simple', width: '70px', label: '放行标准起飞时间',
        },
        {
            key: 'displayCTOT',
            type: 'simple', width: '30px', label: 'CTOT',
        },
        {
            key: 'deptName',
            type: 'simple', width: '30px', label: '部门',
        },
        {
            key: 'requestedHandle',
            type: 'slot', width: '30px', label: '操作',


        },
    ],

    // title: '起飞保障池',

    departGuarantee: [
        {
            key: 'ind',
            type: 'index', width: '20px', label: '序号',

        },
        {
            key: 'flightNo',
            type: 'slot', width: '40px', label: '航班号',

        },
        {
            key: 'displaySTD',
            type: 'simple', width: '60px', label: '计划起飞时间',
        },
        {
            key: 'direction',
            type: 'simple', width: '40px', label: '进港方向',
        },
        {
            key: 'contrlPoint', // TODO
            type: 'simple', width: '20px', label: '流控',
        },
    ],

};