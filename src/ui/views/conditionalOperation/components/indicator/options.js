import {map, get} from 'lodash'
import * as echarts from 'echarts'
const colorList = ['#0666ff', '#3ec37b', '#00cad2', '#6236ff', '#3f98f2'];


export const optionsIndicator = (xData, yData, yName) => {
    //function getLineOption() {
    let defaultTitle = {
        show: false,
        text: '',
        textStyle: {
            align: 'center',
            color: '#3F3F3F',
            fontSize: 18,
        },
        top: 0,
        left: 'center',
    };
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
    };
    let option = {
        // backgroundColor: '#19253C',
        title: {...defaultTitle},
        legend: {...defaultLegend},
        tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },

            borderColor: 'rgba(50,50,50,0.7)',
            backgroundColor: 'rgba(50,50,50,0.7)',
            formatter: '{b0}{a0}:{c0}',
            textStyle: {
                color: '#fff',
                rich: {
                    value: {
                        fontSize: '16',
                        color: '#fff',
                    },
                },
            },
        },
        grid: {
            top: 30,
            left: 50,
            right: 40,
            bottom: 20,
        },
        xAxis: [
            {
                type: 'category',
                data: xData,
                name: '',
                boundaryGap: false,
                nameLocation: 'end',
                nameTextStyle: {
                    fontSize: 12,
                    color: '#7286AC',
                    padding: [28, 0, 0, 0],
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
                    interval: 0,
                },
            },
        ],
        yAxis: [
            {
                type: 'value',
                min: 0,
                name: yName || '速率（架次/小时）',
                nameLocation: 'end',
                splitNumber: 4,
                minInterval: 1,
                nameTextStyle: {
                    fontSize: 12,
                    color: '#7286AC',
                    padding: [20, -5, 0, 0],
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
                    show: true,
                    lineStyle: {
                        color: '#30343B',
                        type: 'dashed',
                    },
                },
                show: true,
            },
        ],
        series: [
            {
                name: yData.name,
                type: 'line',
                symbolSize: 7,
                symbol: 'circle',
                smooth: true,
                // yAxisIndex: 1,
                showSymbol: false,
                data: yData.data,
                itemStyle: {
                    normal: {
                        symbol:'circle',
                         color: '#EB547C',
                        borderWidth: 2,
                        lineStyle: {
                            color: '#247BA0'
                        }
                    },
                },
                lineStyle: {
                    normal: {
                        width: 2,
                        color: '#5b9aff',
                    },
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [
                                {
                                    offset: 0,
                                    color: 'rgba(67,120,207,0.3)',
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(67,120,207,0)',
                                },
                            ],
                            false,
                        ),
                        shadowColor: 'rgba(67,120,207,0.9)',
                        shadowBlur: 20,
                    },
                },
            },

        ],
    };
    return option;
}
