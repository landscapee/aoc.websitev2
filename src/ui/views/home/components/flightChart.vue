<template>
    <div class="flightChart" :class="options.position">
        <div class="box_content">
            <div class="title">
                <span class="name">
                    {{navLists[select].name}}
                </span>
                <i class="iconfont icon-qiehuan" v-if="select==1" @click="runTypeToday=!runTypeToday"></i>
                <ul class="radioBox">
                    <li class="li1" :class="select==0?'active':''" @click="navHandle(0)">积压</li>
                    <li class="li2" :class="select==1?'active':''" @click="navHandle(1)">运行</li>
                </ul>
                <div class="det" v-if="select==0">
                    <div>
                        <div class="iconBox box1">
                            <i class="iconfont icon-jiantou1"></i>
                        </div>
                        未来1h预计放行正常率:
                    </div>
                    <div>
                        <div class="iconBox box2">
                            %
                        </div>
                        下一小时预计积压:
                    </div>

                </div>
            </div>
            <div id="flight_chart_box" class="chart">

            </div>
        </div>
    </div>
</template>

<script>
import Highcharts from 'highcharts/highstock'
export default {
    props: ['options', 'flight_FlightStatistic', 'flight_delay_backStatus'],
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
        }
    },
    created() {},
    mounted() {},
    watch: {
        flight_delay_backStatus: function (val) {
            if (this.select === 0 && !this.loading) {
                this.loadChart()
            }
        },
        flight_FlightStatistic: function (val) {
            if (this.select === 1) {
                this.loadChart()
            }
        },
        runTypeToday: function (val) {
            this.setOption()
        },
    },
    methods: {
        navHandle(index) {
            console.log(index)
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
                this.select == 1 ? this.flight_FlightStatistic : this.flight_delay_backStatus
            )
            options.series = series

            if (this.loading) {
                this.chart.update({
                    series: options.series,
                })
            } else {
                this.loading = true
                this.chart = Highcharts.chart('flight_chart_box', options)
            }
        },
    },
}
</script>

<style scoped lang='scss'>
.flightChart {
    padding: 4px;
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
        .flight_chart_box {
            height: 100%;
            width: 100%;
        }
    }
}
</style>
