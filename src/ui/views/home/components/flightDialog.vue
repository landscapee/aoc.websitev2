<template>
    <div>
        <el-dialog :visible.sync="dialogShow" class="nodeDialog" center width="960px" :append-to-body="true">
            <template slot="title">
                <div class="homeNumber2Title">
                    <div class="title alib">{{layerName}}<span class="alir">{{getTitleSpan}}</span></div>
                    <div class="blankDiv fo">
                        <el-date-picker v-show="timeShow" v-model="timeData" type="datetimerange" range-separator="至" size="mini" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        <!-- {{this.today + ' 00:00:00'}} - {{this.today + ' 23:59:59'}} -->
                    </div>
                </div>
            </template>
            <div class="homeNumber2contentbox">
                <ele-table :columnConfig="columnConfig" :tableData="tableData" :tableMaxHeight="460"></ele-table>
            </div>
        </el-dialog>
    </div>

</template>
<script>
import PostalStore from '@ui_lib/postalStore'
let postalStore = new PostalStore()
export default {
    data() {
        return {
            dialogShow: false,
            timeShow: false,
            timeData: [],
            columnConfig: [],
            tableData: [],
            today: this.$moment().format('YYYY-MM-DD'),
            getTitleSpan: '',
            layerName: '',
            columnConfig1: [
                { key: 'ind', label: '序号', type: 'index', width: '50px' },
                {
                    key: 'flightNo',
                    label: '航班号',
                },
                {
                    key: 'aircraftNo',
                    label: '机尾号',
                },
                {
                    key: 'scheduleTime',
                    label: '计划时间',
                    display: ({ row }) => {
                        return row.scheduleTime
                            ? this.$moment(row.scheduleTime).format('HH:mm')
                            : '--'
                    },
                },
                {
                    key: 'actualTime',
                    label: '实际时间',
                    display: ({ row }) => {
                        return row.actualTime || row.atd
                            ? this.$moment(row.actualTime || row.atd).format('HH:mm')
                            : '--'
                    },
                },
            ],

            columnConfig2: [
                { key: 'ind', label: '序号', type: 'index', width: '50px' },
                {
                    key: 'flightNo',
                    label: '航班号',
                },
                {
                    key: 'aircraftNo',
                    label: '机尾号',
                },
                {
                    key: 'scheduleTime',
                    label: '计划时间',
                    display: ({ row }) => {
                        return row.scheduleTime
                            ? this.$moment(row.scheduleTime).format('HH:mm')
                            : '--'
                    },
                },
                {
                    key: 'CTOT',
                    label: '实际时间',
                    display: ({ row }) => {
                        return row.ctot ? this.$moment(row.ctot).format('HH:mm') : '--'
                    },
                },
            ],
        }
    },
    mounted() {
        postalStore.sub('Home.ToolTip.Return', ({ data, getTitleSpan }) => {
            console.log(data, getTitleSpan)
            this.dialogShow = true
            this.layerName = '延误航班'
            this.timeShow = false
            this.getTitleSpan = getTitleSpan
            this.columnConfig = this.columnConfig1
            this.tableData = data || []
        })
        postalStore.sub('Home.Chart1.Return', ({ data, getTitleSpan }) => {
            this.dialogShow = true
            this.layerName = '航班积压情况'
            this.timeShow = false
            this.getTitleSpan = getTitleSpan
            this.columnConfig = this.columnConfig2
            this.tableData = data || []
        })
        postalStore.sub('Home.Chart2.Return', ({ data, getTitleSpan }) => {
            this.dialogShow = true
            this.layerName = '航班运行情况'
            this.timeShow = false
            this.getTitleSpan = getTitleSpan
            this.columnConfig = this.columnConfig1
            this.tableData = data || []
        })
    },
    methods: {
        initData({ key, toolTip, title }) {
            this.layerName = title + '航班'
            this.tableData = []
            this.columnConfig = []
            this.getTitleSpan = ''
            this.timeData = [this.today + ' 00:00:00', this.today + ' 23:59:59']
            this.$request
                .post(
                    'situation',
                    `runningState/${toolTip}`,
                    {
                        startTime: this.today + ' 00:00:00',
                        endTime: this.today + ' 23:59:59',
                    },
                    true
                )
                .then((res) => {
                    this.timeShow = true
                    this.dialogShow = true
                    this.tableData = res.data.detail || []
                    this.stat = res.data.stat || {}
                    this.loadColumnConfig(key)
                })
        },
        loadColumnConfig(key) {
            this.columnConfig = [
                { key: 'ind', label: '序号', type: 'index', width: '50px' },
                {
                    key: 'flightNo',
                    label: '航班号',
                    click: ({ row }) => {
                        this.$FlightDetais.open({ flightId: row.flightId }, true)
                    },
                },
            ]
            switch (key) {
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
                            width: '340px',
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
                            key: 'aircraftNo',
                            label: '进/离',
                            display: ({ row }) => {
                                return row.movement == 'A' ? '进' : '离'
                            },
                        },
                        {
                            key: 'routing',
                            label: '航线',
                            width: '340px',
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
                case 'delay':
                    this.columnConfig = _.concat(this.columnConfig, [
                        {
                            key: 'routing',
                            label: '航线',
                            width: '340px',
                            display: ({ row }) => {
                                return row.routers ? row.routers.join('-') : '--'
                            },
                        },
                        {
                            key: 'actualTime',
                            label: '实际起飞',
                            display: ({ row }) => {
                                return row.actualTime
                                    ? this.$moment(row.actualTime).format('HH:mm')
                                    : '--'
                            },
                        },
                        {
                            key: 'scheduleTime',
                            label: '计划起飞',
                            display: ({ row }) => {
                                return row.scheduleTime
                                    ? this.$moment(row.scheduleTime).format('HH:mm')
                                    : '--'
                            },
                        },
                    ])
                    this.getTitleSpan = ``
                    break
                default:
                    break
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.homeNumber2Title {
    display: flex;
    color: #fff;
    padding: 0 50px 0 10px;
    justify-content: space-between;
    height: 40px;

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
    // overflow: auto;
    // height: 600px;
}
</style>