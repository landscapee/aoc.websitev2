import {cloneDeep, get} from 'lodash';

export function barOptions(xData, yData, unit, grid, title, legend, barWidth, colorList) {
    let defaultColorList = [
        //
        { top: '#25E0E7', bottom: '#00CAD2' },
        { top: '#0C9FFF', bottom: '#0566FF' },
        { top: '#56DF95', bottom: '#3DC37A' },
        { top: '#56BFE2', bottom: '#3399D4' },
        { top: '#97EBFF', bottom: '#6DE3FF' },
        { top: '#0C9FFF', bottom: '#0566FF' },
    ];
    let defaultGrid = {
        top: 30,
        left: '2%',
        right: '40',
        bottom: '0px',
        containLabel: true,
    };
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
    let defaultBarWidth = 15;
    let option = null;
    let barColorList = colorList ? colorList : defaultColorList;
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
            data: item.data,
            label: {
                normal: {
                    show: false,
                    fontSize: 14,
                    fontWeight: 400,
                    color: '#2b2b2b',
                    position: 'top',
                },
            },
            barWidth: barWidth ? barWidth : defaultBarWidth,
            barMinHeight: 10,
        };
    });
    option = {
        backgroundColor: '#19253C',
        title: { ...defaultTitle, ...title },
        legend: { ...defaultLegend, ...legend },
        tooltip: {
            show: false,
        },
        grid: { ...defaultGrid, ...grid },
        xAxis: [
            {
                type: 'category',
                data: xData,
                name: '等待航班\n\n机位',
                nameLocation: 'end',
                nameTextStyle: {
                    fontSize: 12,
                    verticalAlign:'end',
                    color: '#7286AC',
                    padding: [8, 0, 0, -22],
                    // padding: [-500, 0, 0, -50],
                },
                axisTick: {
                    show: false, // 是否显示坐标轴轴线
                },
                splitLine: {
                    show: false,
                },
                boundaryGap: true,
                axisLine: {
                    // 坐标轴轴线相关设置。
                    show: true,
                    inside: false,
                    lineStyle: {
                        color: '#888888',
                    },
                },
                axisLabel: {
                    show: true,
                    color: '#7286AC',
                    fontSize: 12,
                    // formatter: (val) => {
                    // 	val.top/n
                    // }
                },
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
        series: yDataSeries,
    };
    return option;
}