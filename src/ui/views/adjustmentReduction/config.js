
export const flightDecreaseListsColumnConfig = [
    { key: 'ind', label: '序号', type: 'index', width: '50px' },
    {
        key: 'flightNo',
        label: '航班号',
        width: '70px',
    },
    {
        key: 'airlineCnName',
        label: '航司',
        width: '140px',
    },
    {
        key: 'aircraftType',
        label: '机型',
        width: '60px',
    },
    {
        key: 'aircraftNo',
        label: '机尾号',
        width: '70px',
    },

    {
        key: 'flightType',
        label: '航班类型',
        width: '80px',
    },
    {
        key: 'flightExtStatusText',
        label: '运营状态',
        width: '80px',
    },
    {
        key: '',
        label: '航线',
        display: ({ row }) => {
            return row.displayRouter ? row.displayRouter.join('-') : '--'
        },
    },
    {
        key: '',
        label: '计划',
        width: '80px',
        display: ({ row },that) => {
            return row.scheduleTime
                ? that.$moment(row.scheduleTime).format('HH:mm(DD)')
                : '-'
        },
    },
    {
        key: 'type',
        label: '空地里程碑',
        width: '90px',
        display: ({ row }) => {
            let milestoneStatusCn = _.get(row, 'milestoneStatusCn', '--')
            let milestoneStatusType = _.get(row, 'milestoneStatusType')
            let color = '#fff'
            if (milestoneStatusType === 'elec') {
                // 电子进程单
                color = '#f0f'
            } else if (milestoneStatusType === 'guarantee') {
                // 地面保障
                color = '#0041ff'
            }
            return `<span style="color:${color};">${milestoneStatusCn}</span>`
        },
    },
    {
        key: '',
        label: 'TOBT',
        width: '60px',
        display: ({ row },that) => {
            return row.tobt ? that.$moment(row.tobt).format('HH:mm') : '--'
        },
    },
    {
        key: 'ctot',
        label: 'CTOT',
        width: '60px',
        display: ({ row },that) => {
            return row.ctot ? that.$moment(row.ctot).format('HH:mm') : '--'
        },
    },
    {
        key: '',
        type: 'operate',
        label: '操作',
        width: '60px',
        operates: [
            {
                display: () => {
                    return '<i title="调整" class="iconfont icon-tiaozheng1"></i>'
                },
                disabled: ({ row },that) => {
                    let result = false
                    if (!that.$hasRole('edit-add-flight', false)||row.level||that.currentPlan.sendType!=1) {
                        result = true
                    }
                    return result
                },
                click: ({ row },that) => {
                    let data={
                        reduceAirlineId:that.currentPlan.id,
                        reduceId: that.currentPlan.reducebatchId,
                        flightId:row.flightId,
                        type: "A"
                    }
                    that.$emit('airlineDetails', data)
                },
            },
            {
                display: () => {
                    return '<i title="调减" class="iconfont icon-tiaojian"></i>'
                },
                disabled: ({ row },that) => {
                    let result = false
                    
                    if (!that.$hasRole('edit-add-flight', false)||row.level||that.currentPlan.sendType!=1) {
                        result = true
                    }

                    return result
                },
                click: ({ row }, that) => {
                    let data={
                        reduceAirlineId:that.currentPlan.id,
                        reduceId: that.currentPlan.reducebatchId,
                        flightId:row.flightId,
                        type: "R"
                    }
                    that.$emit('airlineDetails', data)
                },
            },
        ],
    },
]


export const reduceFlightListssColumnConfig1 = [
    { key: 'ind', label: '序号', type: 'index', width: '50px' },
    {
        key: 'flightNo',
        label: '航班号',
        width: '80px',
    },
    {
        key: '',
        label: '计划时间',
        width: '90px',
        display: ({ row },that) => {
            return row.scheduleTime?that.$moment(row.scheduleTime).format('HH:mm(DD)'):'--'
        },
    },
    {
        key: '',
        label: '航线',
        display: ({ row }) => {
            return row.displayRouter ? row.displayRouter.join('-') : '-'
        },
    },
    {
        key: '',
        type: 'operate',
        label: '操作',
        width: '60px',
        operates: [
            {
                display: () => {
                    return '<i title="删除" class="iconfont icon-shanchu11"></i>'
                },
                disabled: ({ row },that) => {
                    let result = false
                    
                    if (!that.$hasRole('edit-del-flight', false)||that.currentPlan.sendType!=1) {
                        result = true
                    }

                    return result
                },
                click: ({ row },that) => {
                    let data={
                        deleted: true,
                        id: row.id,
                        reduceAirlineId:row.reduceAirlineId,
                        reduceId: row.reduceId,
                    }
                    that.$emit('airlineDetails', data)
                },
            },
        ],
    },
]

export const reduceFlightListssColumnConfig2 = [
    { key: 'ind', label: '序号', type: 'index', width: '50px' },
    {
        key: 'flightNo',
        label: '航班号',
        width: '80px',
    },
    {
        key: '',
        label: '计划时间',
        width: '90px',
        display: ({ row },that) => {
            return row.scheduleTime?that.$moment(row.scheduleTime).format('HH:mm(DD)'):'--'
        },
    },
    {
        key: '',
        label: '航线',
        display: ({ row }) => {
            return row.displayRouter ? row.displayRouter.join('-') : '-'
        },
    },
    {
        key: '',
        label: '调后时刻',
        width: '90px',
        display: ({ row }, that) => {
            let updateScheduleTime = row.updateScheduleTime?that.$moment(row.updateScheduleTime).format('HHmm'):''
            if (that.showInput == row.flightId) {
                window.updateScheduleTimeChange = that.updateScheduleTimeChange(row)
                return `<input value="${updateScheduleTime}" class="tableInput" autofocus="autofocus" onchange="updateScheduleTimeChange(this)"/>`
            } else {
                return row.updateScheduleTime?that.$moment(row.updateScheduleTime).format('HH:mm(DD)'):'--'
            }
        },
        click: ({ row },that) => {
            that.showInput = row.flightId
        }
    },
    
    {
        key: '',
        type: 'operate',
        label: '操作',
        width: '60px',
        operates: [
            {
                display: () => {
                    return '<i title="删除" class="iconfont icon-shanchu11"></i>'
                },
                disabled: ({ row },that) => {
                    let result = false
                    
                    if (!that.$hasRole('edit-del-flight', false)||that.currentPlan.sendType!=1) {
                        result = true
                    }

                    return result
                },
                click: ({ row }, that) => {
                    let data={
                        deleted: true,
                        id: row.id,
                        reduceAirlineId:row.reduceAirlineId,
                        reduceId: row.reduceId,
                    }
                    that.$emit('airlineDetails', data)
                },
            },
        ],
    },
    
]