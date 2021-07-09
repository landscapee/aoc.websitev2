<template>
    <div class="flightDelay showBox">
        <div class="title">
            <div class="name alib">
                推荐调整时刻
            </div>
            <div class="deltails">
                <span>平均计划架次:{{suggestTime.average}}</span>
                <span>总数:{{suggestTime.total}}</span>
            </div>
        </div>
        <div class="content">
            <div id="flightDelay_charts"></div>
        </div>
    </div>
</template>
<script>
import Highcharts from 'highcharts/highstock'
import * as echarts from 'echarts'
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
                    { name: '推荐调时时刻', data: _.map(suggestTimeDetail, (item) => item.count) },
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
            console.log(echarts)
            this.myChart.setOption(options)
            // if (this.loading) {
            //     this.myChart.update(options)
            // } else {
            //     this.loading = true
            //     // // this.chart = Highcharts.chart('flightDelay_charts', options)
            //     this.myChart.setOption(options)
            // }
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
            let option = this.getBarMoreOption(
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
                this.suggestTimeDetail
            )
            return option
        },
        getBarMoreOption(
            xData,
            yData,
            unit,
            grid,
            title,
            legend,
            barWidth,
            colorList,
            xAxisName,
            dataLabel,
            average,
            totalData
        ) {
            let defaultColorList = [
                //
                { top: '#25E0E7', bottom: '#00CAD2' },
                { top: '#0C9FFF', bottom: '#0566FF' },
                { top: '#56DF95', bottom: '#3DC37A' },
                { top: '#56BFE2', bottom: '#3399D4' },
                { top: '#97EBFF', bottom: '#6DE3FF' },
                { top: '#0C9FFF', bottom: '#0566FF' },
            ]
            let defaultGrid = {
                top: 50,
                left: '3%',
                right: '20',
                bottom: '3%',
                containLabel: true,
            }
            let defaultTitle = {
                show: false,
                text: '目前总计纵向嵌缝',
                textStyle: {
                    align: 'center',
                    color: '#3F3F3F',
                    fontSize: 18,
                },
                top: 0,
                left: 'center',
            }
            let defaultLegend = {
                show: false,
                icon: 'square',
                orient: 'horizontal',
                top: '0.5%',
                left: 'center',
                right: 'center',
                itemGap: 20,
                textStyle: {
                    color: '#FFFFFF',
                    fontSize: 12,
                },
            }
            let defaultBarWidth = 15
            let option = null
            let barColorList = colorList ? colorList : defaultColorList
            var xDATA = _.cloneDeep(xData)
            xDATA && xDATA.push('')
            // xDATA.unshift('');
            var xData2 = _.cloneDeep(xData)
            // xData2.unshift('');
            let yDataSeries = yData.map((item, i) => {
                return {
                    type: 'bar',
                    zlevel: 10,
                    name: item.name,
                    itemStyle: {
                        barBorderRadius: [30, 30, 0, 0],
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: barColorList[i].top,
                                },
                                {
                                    offset: 1,
                                    color: barColorList[i].bottom,
                                },
                            ],
                        },
                    },
                    xAxisIndex: 1,
                    data: item.data,
                    label: {
                        normal: dataLabel || {
                            show: false,
                            fontSize: 14,
                            fontWeight: 400,
                            color: '#2b2b2b',
                            position: 'top',
                        },
                    },
                    barWidth: barWidth ? barWidth : defaultBarWidth,
                    barMinHeight: 10,
                }
            })
            option = {
                backgroundColor: 'transparent',
                title: { ...defaultTitle, ...title },
                legend: { ...defaultLegend, ...legend },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer: {
                        type: 'none',
                    },
                    backgroundColor: 'none',
                    borderWidth: 0,
                    formatter: (value) => {
                        //实际占用率==实际占用/可用
                        //预计占用率==预计占用/可用
                        let lastXData = xData[xData.length - 1].toString()
                        let lastTime = this.$moment()
                            .set('hour', lastXData.substring(0, 2))
                            .set('minute', lastXData.substring(2, 4))
                            .add(30, 'm')
                            .format('HHmm')
                        let secondTimeStr =
                            value[0].dataIndex === xData.length - 1
                                ? lastTime
                                : xData[value[0].dataIndex + 1]
                        let title = xData[value[0].dataIndex] + '-' + secondTimeStr
                        // let actualRate = usableList[value[0].dataIndex] === 0 ? 0 : Math.round((value[0].value / usableList[value[0].dataIndex]) * 100); //实际占用率
                        // let planeRate = usableList[value[0].dataIndex] === 0 ? 0 : Math.round((value[1].value / usableList[value[1].dataIndex]) * 100); //预计占用率
                        let itemBox = ''
                        _.map(totalData[value[0].dataIndex].time, (item) => {
                            itemBox += `<div style='display:flex;justify-content:space-between;'>
					 							<div> 
					 								<span style='height:10px;width:10px;border-radius:5px;background-color:#357AD7;display:inline-block'></span> 
					 								<span>${Object.keys(item)[0]}</span>
					 							</div>
					 							<span>${item[Object.keys(item)[0]]}架次</span>
					 						</div>`
                        })
                        return `
					<div style='background:#25395C;width:151px;height:auto;border-radius:5px;padding-top:9px;'>
						<div style='padding:0 9px;height:25px;line-height:25px;text-align:left;margin-bottom:5px'><span style='padding:2px 5px;background: #357ad7;border-radius: 2px;font-size: 12px;color:#fff;'>${title}</span></div>
						<div style='margin-bottom:5px;padding:0 9px;height:auto;line-height:25px;text-align:left;color:#7286ac; display: flex; flex-direction: column'>
							${itemBox}
						</div>
					</div>
				`
                    },
                },
                grid: { ...defaultGrid, ...grid },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: xDATA,
                        name: xAxisName || '时长',
                        nameLocation: 'end',
                        nameTextStyle: {
                            fontSize: 12,
                            color: '#7286AC',
                            padding: [28, 0, 0, -30],
                        },
                        axisTick: {
                            show: true,
                            inside: true,
                        },
                        splitLine: {
                            show: false,
                        },
                        axisLine: {
                            // 坐标轴轴线相关设置。
                            show: true,
                            inside: false,
                            lineStyle: {
                                color: '#7286AC',
                            },
                        },
                        axisLabel: {
                            show: true,
                            color: '#7286AC',
                            fontSize: 12,
                        },
                    },
                    {
                        show: false,
                        axisLabel: {
                            show: false,
                        },
                        boundaryGap: true,
                        type: 'category',
                        data: xData2,
                    },
                    {
                        show: false,
                        type: 'category',
                        axisLine: {
                            show: false,
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            show: false,
                        },
                        splitArea: {
                            show: false,
                        },
                        splitLine: {
                            show: false,
                        },
                        data: xData2,
                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: 0,
                        name: unit,
                        nameLocation: 'end',
                        splitNumber: 4,
                        minInterval: 1,

                        nameTextStyle: {
                            fontSize: 12,
                            color: '#7286AC',
                            padding: [20, -20, 0, 0],
                        },
                        axisLabel: {
                            // 坐标轴刻度标签的相关设置。
                            show: true,
                            textStyle: {
                                color: '#7286AC',
                            },
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#7286AC',
                            },
                        },
                        axisTick: {
                            show: false,
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#30343B',
                                type: 'dashed',
                            },
                        },
                        show: true,
                    },
                ],
                series: [
                    ...yDataSeries,
                    {
                        xAxisIndex: 1,
                        name: '预计',
                        type: 'line',
                        zlevel: 11,
                        z: 2,
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    color: '#4181e9',
                                    type: 'solid',
                                },
                            },
                        },
                        data: average,
                    },
                ],
            }
            return option
        },
    },
}
</script>


<style lang="scss" scoped>
.flightDelay {
    flex: 1;
    margin: 15px 0;
    padding: 15px;
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