<template>
    <div class="home_number2" :class="options.position">
        <div class="box_content" @click="flightDialogHandle">
            <div class="left">
                <div class="top fo">
                    {{activeData}}
                </div>
                <div class="footer">
                    {{options.title}}
                </div>
            </div>
            <div class="right">
                <img :src="'/src/ui/views/home/static/imgs/'+options.icon+'.png'" alt="">
                <!-- <icon-svg :iconClass="options.icon" /> -->
            </div>
        </div>

    </div>
</template>

<script>
export default {
    props: ['options', 'flight_home'],
    data() {
        return {
            select: 0,
            activeData: 0,
            detail: [],
            stat: {},
        }
    },
    created() {},
    mounted() {},
    watch: {
        flight_home: function () {
            this.load_flight_home()
        },
    },
    methods: {
        load_flight_home() {
            this.activeData = this.options.value(this.flight_home)
        },
        flightDialogHandle() {
            this.$emit('flight-dialog-handle', this.options)
            return false

            this.$request
                .post(
                    'situation',
                    `runningState/${this.options.toolTip}`,
                    {
                        startTime: this.today + ' 00:00:00',
                        endTime: this.today + ' 23:59:59',
                    },
                    true
                )
                .then((res) => {
                    this.dialogShow = true
                    this.tableData = res.data.detail || []
                    this.stat = res.data.stat || {}

                    this.loadColumnConfig()
                })
        },
        loadColumnConfig() {
            this.columnConfig = [
                { key: 'ind', label: '序号', type: 'index', width: '50px' },
                {
                    key: 'flightNo',
                    label: '航班号',
                },
            ]
            console.log(this.options)
            switch (this.options.key) {
                case 'flightReturn':
                    this.columnConfig = _.concat(this.columnConfig, [
                        {
                            key: 'aircraftNo',
                            label: '机尾号',
                        },
                        {
                            key: 'ata',
                            label: '实际到达',
                            display: ({ row }) => {
                                return row.ata ? row.ata : '--'
                            },
                        },
                        {
                            key: 'returnReason',
                            label: '返航原因',
                            display: ({ row }) => {
                                return row.returnReason ? row.returnReason : '--'
                            },
                        },
                    ])
                    this.getTitleSpan = ''
                    break
                case 'alternate':
                    this.columnConfig = _.concat(this.columnConfig, [
                        {
                            key: 'aircraftNo',
                            label: '机尾号',
                        },
                        {
                            key: 'estimateTime',
                            label: '预计到达',
                            display: ({ row }) => {
                                return row.estimateTime
                                    ? this.$moment(row.estimateTime).format('HH:mm')
                                    : '--'
                            },
                        },
                        {
                            key: 'actualTime',
                            label: '实际到达',
                            display: ({ row }) => {
                                return row.actualTime
                                    ? this.$moment(row.actualTime).format('HH:mm')
                                    : '--'
                            },
                        },
                        {
                            key: 'routing',
                            label: '航线',
                            display: ({ row }) => {
                                return row.routing.join('-')
                            },
                        },
                    ])
                    this.getTitleSpan = `总架次:${this.stat.total}  起飞:${this.stat.departure}`
                    break
                case 'alternateOtherCity':
                    this.columnConfig = _.concat(this.columnConfig, [
                        {
                            key: 'aircraftNo',
                            label: '机尾号',
                        },
                        {
                            key: 'preAtd',
                            label: '前站实际离港',
                            display: ({ row }) => {
                                return row.preAtd ? this.$moment(row.preAtd).format('HH:mm') : '--'
                            },
                        },
                        {
                            key: 'actualTime',
                            label: '实际到达',
                            display: ({ row }) => {
                                return row.actualTime
                                    ? this.$moment(row.actualTime).format('HH:mm')
                                    : '--'
                            },
                        },
                        {
                            key: 'routing',
                            label: '备降城市',
                            display: ({ row }) => {
                                return row.routing.join('-')
                            },
                        },
                    ])
                    this.getTitleSpan = `总架次:${this.stat.total}  起飞:${this.stat.departure}`
                    break
                case 'cancel':
                    this.columnConfig = _.concat(this.columnConfig, [
                        {
                            key: 'movement',
                            label: '进/离港',
                            display: ({ row }) => {
                                return row.movement == 'A' ? '进' : '离'
                            },
                        },
                        {
                            key: 'routing',
                            label: '航线',
                            display: ({ row }) => {
                                return row.routing.join('-')
                            },
                        },
                        {
                            key: 'hallwayCn',
                            label: '城市方向',
                            display: ({ row }) => {
                                return row.hallwayCn ? row.hallwayCn : '--'
                            },
                        },
                        {
                            key: '',
                            label: '方向占比',
                            display: ({ row }) => {
                                return `${row.directionCount}/${row.directionAllCount1}`
                            },
                        },
                    ])
                    this.getTitleSpan = `连班:${this.stat.sucession} 单进:${this.stat.in} 单出:${this.stat.out}`
                    break
                default:
                    break
            }
        },
    },
}
</script>

<style scoped lang='scss'>
.home_number2 {
    padding: 4px;
    position: absolute;
    .box_content {
        padding: 20px 10px 20px 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        .left {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .top {
            color: #fff;
            font-size: 28px;
            margin-bottom: 5px;
        }
        .footer {
            color: #909090 !important;
        }
        .right {
            svg {
                font-size: 50px;
            }
        }
    }
}
</style>
<style lang='scss'>
.homeNumber2Title {
    display: flex;
    color: #fff;
    padding: 0 50px 0 10px;
    justify-content: space-between;

    .title {
        color: #fff;
        line-height: 20px;
        display: flex;
        align-items: center;
        span {
            margin-left: 10px;
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
        }
    }
    .title:before {
        content: '';
        display: inline-block;
        height: 16px;
        width: 5px;
        background: #0566ff;
        border-radius: 1px;
        margin-right: 5px;
    }
}
.homeNumber2contentbox {
    overflow: auto;
}
</style>
