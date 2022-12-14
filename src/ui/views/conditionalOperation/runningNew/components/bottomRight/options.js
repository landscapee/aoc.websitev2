import {map, get} from 'lodash'
import * as echarts from 'echarts'
const colorList = ['#0666ff', '#3ec37b', '#00cad2', '#6236ff', '#3f98f2'];

export const optionsWeather = (xData, yData, yName) => {
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
        show: true,
        icon: 'square',
        orient: 'horizontal',
        top: '0.5%',
        left: 'center',
        right: 'center',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 15,
        textStyle: {
            color: '#FFFFFF',
            fontSize: 12,
        },
    };
    let option = {
        backgroundColor: '#19253C',
        color: colorList,
        title: {...defaultTitle},
        legend: {...defaultLegend},
        tooltip: {
            show: true,
            trigger: 'axis',
            borderColor: 'rgba(50,50,50,0.7)',
            backgroundColor: 'rgba(50,50,50,0.7)',
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
                    // ??????????????????????????????
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
                    // interval: 0,
                },
            },
        ],
        yAxis: [
            {
                type: 'value',
                min: 0,
                name: yName || '???????????????/?????????',
                nameLocation: 'end',
                splitNumber: 4,
                minInterval: 1,
                nameTextStyle: {
                    fontSize: 12,
                    color: '#7286AC',
                    padding: [20, -5, 0, 0],
                },
                axisLabel: {
                    // ???????????????????????????????????????
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
        series: map(yData, (item, index) => {
            return {
                name: item.name,
                type: 'line',
                symbolSize: 1,
                symbol: 'circle',
                smooth: true,
                yAxisIndex: 0,
                showSymbol: false,
                data: item.data,
                lineStyle: {
                    normal: {
                        width: 2,
                        color: item.color || colorList[index],
                        type: item.type || 'solid',
                    },
                },
            };
        }),
    };
    return option;
}

