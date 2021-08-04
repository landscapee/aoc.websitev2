import {map, get,cloneDeep } from 'lodash'

export const optionsPie = (mySeriesData) => {
    let seriesData = [
        {
            name: '值机人数',
            value: '21',
        },
        {
            name: '安检人数',
            value: '11',
        },
        {
            name: '登机人数',
            value: '14',
        },
    ];
    let colorList = ['#24ca87', '#9964ff', '#0566ff'];
    let option = {

        tooltip: {
            trigger: 'item',
            borderColor: 'rgba(255,255,255,.3)',
            backgroundColor: 'rgba(13,5,30,.6)',
            borderWidth: 1,
            padding: 5,
            textStyle: {
                color: '#fff',

            },
            formatter: function (parms) {
                let str = parms.marker + '' + parms.data.name + '</br>' + '数量：' + parms.data.value + '人</br>' + '占比：' + parms.percent + '%';
                return str;
            },
        },

        series: [
            {
                type: 'pie',
                z: 10,
                // hoverAnimation:true,
                // center: ['62%', '50%'],
                radius: ['45%', '60%', '75%'],
                // clockwise: true,
                // avoidLabelOverlap: true,
                emphasis: { //新版鼠标移入放大
                    scale: true,
                    scaleSize: 15
                },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{a|{b}\n{d}%}',
                    padding: [-10, 10, 0, 0],
                    rich: {

                        a: {
                            color: '#fff',
                            padding: [10, -80, 0, -60],
                        },
                    },
                },
                labelLine: {
                    normal: {
                        length: 30,
                        length2: 60,
                        length1: 60,
                        lineStyle: {
                            width: 1,
                        },
                    },
                },
                itemStyle: {
                    normal: {
                        color: function (params) {
                            return colorList[params.dataIndex];
                        },
                    },
                },
                data: mySeriesData || seriesData,
            },
        ],
    };
    return option;
}
function getBarMoreOption(xData, yData, unit, grid, title, legend, barWidth, colorList, xAxisName, dataLabel) {
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
        top: 50,
        left: '3%',
        right: '20',
        bottom: '3%',
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
    var xDATA = cloneDeep(xData);
    // xDATA && xDATA.push('');
    // xDATA && xDATA.unshift('');
    var xData2 = cloneDeep(xData);
    // xData2 && xData2.unshift('');
    let yDataSeries = map(yData, (item, i) => {
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
            // xAxisIndex: 1,
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
                data: xDATA,
                axisTick: {
                    show: true,
                    inside: true,
                    alignWithLabel: true,
                },
                // boundaryGap: false,
                name: xAxisName || '时长',
                nameLocation: 'center',
                nameTextStyle: {
                    fontSize: 12,
                    color: '#7286AC',
                    padding: [-8, 0, 0, 305],
                },

                splitLine: {
                    show: false,
                },
                axisLine: {
                    // 坐标轴轴线相关设置。
                    show: true,
                    // inside: false,
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


export const optionsDelay = (flightDelay,gridMy) => {
    let xAxis, series;
    let state = {
        flightDelay: {
            xAxis: ['0.5h', '1h', '1.5h', '2h', '2.5h'],
            series: [{ name: '已延误航班统计', data: [0, 0, 0, 0, 0] }],
        },
        unit: '数量（架次）',
        defaultGrid: { right: 10, top: 40 },
        title: {},
        legend: {},
        barWidth: '',
    };
    if (flightDelay && flightDelay.xAxis) {
        xAxis = flightDelay.xAxis;
        series = flightDelay.series;
    } else {
        xAxis = state.flightDelay.xAxis;
        series =  state.flightDelay.series;
    }
    let colorList2 = [{ top: '#4CA1E2', bottom: '#3490FF' }];
    let { unit, defaultGrid, title, legend, barWidth } =  state;
    let grid = { ...defaultGrid, ...gridMy };
    let option = getBarMoreOption(xAxis, series, unit, grid, title, legend, barWidth, colorList2);
    return option;
};
export const optionsWait = (flightClosingWaiting) =>{
    let state = {
        flightClosingWaiting: {
            xAxis: ['1h', '2h', '3h', '3h以上'],
            series: [{ name: '航班关舱等待统计', data: [0, 0, 0, 0] }],
        },
        unit: '数量（架次）',
        defaultGrid: { right: 10, top: 40 },
        title: {},
        legend: {},
        barWidth: '',
    };
    let xAxis =  flightClosingWaiting.xAxis;
    let series =  flightClosingWaiting.series;
    let colorList4 = [{ top: '#56DF95', bottom: '#3DC37A' }];
    let { unit, defaultGrid, title, legend, barWidth } =  state;
    let grid = { ...defaultGrid };
    let option = getBarMoreOption(xAxis, series, unit, grid, title, legend, barWidth, colorList4);
    return option;
}