export const titleMessage = {
    advanceArrive: (
        `<div>
            <p align="left"> 1.排除取消航班 </p>
    <p align="left"> 2.航班未实际落地</p>
    <p align="left"> 3.满足任一条件则入池:</p>
    <div style="margin-left: 20px">
    <p>1). 首次收到ETA的时间并且ETA的时间-当前时间<30分钟</p>
    <p>2). 修正的ETA - 上一次ETA>15分钟且修正的ETA - 上一次ETA<15分钟</p>
    <p>3). 实际落地超过30分钟则出池</p>
</div>
</div>`
    ),
    guaranteeWarn: (
        `<div>
<p align="left">1.满足空地里程碑保障主线节点 </p>
<p align="left"> 2.收到保障节点的预计完成时间且10分钟内未完成则入池</p>
<p align="left"> 3.收到保障节点的完成时间则出池</p>
</div>
`
    ),
    vvpFlights: ` <div>
            <p>1.要客航班</p>
            <p>2.实际落地时间为空</p>
            <p>3.实际落地超过当前时间30分钟则出池</p>
    </div>`

}
export const setting = {
    advanceArrive: [
        {
            key: 'ind',
            type: 'index',
            width: '30px', label: '序号',

        },
        {

            key: 'flightNo',
            width: '50px', label: '航班号',
            type: 'slot'
        },
        {

            key: 'aircraftNo',
            width: '50px', label: '机号',
            type: 'simple'
        },
        {

            key: 'displayScheduleTime',
            width: '50px', label: '计划时间',
            type: 'simple'
        },
        {

            key: 'displayETA',
            width: '50px', label: '预计时间',
            type: 'simple'
        },
    ],

    batchConcern: [
        {
            type: 'index',
            width: '30px', label: '序号',
            key: 'ind'
        },
        {
            key: 'flightNo',
            width: '50px', label: '航班号',
            type: 'slot'
        },
        {
            key: 'movement',
            width: '50px', label: '进/离',
            type: 'simple'
        },
        {
            key: 'displayScheduleTime',
            width: '50px', label: '计划时间',
            type: 'simple'
        },
        {
            key: 'eta-ctot',
            width: '50px', label: '预计时间',
            type: 'simple'
        },
        {
            key: 'ata-atd',
            width: '50px', label: '实际时间',
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
            width: '50px', label: '批量预警',
            type: 'slot'
        },
        {
            key: 'warnDetail',
            width: '50px', label: '取消预警',
            type: 'slot'
        },
        {
            key: 'cancel',
            width: '50px', label: '取消关注',
            type: 'slot'
        },
    ],
    guaranteeWarn: [
        {
            type: 'index',
            width: '30px', label: '序号',
            key: 'ind'
        },
        {
            key: 'flightNo',
            width: '50px', label: '航班号',
            type: 'slot'
        },
        {
            key: 'seat',
            width: '50px', label: '机位',
            type: 'simple'
        },
        {
            key: 'movement',
            width: '50px', label: '进/离',
            type: 'simple'
        },
        {
            key: 'ata-atd',
            width: '50px', label: '实际时间',
            type: 'simple'
        },
        {
            key: 'stepCode',
            width: '50px', label: '预警节点',
            type: 'simple'
        },
    ],

    vvpFlights: [
        {
            type: 'index',
            width: '30px', label: '序号',
            key: 'ind'
        },
        {
            key: 'flightNo',
            width: '50px', label: '航班号',
            type: 'slot'
        },
        {
            key: 'movement',
            width: '50px', label: '进/离',
            type: 'simple'
        },
        {
            key: 'displayScheduleTime',
            width: '50px', label: '计划时间',
            type: 'simple'

        },
        {
            key: 'milestoneStatusCn',
            width: '80px', label: '空地里程碑状态',
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
            width: '50px', label: '批量预警',
            type: 'slot'
        },

        {
            key: 'warnDetail',
            width: '50px', label: '取消预警',
            type: 'slot'
        },
    ],
};
