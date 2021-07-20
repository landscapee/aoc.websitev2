<template>
	<!--通行能力-->
	<div class="box">
		<div class="title">
			<div class="shuxian"></div>
			<div class="text">{{titleStatus?'通行能力':'动态时段'}} </div>
			<span class="cursor" @click="qiehuanSeat">
				<icon-svg iconClass="qiehuan"></icon-svg>
			</span>
			<span class="tishi" v-show="titleStatus">点击柱状图修改数据</span>
		</div>
		<div class="content">
			<!--通行能力-->
			<div v-show="titleStatus" class="echarts" ref="echarts"></div>
			<!--动态时段-->
			<div v-show="!titleStatus" class="tableBox1" >
				<ele-table :columnConfig=" tableConfig"  :table-data="tableData">

				</ele-table>
			</div>
		</div>
		<EditEcharts ref="EditEcharts"></EditEcharts>
	</div>
</template>

<script>
	import EditEcharts from './editEcharts'
    import {debounce} from '@/ui/lib/common.js'
	import {cloneDeep,map,get} from 'lodash'
    import * as echarts from 'echarts'
	import {timeRangeConfig} from './help'
    export default {
        name: "trafficCapacity",
        components: {EditEcharts},
		props:['optionsEC','tableData'],
        data() {
            return {
                titleStatus: true,
                tableConfig: timeRangeConfig,
                echartsInstance: null,
            }
        },
        watch:{
            optionsEC:{
                handler(n){
                    this.setOptions()
                },
                deep:true
            }
        },
        methods: {
            qiehuanSeat(){
                this.titleStatus=!this.titleStatus
			},
            getOptions (data){
                let obj=  {
                    xAxis: map(new Array(23), (item, index) => index + 1),
                        series: [{ name: '已延误航班统计', data: [] }],
                    unit: '数量（架次）',
                    defaultGrid: { right: 10, top: 20 },
                    title: {},
                    legend: {},
                    barWidth: 13,
                };
                let xAxis, series;
                xAxis =data.xAxis || obj.xAxis;
                series = data.series || obj.series;
                let colorList2 = [{ top: '#4CA1E2', bottom: '#3490FF' }];
                let { unit, defaultGrid, title, legend, barWidth } = obj;
                let grid = { ...defaultGrid,  right: 10, top: 40};
                let option = this.getBarMoreOption(xAxis, series, unit, grid, title, legend, barWidth, colorList2, 24, {
                    show: true,
                    fontSize: 14,
                    fontWeight: 400,
                    color: '#fff',
                    position: 'top',
                });
                return option;
            },
            setOptions( ) {
                 if(this.echartsInstance&&this.optionsEC&&Object.keys(this.optionsEC).length){
                   let options= this.getOptions(this.optionsEC)
                     this.echartsInstance.setOption(options)
                }

            },
            resizeEcharts(){
                let timer=debounce(()=>{
                    this.$nextTick(()=>{
                        this.echartsInstance.resize();
                    })
				},180)
				return timer
            },
            getBarMoreOption(xData, yData, unit, grid, title, legend, barWidth, colorList, xAxisName, dataLabel) {
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
                xDATA && xDATA.push('');
                xDATA && xDATA.unshift('');
                var xData2 = cloneDeep(xData);
                xData2 && xData2.unshift('');
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
                                interval: 0,
                            },
                        },
                        {
                            show: false,
                            boundaryGap: true,
                            type: 'category',
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
                    series: yDataSeries,
                };
                return option;
            }
		},
        created() {
        },
		mounted(){
        	let echartsEle=this.$refs.echarts
            // console.log(echartsEle);
            this.echartsInstance=echarts.init(echartsEle)

            this.setOptions()
            this.echartsInstance.on('click',   (params) =>{
                 this.$refs.EditEcharts.open(params.data,params.dataIndex)
            });
            window.addEventListener('resize',this.resizeEcharts())

		},
        beforeDestroy(){
            this.echartsInstance.dispose()
            window.removeEventListener('resize',this.resizeEcharts())
        }

    }
</script>

<style lang="scss" scoped>
	.box {
		height: 100%;
		background: rgba(25, 37, 60, 0.8);
		border-radius: 5px;
		padding: 10px 15px;
		.title {
			font-size: 14px;
			font-family: MicrosoftYaHei-Bold;
			display: flex;
			align-items: center;
			.shuxian {
				margin-right: 8px;
				width: 4px;
				height: 14px;
				background: #0566ff;
				border-radius: 1px;
			}
			.cursor{
				margin: 0 15px 0 7px;
				svg {
					fill: #f78501 !important;
				}
			}
			.tishi{
				color: #666;
			}

		}
		.content{
			width: 100%;
			height: calc(100% - 10px);
 			.echarts{
				width: 100%;
				height: 100%;
			}
		}

	}
	.tableBox1 {
		margin-top: 15px;
		width: 100%;
		height: calc(100% - 10px);
		position: relative;
		::v-deep .cell {
			font-size: 12px !important;
			font-weight: 400;
			/*font-family: FjallaOne !important;*/
			padding: 0 2px !important;
			*{
				font-size: 12px !important;
				/*font-family: FjallaOne !important;*/
			}

		}

	}
</style>