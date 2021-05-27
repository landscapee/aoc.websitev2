<template>
    <div class="flightChart" :class="data.position">
        <div class="box_content">
            <div class="title">
                <span class="name">
                    {{navLists[navFalg].name}}
                </span>
                <i class="iconfont icon-qiehuan" v-if="navFalg==1"></i>
                <ul class="radioBox">
                    <li class="li1" :class="navFalg==0?'active':''" @click="navFalg=0">积压</li>
                    <li class="li2" :class="navFalg==1?'active':''" @click="navFalg=1">允许</li>
                </ul>
                <div class="det" v-if="navFalg==0">
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
            <div id="flight_chart_box">

            </div>
        </div>
    </div>
</template>

<script>
import Highcharts from 'highcharts/highstock'
export default {
    props: ['data'],
    data() {
        return {
            select: 0,
            navLists: [
                { name: '今日航班实时积压情况', value: 0 },
                { name: '今日航班实时运行情况', value: 1 },
            ],
            navFalg: 0,
        }
    },
    created() {},
    mounted() {
        this.loadChart()
    },
    methods: {
        loadChart() {
            console.log(this.data.options)

            // 图表初始化函数
            // var chart = Highcharts.chart('flight_chart_box',this.data. options)
        },
    },
}
</script>

<style scoped lang='scss'>
.flightChart {
    padding: 4px;
    position: absolute;
    .box_content {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: linear-gradient(
            134deg,
            rgba(26, 39, 64, 0.5) 0,
            rgba(29, 47, 67, 0.5) 30%,
            rgba(29, 47, 67, 0.5) 100%
        ) !important;
        padding: 5px 10px 0;
        position: relative;
        .title {
            display: flex;
            align-items: center;
            position: absolute;
            top: 5px;
            left: 10px;
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
