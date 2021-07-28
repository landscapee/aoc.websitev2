// 离港速率

function getLineOptionLG(xData, yData) {
     let colorList = [{ name: '01', color: '#00CAD2' }, { name: '02', color: '#0566FF' }, { name: '11', color: '#3DC37A' }, { name: 'all', color: '#0566FF' }, { name: '01', color: '#37B6F9' }, { name: '02', color: '#6236FF' }, { name: '11', color: '#3280E7' }, { name: 'all', color: '#8D61F2' }];

    let option = null;
    let tooltip = '离港速率变化曲线图';
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
        itemGap: 20,
        textStyle: {
            color: '#FFFFFF',
            fontSize: 12,
        },
    };
    let seriesOptions = yData.map((item, i) => {
        return {
            name: item.runway,
            type: 'line',
            data: item.data,
            symbolSize: 1,
            symbol: 'circle',
            smooth: true,
            yAxisIndex: 0,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 2,
                    color: colorList[i].color,
                },
            },
            itemStyle: {
                normal: {
                    color: colorList[i].color,
                    borderColor: colorList[i].color,
                },
            },
        };
    });
    option = {
        // backgroundColor: '#19253C',
        title: { ...defaultTitle },
        legend: { ...defaultLegend },
        tooltip: {
            show: true,
            trigger: 'axis',
            borderColor: 'rgba(50,50,50,0.7)',
            backgroundColor: 'rgba(50,50,50,0.7)',
            axisPointer: {
                type: 'shadow',
            },
            // formatter: function(value) {
            // 	console.log(value);
            // 	let color = '#3275FB';
            // 	return `${tooltip}<br/>
            //                 <span style="color:${color};">   ● </span>${value[0].seriesName}:${value[0].value}`;
            // },
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
            top: 60,
            left: 50,
            right: 40,
            bottom: 20,
        },
        xAxis: [
            {
                type: 'category',
                data: xData,
                name: '时',
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
                },
            },
        ],
        yAxis: [
            {
                type: 'value',
                min: 0,
                name: '速率（架次/小时）',
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
        series: seriesOptions,
    };
    return option;
}
export const getOptionsLG = (flightAtdRate) => {

    let xDataD = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    let yDataD = [
        //
        { runway: '01跑道', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { runway: '02跑道', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { runway: '11跑道', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { runway: '全部跑道', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    ];
    let hours, rates;
    if (flightAtdRate&& flightAtdRate.hours) {
        hours =  flightAtdRate.hours;
        rates =  flightAtdRate.rates;
    } else {
        hours = xDataD;
        rates =  yDataD;
    }
    let option = getLineOptionLG(hours, rates);
    return option;
};


// 除冰趋势图
function getLineOptionCB(xData, yData) {
       let colorList = [{ name: '01', color: '#00CAD2' }, { name: '02', color: '#0566FF' }, { name: '11', color: '#3DC37A' }, { name: 'all', color: '#FFFFFF' }, { name: '01', color: '#37B6F9' }, { name: '02', color: '#6236FF' }, { name: '11', color: '#3280E7' }, { name: 'all', color: '#8D61F2' }];

    let option = null;
    let tooltip = '除冰趋势图';
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
        itemGap: 20,
        textStyle: {
            color: '#FFFFFF',
            fontSize: 12,
        },
    };
    let seriesOptions = yData.map((item, i) => {
        return {
            name: item.name,
            type: 'line',
            data: item.data,
            symbolSize: 1,
            symbol: 'circle',
            smooth: true,
            yAxisIndex: 0,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 2,
                    color: colorList[i].color,
                },
            },
            itemStyle: {
                normal: {
                    color: colorList[i].color,
                    borderColor: colorList[i].color,
                },
            },
        };
    });
    option = {
        // backgroundColor: '#19253C',
        title: { ...defaultTitle },
        legend: { ...defaultLegend },
        tooltip: {
            show: true,
            trigger: 'axis',
            borderColor: 'rgba(50,50,50,0.7)',
            backgroundColor: 'rgba(50,50,50,0.7)',
            axisPointer: {
                type: 'shadow',
            },
            // formatter: function(value) {
            // 	console.log(value);
            // 	let color = '#3275FB';
            // 	return `${tooltip}<br/>
            //                 <span style="color:${color};">   ● </span>${value[0].seriesName}:${value[0].value}`;
            // },
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
            top: 60,
            left: 50,
            right: 40,
            bottom: 20,
        },
        xAxis: [
            {
                type: 'category',
                data: xData,
                name: '时',
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
                },
            },
        ],
        yAxis: [
            {
                type: 'value',
                min: 0,
                name: '速率（架次/小时）',
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
        series: seriesOptions,
    };
    return option;
}
export const getOptionsCB = (yData,xData,) => {
    let xDataD = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    let yDataD = [
        //
        {runway: '01跑道', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
        {runway: '02跑道', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
        {runway: '11跑道', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
        {runway: '全部跑道', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    ];
    let hours =   xData ||  xDataD;
    let rates =  yData ||  yDataD;
    let option = getLineOptionCB(hours, rates);
    // console.log(yData || yDataD);
    return option;
};


