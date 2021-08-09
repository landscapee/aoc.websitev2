

export const setting_columnConfig = [
	{
		key: 'adjust',
		label: '调整/调减',
		width: '70px',
		nullValue: '-',
	},
	{
		key: 'total',
		label: '总数',
		width: '60px',
		nullValue: '-',
	},
	{
		key: 'CA',
		label: '国航',
		width: '60px',
		nullValue: '-',
	},
	{
		key: '3U',
		label: '川航',
		width: '60px',
		nullValue: '-',
	},
	{
		key: 'MU',
		label: '东航',
		width: '60px',
		nullValue: '-',
	},
	{
		key: 'CZ',
		label: '南航',
		width: '60px',
		nullValue: '-',
	},
	{
		key: 'EU',
		label: '成航',
		width: '60px',
		nullValue: '-',
	},
	{
		key: '8L',
		label: '祥鹏',
		width: '60px',
		nullValue: '-',
	}
]

export const recommend_columnConfig = [
	{
		key: 'airline',
		label: '航司',
	},
	{
		key: 'R',
		label: '计划调减',
		display: ({ row }, that) => {
			if (that.showInput == `R${row.airline}` && row.airline != '全部') {
				window.decRecommendInputHandle = that.decRecommendInputHandle(row, 'R')
				return `<input value="${row.R}" class="tableInput" onchange="decRecommendInputHandle(this)"/>`
			} else {
				return row.R
			}
		},
		click: ({ row },that) => {
			if (
				!that.$hasRole('edit-handle-suggest', false) ||
				row.airline === '全部' ||
				row.sendType !== 0
			) {
				return
			}

			that.showInput = `R${row.airline}`
		},
	},
	{
		key: 'A',
		label: '计划调整',
		display: ({ row },that) => {
			if (that.showInput == `A${row.airline}` && row.airline != '全部') {
				window.decRecommendInputHandle = that.decRecommendInputHandle(row, 'A')
				return `<input value="${row.A}" class="tableInput" onchange="decRecommendInputHandle(this)"/>`
			} else {
				return row.A
			}
		},

		click: ({ row },that) => {
			if (
				!that.$hasRole('edit-handle-suggest', false) ||
				row.airline === '全部' ||
				row.sendType !== 0
			) {
				return
			}
			that.showInput = `A${row.airline}`
		},
	},
	{
		key: '',
		type: 'operate',
		label: '操作',
		operates: [
			{
				display: () => {
					return '<i class="iconfont icon-fasong"></i>'
				},
				disabled: ({ row },that) => {
					let result = false
					let hasFinish = _.get(that.currentReduce, 'reduceInfo.status') == 1

					if (row.airline === '全部') {
						let arrs = that.tableData.filter((item) => {
							return item.sendType == '0' && item.airline !== '全部'
						})
						if (arrs.length > 0) {
							row.sendType = 0
						} else {
							row.sendType = 1
						}
					}

					if (
						!that.$hasRole('edit-handle-suggest', false) ||
						row.sendType != 0 ||
						hasFinish
					) {
						result = true
					}
					return result
				},
				click: ({ row },that) => {
					that.rowSend(row)
				},
			},
		],
	},
]

export const flightDecrease_columnConfig = [
	{ key: 'ind', label: '序号', type: 'index', width: '50px' },
	{
		key: 'flightNo',
		label: '航班号',
		width: '80px',
	},
	{
		key: '',
		label: '计划',
		width: '90px',
		display: ({ row },that) => {
			return row.scheduleTime?that.$moment(row.scheduleTime).format('HH:mm(DD)'):'--'
		},
	},
	{
		key: 'airlineCnName',
		label: '航司',
		width: '160px',
	},
	{
		key: 'flightType',
		label: '航班类型',
		width: '80px',
	},
	{
		key: '',
		label: '航线',
		display: ({ row }) => {
			return row.displayRouter?row.displayRouter.join('-'):'--'
		},
	},
	{
		key: 'flightIndicator',
		label: '国际性质',
		width: '80px',
		display: ({ row },that) => {
			return that.getFlightIndicator[row.flightIndicator]
				? that.getFlightIndicator[row.flightIndicator]
				: '其他'
		},
	},
]

export const sureDecrease_columnConfig2 =[
	{
		key: 'flightNo',
		label: '航班号',
		width: '80px',
	},
	{
		key: '',
		label: '计划时间',
		width: '90px',
		display: ({ row },that) => {
			return row.scheduleTime
				? that.$moment(row.scheduleTime).format('HH:mm(DD)')
				: '--'
		},
	},
	{
		key: '',
		label: '航线',
		display: ({ row }) => {
			return row.displayRouter ? row.displayRouter.join('-') : '-'
		},
	},
	{
		key: 'flightType',
		label: '航班类型',
		width: '90px',
	},
]
			
export const sureDecrease_columnConfig1 =[
	{
		key: 'flightNo',
		label: '航班号',
		width: '80px',
	},
	{
		key: '',
		label: '计划时间',
		width: '90px',
		display: ({ row },that) => {
			return row.scheduleTime
				? that.$moment(row.scheduleTime).format('HH:mm(DD)')
				: '--'
		},
	},
	{
		key: '',
		label: '航线',
		display: ({ row }) => {
			return row.displayRouter ? row.displayRouter.join('-') : '--'
		},
	},
	{
		key: '',
		label: '调后时刻',
		width: '90px',
		display: ({ row }, that) => {
			return row.updateScheduleTime
				? that.$moment(row.updateScheduleTime).format('HH:mm(DD)')
				: '--'
		},
	},
]

export const decreaseDialog_columnConfig1 = [
	{
		key: '',
		label: '时段',
		display: ({ row },that) => {
			return `${row.startTime}-${row.endTime}`
		},
	},
	{
		key: 'maxTotal',
		label: '起降',
		display: ({ row,$index }, that) => {
			if (that.editShow) {
				return `<input value="${row.maxTotal}" class="tableInput" onchange="coordinateArgChange(this,'tableData',${$index},'maxTotal')"/>`
			} else {
				return row.maxTotal
			}
		},
	},
	{
		key: '',
		label: '*110%',
		display: ({ row },that) => {
			return `${parseInt((row.maxTotal|| 0) * 1.1)}`
		},
	},
	{
		key: 'maxOff',
		label: '起飞',
		display: ({ row,$index }, that) => {
			if (that.editShow) {

				return `<input value="${row.maxOff}" class="tableInput" onchange="coordinateArgChange(this,'tableData',${$index},'maxOff')"/>`
			} else {
				return row.maxOff
			}
		},
	},
	{
		key: '',
		label: '*110%',
		display: ({ row },that) => {
			return `${parseInt((row.maxOff|| 0) * 1.1)}`
		},
	},
	{
		key: 'maxOn',
		label: '降落',
		display: ({ row,$index }, that) => {
			if (that.editShow) {
				return `<input value="${row.maxOn}" class="tableInput" onchange="coordinateArgChange(this,'tableData',${$index},'maxOn')"/>`
			} else {
				return row.maxOn
			}
		},
	},
	{
		key: '',
		label: '*110%',
		display: ({ row },that) => {
			return `${parseInt((row.maxOn|| 0) * 1.1)}`
		},
	},
	{
		key: '',
		type: 'operate',
		label: '操作',
		show: (that) => {
			return that.editShow
		},
		operates: [
			{
				btnType:'primary',
				display: ({ $index }) => {
					if ($index==0) {
						return ''
					}
					return '同上'
				},
				click: ({ row, $index }, that) => {
					let prevData = that.tableData[$index-1]
					row.maxOff = prevData.maxOff
					row.maxOn = prevData.maxOn
					row.maxTotal = prevData.maxTotal
					// console.log(row,$index)
				},
			},
		],
	},
]

export const decreaseDialog_columnConfig2 = [
	{
        slot: 'week'

    },
	{
		key: '',
		label: '时段',
		display: ({ row,$index },that) => {
			if (that.editShow) {
				return `<input value="${row.startTime}-${row.endTime}" class="tableInput" onchange="coordinateArgChange(this,'special',${$index},'time')"/>`
			} else {
				return `${row.startTime}-${row.endTime}`
			}
		},
	},
	{
		key: 'maxTotal',
		label: '起降',
		display: ({ row,$index }, that) => {
			if (that.editShow) {
				return `<input value="${row.maxTotal}" class="tableInput" onchange="coordinateArgChange(this,'special',${$index},'maxTotal')"/>`
			} else {
				return row.maxTotal
			}
		},
	},
	{
		key: '',
		label: '*110%',
		display: ({ row },that) => {
			return `${parseInt((row.maxTotal|| 0) * 1.1)}`
		},
	},
	{
		key: 'maxOff',
		label: '起飞',
		display: ({ row,$index }, that) => {
			if (that.editShow) {
				return `<input value="${row.maxOff}" class="tableInput" onchange="coordinateArgChange(this,'special',${$index},'maxOff')"/>`
			} else {
				return row.maxOff
			}
		},
	},
	{
		key: '',
		label: '*110%',
		display: ({ row },that) => {
			return `${parseInt((row.maxOff|| 0) * 1.1)}`
		},
	},
	{
		key: 'maxOn',
		label: '降落',
		display: ({ row,$index}, that) => {
			if (that.editShow) {
				return `<input value="${row.maxOn}" class="tableInput" onchange="coordinateArgChange(this,'special',${$index},'maxOn')"/>`
			} else {
				return row.maxOn
			}
		},
	},
	{
		key: '',
		label: '*110%',
		display: ({ row },that) => {
			return `${parseInt((row.maxOn|| 0) * 1.1)}`
		},
	},
	{
		key: '',
		type: 'operate',
		label: '操作',
		show: (that) => {
			return that.editShow
		},
		operates: [
			{
				btnType:'primary',
				display: ({ row },that) => {
					return '删除'
				},
				click: ({ row,$index }, that) => {
					console.log(row)
					that.special.splice($index,1)
				},
			},
		],
	},
]	

export const flightDelayOptions= function(
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
	totalData,
	that
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
				let lastTime = that.$moment()
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
}

