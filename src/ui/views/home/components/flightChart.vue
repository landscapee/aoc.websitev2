<template>
    <div class="flightChart" :class="options.position">
        <div class="box_content">
            <div class="title">
                <span class="name">{{getTitle()}}</span>
                <i class="iconfont icon-qiehuan" v-if="select==1" @click="runTypeToday=!runTypeToday"></i>
                <ul class="radioBox">
                    <li class="li1" :class="select==0?'active':''" @click="navHandle(0)">积压</li>
                    <li class="li2" :class="select==1?'active':''" @click="navHandle(1)">运行</li>
                </ul>
                <div class="det" v-if="select==0">

                    <div>
                        <div class="iconBox box2">
                            <i class="iconfont icon-jiantou1"></i>
                        </div>
                        下一小时预计积压:{{onehoursNum}}
                    </div>
                    <div>
                        <div class="iconBox box1">
                            %
                        </div>
                        未来1h预计放行正常率:{{getOneHourTakeoff(flight_home)}}%
                    </div>

                </div>
            </div>
            <div id="flight_chart_box" class="chart"></div>
        </div>
    </div>
</template>

<script>
import Highcharts from 'highcharts/highstock'
import PostalStore from '@ui_lib/postalStore'
let postalStore = new PostalStore()
export default {
    props: ['options', 'flight_FlightStatistic', 'flight_delay_backStatus', 'flight_home'],
    data() {
        return {
            select: 0,
            navLists: [
                { name: '今日航班实时积压情况', value: 0 },
                { name: '今日航班实时运行情况', value: 1 },
            ],
            runTypeToday: true,
            chart: null,
            loading: false,
            onehoursNum: 0,
        }
    },
    created() {},
    mounted() {},
    watch: {
        flight_delay_backStatus: function (val) {
            let nextHour = this.$moment().add(1, 'h').hours()
            this.onehoursNum = val.prediction[nextHour]
            if (this.select === 1 && !this.loading) {
                this.loadChart()
            }
        },
        flight_FlightStatistic: function (val) {
            if (this.select === 0) {
                this.loadChart()
            }
        },
        runTypeToday: function (val) {
            this.loading = false
            this.setOption()
        },
    },
    methods: {
        getTitle() {
            let title = this.navLists[this.select].name
            if (this.select == 1) {
                if (this.runTypeToday) {
                    title = '今日航班实时运行情况'
                } else {
                    title = '昨日航班实时运行情况'
                }
            }
            return title
        },
        getOneHourTakeoff({ takeOffAfterOneHourNormal, takeOffAfterOneHourTotal }) {
            let nextHourRate = (takeOffAfterOneHourNormal || 0) / (takeOffAfterOneHourTotal || 1)
            nextHourRate = (nextHourRate * 100).toFixed(2)
            return nextHourRate
        },
        navHandle(index) {
            this.runTypeToday = true
            this.select = index
            this.loading = false
            this.setOption()
        },
        setOption() {
            if (this.select == 1) {
                if (this.runTypeToday) {
                    this.$emit('set-settingcfg', 'summary-by-hour-today')
                } else {
                    this.$emit('set-settingcfg', 'summary-by-hour-yesterday')
                }
            } else {
                this.$emit('set-settingcfg', 'summary-by-hour-backlog')
            }
            this.$nextTick(function () {
                this.loadChart()
            })
        },
        loadChart() {
            // 图表初始化函数
            let options = _.cloneDeep(this.options.options)
            let series = this.options.options.series(
                this.select == 1 ? this.flight_FlightStatistic : this.flight_delay_backStatus,
                (data, isExecuteAble, isToday) => {
                    if (this.select == 0) {
                        this.backlogChartClick(data, isExecuteAble)
                    } else {
                        // this.backlogChartClick(data)
                        this.chartClick(data, isExecuteAble, isToday)
                    }
                }
            )

            options.series = series
            if (this.loading) {
                this.chart.update(options)
            } else {
                this.loading = true
                this.chart = Highcharts.chart('flight_chart_box', options)
            }
        },
        backlogChartClick(time, isExecuteAble) {
            let selector = time <= 9 ? '0' + time : time
            let currentDetail = _.get(
                this.flight_delay_backStatus,
                [isExecuteAble ? 'executable-detail' : 'actual-detail'],
                {}
            )
            let ids = currentDetail[selector]

            postalStore.pub('Worker', 'Home.GetFlightsByIds', {
                ids: ids || [],
                webSubName: 'Home.Chart1.Return',
                getTitleSpan: `类型:${isExecuteAble ? '可执行航班' : '积压航班'} 时间:${time}时`,
            })
        },
        chartClick(time, movement, isToday) {
            let day = isToday
                ? this.$moment().format('YYYYMMDD')
                : this.$moment().subtract(1, 'day').format('YYYYMMDD')
            let fullHour = time < 10 ? '0' + time : time
            let day_time = day + fullHour

            this.$request
                .post(
                    'situation',
                    `intime/detail`,
                    {
                        hour: day_time,
                        movement,
                    },
                    true
                )
                .then((res) => {
                    postalStore.pub('Web', 'Home.Chart2.Return', {
                        data: res.data || [],
                        getTitleSpan: `进/离:${movement == 'A' ? '进港' : '离港'} 时间:${time}时`,
                    })
                })

            //         ajax.post('situation', `intime/detail`, options, (response) => {
            // 	let data = map(response, (v, i) => {
            // 		v.index001 = i + 1;
            // 		v.movement = v.movement === 'D' ? '离港' : '进港';
            // 		return addDisplayField(v);
            // 	});
            // 	channel.publish('Web', 'Home.ToolTip.Return', { data });
            // });

            //             this.returnObj = ['Worker', 'Home.GetToolTipContentSp', { hour: day_time, movement }];
            //             self.setState({ showToolTip: type, sts: { movementStr: movement === 'D' ? '离港' : '进港', hour: time + '时' } });
        },
    },
}
</script>

<style scoped lang='scss'>
.flightChart {
    padding: 7px;
    position: absolute;
    .box_content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        .title {
            display: flex;
            align-items: center;
            position: absolute;
            top: 15px;
            left: 10px;
            z-index: 10;
            .name {
                color: #fff;
            }
            .icon-qiehuan {
                color: #f78501 !important;
                margin: 0 5px;
            }
            .radioBox {
                height: 24px;
                display: flex;
                border-radius: 2px;
                overflow: hidden;
                margin-left: 5px;
                li {
                    padding: 0 10px;
                    color: #000;
                    background-color: #fff;
                    line-height: 24px;
                    font-size: 12px;
                    cursor: pointer;
                }
                li.active {
                    background-color: #0882ff;
                    color: #fff;
                }
            }
            .det {
                display: flex;
                & > div {
                    display: flex;
                    justify-items: center;
                    align-items: center;
                    color: #fff;
                    font-size: 12px;
                    margin: 0 5px;
                    .iconBox {
                        height: 16px;
                        width: 16px;
                        border-radius: 14px;
                        color: #fff;
                        font-size: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 5px;
                        i {
                            color: #fff;
                            font-size: 12px;
                        }
                    }
                    .box1 {
                        background-color: #fd6d4a;
                    }
                    .box2 {
                        background-color: #0ea6a4;
                    }
                }
            }
        }
        #flight_chart_box {
            height: 100%;
            width: 100%;
        }
    }
}
</style>
