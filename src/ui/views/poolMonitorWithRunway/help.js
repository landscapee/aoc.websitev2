export const setting = {
	//始发航班池
    initialFlights2: [
        {
            key: 'flightIndex',
            type: 'simple',width: '20px',label: '序号',
         },
        {
            key: 'flightNo',
            type: 'simple',width: '30px',label: '航班号',
         },
        {
            key: 'displayPreOrNxtPlanTime',
            type: 'simple',width: '60px',label: '前站计划时间',
        },
        {
            key: 'direction',
            type: 'simple',width: '40px',label: '进港方向',
        },
        {
            key: 'concern',
            type: 'simple',width: '20px',label: '关注',
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
            key: 'flightIndex',
            type: 'simple',width: '20px',label: '序号',

        },
        {
            key: 'flightNo',
            type: 'simple',width: '30px',label: '航班号',

        },
        {
            key: 'seat',
            type: 'simple',width: '20px',label: '机号',
        },
        {
            key: 'sta-std',
            type: 'simple',width: '40px',label: '计划时间',
        },
        {
            key: 'eta-ctot',
            type: 'simple',width: '40px',label: '预计时间',
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
            key: 'flightIndex',
            type: 'simple',width: '20px',label: '序号',

        },
        {
            key: 'flightNo',
            type: 'simple',width: '30px',label: '航班号',

        },
        {
            key: 'seat',
            type: 'simple',width: '20px',label: '机位',
        },
        {
            key: 'displayPreOrNxtPlanTime',
            type: 'simple',width: '60px',label: '前站计划时间',
        },
        {
            key: 'displayCTOT',
            type: 'simple',width: '30px',label: 'CTOT',
        },
        {
            key: 'concern',
            type: 'simple',width: '20px',label: '关注',
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
            key: 'flightIndex',
            type: 'simple',width: '20px',label: '序号',

        },
        {
            key: 'flightNo',
            type: 'simple',width: '30px',label: '航班号',


        },
        {
            key: 'displayCOBT',
            type: 'simple',width: '30px',label: 'COBT',
        },
        {
            key: 'displayCTOT',
            type: 'simple',width: '30px',label: 'CTOT',
        },
        {
            key: 'handle',
            type: 'simple',width: '20px',label: '操作',

        },
    ],
	// title: '协调快速保障',
    fastEnter_requested: [
        {
            key: 'flightIndex',
            type: 'simple',width: '20px',label: '序号',

        },
        {
            key: 'flightNo',
            type: 'simple',width: '30px',label: '航班号',


        },
        {
            key: 'displayCOBT',
            type: 'simple',width: '30px',label: 'COBT',
        },
        {
            key: 'displayCTOT',
            type: 'simple',width: '30px',label: 'CTOT',
        },
        {
            key: 'deptName',
            type: 'simple',width: '20px',label: '部门',
        },
        {
            key: 'handle',
            type: 'simple',width: '20px',label: '操作',


        },
    ],

    // title: '临界延误池',critical
    // title: '临界保障延误'
    critical_noRequested: [
        {
            key: 'flightIndex',
            type: 'simple',width: '20px',label: '序号',

        },
        {
            key: 'flightNo',
            type: 'simple',width: '30px',label: '航班号',


        },
        {
            key: 'displayCOBT',
            type: 'simple',width: '30px',label: 'COBT',
        },
        {
            key: 'displayCTOT',
            type: 'simple',width: '30px',label: 'CTOT',
        },
        {
            key: 'handle',
            type: 'simple',width: '20px',label: '操作',


        },
    ],
    // title: '协调临界保障',
    critical_requested: [
        {
            key: 'flightIndex',
            type: 'simple',width: '20px',label: '序号',

        },
        {
            key: 'flightNo',
            type: 'simple',width: '30px',label: '航班号',


        },
        {
            key: 'displayCOBT',
            type: 'simple',width: '30px',label: 'COBT',
        },
        {
            key: 'displayCTOT',
            type: 'simple',width: '30px',label: 'CTOT',
        },
        {
            key: 'deptName',
            type: 'simple',width: '20px',label: '部门',
        },
        {
            key: 'handle',
            type: 'simple',width: '20px',label: '操作',


        },
    ],

    // title: '起飞保障池',

    departGuarantee: [
        {
            key: 'flightIndex',
            type: 'simple',width: '20px',label: '序号',

        },
        {
            key: 'flightNo',
            type: 'simple',width: '30px',label: '航班号',

        },
        {
            key: 'displaySTD',
            type: 'simple',width: '60px',label: '计划起飞时间',
        },
        {
            key: 'direction',
            type: 'simple',width: '40px',label: '进港方向',
        },
        {
            key: 'contrlPoint', // TODO
            type: 'simple',width: '20px',label: '流控',
        },
    ],

};