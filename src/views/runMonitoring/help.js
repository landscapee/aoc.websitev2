
export const setting = {
	advanceArrive:  [
			{
				key: 'ind',
                type: 'index',
				width: '30px',label: '序号',

			},
			{

				key: 'flightNo',
				width: '50px',label: '航班号',
                type: 'simple'
 			},
			{

				key: 'aircraftNo',
				width: '50px',label: '机号',
                type: 'simple'
 			},
			{

				key: 'displayScheduleTime',
				width: '50px',label: '计划时间',
                type: 'simple'
			},
			{

				key: 'displayETA',
				width: '50px',label: '预计时间',
                type: 'simple'
			},
		],

	batchConcern: [
			{
                type: 'index',
				width: '30px',label: '序号',
                key:'ind'
 			},
			{
				key: 'flightNo',
				width: '50px',label: '航班号',
                type: 'simple'
			},
			{
				key: 'movement',
				width: '50px',label: '进/离',
                type: 'simple'
			},
			{
				key: 'displayScheduleTime',
				width: '50px',label: '计划时间',
                type: 'simple'
			},
			{
				key: 'eta-ctot',
				width: '50px',label: '预计时间',
                type: 'simple'
			},
			{
				key: 'ata-atd',
				width: '50px',label: '实际时间',
                type: 'simple'
			},
			{
				key: 'reasonType',
				reference: true,
                type: 'simple'
			},
			{
				key: 'concernReason',
				reference: true,
			},
			{
				key: 'hightLightStatus',
				reference: true,
			},
			{
				key: 'batchSet',
				width: '50px',label: '批量预警',
                type: 'slot'
			},
			{
				key: 'warnDetail',
				width: '50px',label: '取消预警',
                type: 'slot'
			},
			{
				key: 'cancel',
				width: '50px',label: '取消关注',
                type: 'simple'
			},
		],
	guaranteeWarn: [
			{
                type: 'index',
				width: '30px',label: '序号',
				key:'ind'
 			},
			{
				key: 'flightNo',
				width: '50px',label: '航班号',
                type: 'simple'
 			},
			{
				key: 'seat',
				width: '50px',label: '机位',
                type: 'simple'
			},
			{
				key: 'movement',
				width: '50px',label: '进/离',
                type: 'simple'
 			},
			{
				key: 'ata-atd',
				width: '50px',label: '实际时间',
                type: 'simple'
			},
			{
				key: 'stepCode',
				width: '50px',label: '预警节点',
                type: 'simple'
			},
		],

	vvpFlights: [
        {
            type: 'index',
            width: '30px',label: '序号',
			key:'ind'
         },
        {
            key: 'flightNo',
            width: '50px',label: '航班号',
            type: 'simple'
         },
        {
            key: 'movement',
            width: '50px',label: '进/离',
            type: 'simple'
         },
        {
            key: 'displayScheduleTime',
            width: '50px',label: '计划时间',
            type: 'simple'

        },
        {
            key: 'milestoneStatusCn',
            width: '80px',label: '空地里程碑状态',
            type: 'simple'
        },
        {
            key: 'reasonType',
            reference: true,
        },
        {
            key: 'concernReason',
            reference: true,
        },
        {
            key: 'hightLightStatus',
            reference: true,
        },
        {
            key: 'batchSet',
            width: '50px',label: '批量预警',
            type: 'slot'
        },

        {
            key: 'warnDetail',
            width: '50px',label: '取消预警',
            type: 'slot'
        },
    ],
};
