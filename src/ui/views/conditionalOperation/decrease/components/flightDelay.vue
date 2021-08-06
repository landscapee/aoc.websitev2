<template>
    <div class="flightDelay showBox">
        <div class="title">
            <div class="name alib">
                推荐调整时刻
            </div>
            <div class="deltails">
                <span>平均计划架次:{{suggestTime.average}}</span>
                <span>总数:{{totalCount}}</span>
            </div>
        </div>
        <div class="content">
            <div id="flightDelay_charts"></div>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts'
import { flightDelayOptions } from '../config'
export default {
    props: ['currentReduce'],
    data() {
        return {
            totalCount: 0,
            suggestTime: {},
            suggestTimeDetail: [],
            state: {
                flightDelay: {
                    xAxis: ['0.5h', '1h', '1.5h', '2h', '2.5h'],
                    series: [{ name: '已延误航班统计', data: [0, 0, 0, 0, 0] }],
                },
                average: [4, 4, 4, 4, 4],
                unit: '数量（架次）',
                defaultGrid: { right: 10, top: 40 },
                title: {},
                legend: {},
                barWidth: '',
            },
            myChart: null,
        }
    },
    watch: {
        currentReduce: function (val) {
            console.log(val)
            this.totalCount = 0
            this.suggestTime = val.suggestTime
            let suggestTimeDetail = _.get(val.suggestTime, 'detail', [])
            suggestTimeDetail = _.map(suggestTimeDetail, (item, index) => ({
                ...item[Object.keys(item)[0]],
                title: Object.keys(item)[0],
            }))
            _.map(suggestTimeDetail, (item) => (this.totalCount += item.count))

            this.suggestTimeDetail = suggestTimeDetail
            // totalData={suggestTimeDetail}
            // average={[]}
            this.flightDelay = {
                xAxis: _.map(suggestTimeDetail, (item) => item.title),
                series: [
                    { name: '推荐调整时刻', data: _.map(suggestTimeDetail, (item) => item.count) },
                ],
            }

            this.loadChart()
        },
    },
    mounted() {
        this.myChart = echarts.init(document.getElementById('flightDelay_charts'))
    },
    methods: {
        loadChart() {
            // 图表初始化函数

            let options = this.getOptions()
            this.myChart.setOption(options)
        },
        getOptions() {
            let xAxis, series
            if (this.flightDelay && this.flightDelay.xAxis) {
                xAxis = this.flightDelay.xAxis
                series = this.flightDelay.series
            } else {
                xAxis = this.state.flightDelay.xAxis
                series = this.state.flightDelay.series
            }
            let colorList2 = [{ top: '#4CA1E2', bottom: '#3490FF' }]
            let { unit, defaultGrid, title, legend, barWidth, average } = this.state
            average = []
            let grid = { ...defaultGrid }
            let option = flightDelayOptions(
                xAxis,
                series,
                unit,
                grid,
                title,
                legend,
                barWidth,
                colorList2,
                null,
                null,
                average,
                this.suggestTimeDetail,
                this
            )
            return option
        },
    },
}
</script>


<style lang="scss" scoped>
.flightDelay {
    flex: 1;
    margin-bottom: 15px;
    padding: 15px;
    height: 30%;
    .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #fff;
        .name {
            color: #fff;
            line-height: 30px;
            display: flex;
            align-items: center;
            margin-right: 15px;
            font-size: 18px;
        }
        .deltails {
            span {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.5);
                margin-left: 10px;
            }
        }
        .name:before {
            content: '';
            display: inline-block;
            height: 16px;
            width: 4px;
            background: #0566ff;
            border-radius: 1px;
            margin-right: 5px;
        }
    }
    .content {
        height: calc(100% - 30px);
        #flightDelay_charts {
            height: 100%;
            width: 100%;
        }
    }
}
</style>