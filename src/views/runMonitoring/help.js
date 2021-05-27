
export const setting = {
	advanceArrive:  [
			{
                type: 'index',
				label: '序号',
				font: 'font-One',
			},
			{
				prop: 'flightNo',
				label: '航班号',
 			},
			{
				prop: 'aircraftNo',
				label: '机号',
 			},
			{
				prop: 'displayScheduleTime',
				label: '计划时间',
			},
			{
				prop: 'displayETA',
				label: '预计时间',
			},
		],

	batchConcern: [
			{
                type: 'index',
				label: '序号',
 			},
			{
				prop: 'flightNo',
				label: '航班号',
				font: 'font-One',
			},
			{
				prop: 'movement',
				label: '进/离',
				font: 'font-One',
			},
			{
				prop: 'displayScheduleTime',
				label: '计划时间',
			},
			{
				prop: 'eta-ctot',
				label: '预计时间',
			},
			{
				prop: 'ata-atd',
				label: '实际时间',
			},
			{
				prop: 'reasonType',
				reference: true,
			},
			{
				prop: 'concernReason',
				reference: true,
			},
			{
				prop: 'hightLightStatus',
				reference: true,
			},
			{
				prop: 'batchSet',
				label: '批量预警',

			},
			{
				prop: 'warnDetail',
				label: '取消预警',

			},
			{
				prop: 'cancel',
				label: '取消关注',
			},
		],
	guaranteeWarn: [
			{
                type: 'index',
				label: '序号',
 			},
			{
				prop: 'flightNo',
				label: '航班号',
 			},
			{
				prop: 'seat',
				label: '机位',
			},
			{
				prop: 'movement',
				label: '进/离',
 			},
			{
				prop: 'ata-atd',
				label: '实际时间',
			},
			{
				prop: 'stepCode',
				label: '预警节点',
			},
		],

	vvpFlights: [
        {
            type: 'index',
            label: '序号',
			width:49,
         },
        {
            prop: 'flightNo',
            label: '航班号',
         },
        {
            prop: 'movement',
            label: '进/离',
         },
        {
            prop: 'displayScheduleTime',
            label: '计划时间',

        },
        {
            prop: 'milestoneStatusCn',
            label: '空地里程碑状态',
        },
        {
            prop: 'reasonType',
            reference: true,
        },
        {
            prop: 'concernReason',
            reference: true,
        },
        {
            prop: 'hightLightStatus',
            reference: true,
        },
        {
            prop: 'batchSet',
            label: '批量预警',

        },

        {
            prop: 'warnDetail',
            label: '取消预警',
        },
    ],
};
