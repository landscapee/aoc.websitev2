import {cloneDeep, get} from 'lodash';

// xData,yData,yData2,
export function getBarLineOption({xData = [], yData = [], yData2 = [], usableList = [], disabledList = [], actSurplusList = [], planSurplusList = [], tooltipName}) {
    //usableList可用 disabledList不可用 actSurplusList实际空余 planSurplusList预计空余
    // let xData = ['0030', '0130', '0230', '0330', '0430', '0530', '0630', '0730', '0830', '0930', '1030', '1130', '1230', '1330', '1430', '1530', '1630', '1730', '1830', '1930', '2030', '2130', '2230', '2330'];
    // // /实际预计
    // let yData = [
    // 	//
    // 	{ name: '实际', data: [10, 2, 1, 25, 4, 7, 8, 8, 6, 5, 8, 7, 9, 5, 6, 7, 12, 45, 32, 45, 9, 5, 6, 7] },
    // 	{ name: '预计', data: [5, 1, 0, 10, 2, 7, 4, 4, 3, 5, 10, 12, 15, 2, 3, 3, 10, 40, 30, 4, 5, 10, 12, 12] },
    // ];
    // // 实际占有预计占用
    // let yData2 = [
    // 	//
    // 	{ name: '实际', data: [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45] },
    // 	{ name: '预计', data: [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45] },
    // ];

    let defaultColorList = [
        //
        {top: '#0C9FFF', bottom: '#0566FF'},
        {top: '#25E0E7', bottom: '#00CAD2'},
        {top: '#56DF95', bottom: '#3DC37A'},
        {top: '#56BFE2', bottom: '#3399D4'},
        {top: '#97EBFF', bottom: '#6DE3FF'},
        {top: '#0C9FFF', bottom: '#0566FF'},
    ];
    let xDATA = cloneDeep(xData);
    xDATA.push('');
    xDATA.unshift('');
    let xData2 = cloneDeep(xData);
    xData2.unshift('');
    //实际预计
    let yDataSeries =
        yData &&
        yData.map((item, i) => {
            return {
                type: 'bar',
                zlevel: 2,
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
                                color: defaultColorList[i].top,
                            },
                            {
                                offset: 1,
                                color: defaultColorList[i].bottom,
                            },
                        ],
                    },
                },
                xAxisIndex: 1,
                z: 1,
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
                barWidth: 10,
                //barMinHeight: 10,
            };
        });
    //实际占有预计占用
    let yDataSeries2 = yData2.map((item, i) => {
        return {
            type: 'bar',
            zlevel: 1,
            z: 0,
            name: item.name,
            itemStyle: {
                normal: {
                    color: '#19253c',
                    borderWidth: 1,
                    borderType: 'dashed',
                    borderColor: '#30343b',
                    barBorderRadius: [30, 30, 0, 0],
                },
            },
            xAxisIndex: 3,
            data: item.data,
            barWidth: 10,
            //barMinHeight: 10,
        };
    });
    let option = {
        grid: {
            top: 20,
            left: 20,
            right: 20,
            bottom: 10,
            containLabel: true,
        },
        legend: {
            show: false,
            icon: 'square',
            orient: 'horizontal',
            top: '0.5%',
            right: 20,
            itemGap: 20,
            textStyle: {
                color: '#FFFFFF',
                fontSize: 12,
            },
        },
        tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {
                type: 'none',
            },
            backgroundColor: 'none',
            formatter: function (value) {
                //实际占用率==实际占用/可用
                //预计占用率==预计占用/可用
                if (value && usableList) {
                    let title = value[0].dataIndex === 0 ? '0000-' + xData[value[0].dataIndex] : xData[value[0].dataIndex - 1] + '-' + xData[value[0].dataIndex];
                    let actualRate = usableList[value[0].dataIndex] === 0 ? 0 : Math.round((value[0].value / usableList[value[0].dataIndex]) * 100); //实际占用率
                    let planeRate = usableList[value[0].dataIndex] === 0 ? 0 : Math.round((value[1].value / usableList[value[1].dataIndex]) * 100); //预计占用率
                    return `
	<div style='background:#25395C;width:276px;height:147px;border-radius:5px;padding-top:9px'>
						<div style='padding:0 9px;height:25px;line-height:25px;text-align:left;margin-bottom:5px'><span style='padding:2px 5px;background: #357ad7;border-radius: 2px;font-size: 12px;'>${title}</span></div>
						<div style='margin-bottom:5px;padding:0 9px;height:25px;line-height:25px;text-align:left;color:#7286ac'>
							<span style='padding-right:10px;text-align:left'>${tooltipName} ${value[3].value}</span>
							<span style='padding:0 10px;border-right:1px solid #7286ac;border-left:1px solid #7286ac'>可用 ${usableList[value[0].dataIndex]}</span>
							<span style='padding-left:10px;'>不可用 ${disabledList[value[0].dataIndex]}</span>
						</div>
						<div style='padding:0 9px;width:100%;border-top:1px dashed #7286ac;display:flex;justify-content:space-between;color: #7286ac;font-size: 12px;height:calc(100% - 60px)'>
							<div style='width:50%;border-right:1px dashed #7286ac;padding-right:9px'>
								<div style='display:flex;justify-content: space-between;'><div style='text-align:left;width:80px'>实际占用</div><div style='text-align:left'>${value[0].value}</div></div>
								<div style='display:flex;justify-content: space-between;'><div style='text-align:left;width:80px'>实际空余</div><div style='text-align:left'>${actSurplusList[value[0].dataIndex]}</div></div>
								<div style='display:flex;justify-content: space-between;'><div style='text-align:left;width:80px'>实际占用率</div><div style='text-align:left'>${actualRate}%</div></div>
							</div>
							<div style='width:50%;padding-left:9px'>
								<div style='display:flex;justify-content: space-between;'><div style='text-align:left;width:80px'>预计占用</div><div style='text-align:left'>${value[1].value}</div></div>
								<div style='display:flex;justify-content: space-between;'><div style='text-align:left;width:80px'>预计空余</div><div style='text-align:left'>${planSurplusList[value[0].dataIndex]}</div></div>
								<div style='display:flex;justify-content: space-between;'><div style='text-align:left;width:80px'>预计占用率</div><div style='text-align:left'>${planeRate}%</div></div>
							</div>
						</div>
					</div>
				`;
                }

            },
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
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: xDATA,
                name: '时间',
                nameLocation: 'center',
                nameTextStyle: {
                    fontSize: 12,
                    color: '#7286AC',
                    padding: [-7, 0, 0, 1115],
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
                boundaryGap: true,
                type: 'category',
                data: xData2,
            },
            {
                show: false,
                boundaryGap: true,
                type: 'category',
                max: xData2.length * 100,
                data: xData2,
            },
            {
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
                name: '数量',
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
                    show: false,
                    lineStyle: {
                        color: '#30343B',
                        type: 'dashed',
                    },
                },
                show: true,
            },
        ],
        series: [
            ...yDataSeries2,
            ...yDataSeries,
            {
                xAxisIndex: 2,
                name: '实际',
                type: 'line',
                zlevel: 3,
                z: 2,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            color: '#ffc700',
                            type: 'solid',
                        },
                    },
                },
                data: get(yData, '0.data'),
            },
            {
                xAxisIndex: 2,
                name: '预计',
                type: 'line',
                zlevel: 3,
                z: 2,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            color: '#aa4bff',
                            type: 'solid',
                        },
                    },
                },
                data: get(yData, '1.data'),
            },
        ],
    };
    option.series[4] ? option.series[4].data = get(option, 'series.4.data', []).map((x, i) => [38 + i * 100, x]) : '';
    option.series[5] ? option.series[5].data = get(option, 'series.5.data', []).map((x, i) => [68 + i * 100, x]) : "";
    return option;
}
