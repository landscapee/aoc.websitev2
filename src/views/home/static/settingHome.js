import { get, set, filter, orderBy, countBy, take, map, each, has, toUpper, size, extend } from 'lodash';
import Airports from './data/airports.json';

const getMinus = (v) => {
	return {
		y: v === 0 ? v : -v,
		className: 'shadowBlue',
	};
};
const getValue = (v) => {
	return {
		y: v,
		className: 'shadowBlue',
	};
};

const chartColor = { linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 }, stops: [[0, '#00DFFF'], [1, '#004EFF']] };
const chartColor1 = { linearGradient: { x1: 0, x2: 0, y1: 1, y2: 0 }, stops: [[0, '#0566FF'], [1, '#0C9FFF']] };
const chartColorRed = { linearGradient: { x1: 0, x2: 0, y1: 1, y2: 0 }, stops: [[0, '#BF0B23'], [1, '#ff0002']] };
const chartColorOrg = { linearGradient: { x1: 0, x2: 0, y1: 1, y2: 0 }, stops: [[0, '#ff7300'], [1, '#ffa517']] };
const chartColorYellow = { linearGradient: { x1: 0, x2: 0, y1: 1, y2: 0 }, stops: [[0, '#d99c00'], [1, '#ffd700']] };
const chartColor2 = { linearGradient: { x1: 0, x2: 0, y1: 1, y2: 0 }, stops: [[0, '#00CD49'], [1, '#009F23']] };
// #0576E3 0% hex
// #00CD48 100% hex
// #009F23 100% hex
// #0576E3 0%
//linear-gradient(90deg,rgba(5,118,227,0) 0%,rgba(12,157,255,1) 21%,rgba(5,102,255,1) 81%,rgba(5,118,227,0) 100%);
const chartColor3 = { linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 }, stops: [[0, 'rgba(5,118,227,0)'], [0.2, '#00CD48'], [0.8, '#009F23'], [1, 'rgba(5,118,227,0)']] };
// #0576E3 0% hex
// #0C9DFF 100% hex
// #0566FF 100% hex
// #0576E3
const chartColor4 = { linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 }, stops: [[0, 'rgba(5,118,227,0)'], [0.2, '#0C9DFF'], [0.8, '#0566FF'], [1, 'rgba(5,118,227,0)']] };
const chartOptions = {
	chart: {
		backgroundColor: 'transparent',
		type: 'solidgauge',
	},
	//colors: ['#4169d2', '#9DFF02', '#0CCDD6'],
	tooltip: {
		enabled: false,
	},
	// defs: {
	// 	glow: {
	// 		tagName: 'filter',
	// 		id: 'glow',
	// 		opacity: 0.5,
	// 		children: [
	// 			{
	// 				tagName: 'feGaussianBlur',
	// 				result: 'coloredBlur',
	// 				stdDeviation: 2.5,
	// 			},
	// 			{
	// 				tagName: 'feMerge',
	// 				children: [
	// 					{
	// 						tagName: 'feMergeNode',
	// 						in: 'coloredBlur',
	// 					},
	// 					{
	// 						tagName: 'feMergeNode',
	// 						in: 'SourceGraphic',
	// 					},
	// 				],
	// 			},
	// 		],
	// 	},
	// },
	pane: {
		startAngle: 0,
		endAngle: 360,
		background: [
			{
				outerRadius: '102%',
				innerRadius: '91%',
				backgroundColor: '#eef2f9',
				borderWidth: 0,
			},
		],
	},
	plotOptions: {
		solidgauge: {
			dataLabels: {
				y: -30,
				borderWidth: 0,
				useHTML: true,
			},
			linecap: 'round',
			stickyTracking: false,
			rounded: true,
			//borderColor: 'rgba(12, 159, 255, 0.1)',
			//borderColor: { linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 }, stops: [[0, 'rgba(12, 159, 255,0)'], [1, 'rgba(12, 159, 255, 0.5)']] },
			//borderColor: { radialGradient: { cx: '50%', cy: '50%', r: '50%', fx: '50%', fy: '50%' }, stops: [[0, 'rgba(255, 255, 255,0)'], [0.5, 'rgba(12, 159, 255, 1)'], [1, 'rgba(255, 255, 255, 0)']] },
			borderWidth: 5,
		},
	},
	yAxis: {
		min: 0,
		max: 100,
		lineWidth: 0,
		tickPositions: [],
	},
	title: false,
	exporting: { enabled: false }, //隐藏导出图片
	credits: { enabled: false },
};
const chartOptionsByHour = {
	chart: {
		backgroundColor: 'transparent',
	},
	//colors: ['#049175', '#074e7a', '#049175', '#074e7a'],
	tooltip: {
		crosshairs: [true],
		// valueSuffix: '架次',
		shared: true,
		formatter: function() {
			let s = `<b>${this.x}点</b>`;
			let self = this;
			map(self.points, function(point) {
				if (point.series.name.indexOf('计划') > -1) {
					s += `<br/><div><span style="color:${point.color}">- </span><span style="color:#666;">${point.series.name}</span> : <span style="font-family:'Fjalla One';color:${point.color}">${Math.abs(point.y)}</span><span style="color:#666;">架次</span></div>`;
				} else if (point.series.name.indexOf('率') > -1) {
					s += `<br/><div><span style="color:${point.color}">● </span><span style="color:#666;">${point.series.name}</span> : <span style="font-family:'Fjalla One';color:${point.color}">${Math.abs(point.y)}(${point.point.name})</span><span style="color:#666;">%</span></div>`;
				} else {
					s += `<br/><div><span style="color:${point.color}">● </span><span style="color:#666;">${point.series.name}</span> : <span style="font-family:'Fjalla One';color:${point.color}">${Math.abs(point.y)}</span><span style="color:#666;">架次</span></div>`;
				}
			});
			return s;
		},
	},
	//title: { text: '今日航班实时运行情况', align: 'left' },
	title: false,
	xAxis: {
		//categories: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, ' 4 '],
		categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0],
		//tickmarkPlacement: 'on',
		title: {
			enabled: false,
		},

		gridLineWidth: 1,
		gridLineColor: '#d8d6d6', //Dot
		gridLineDashStyle: 'Dot',
		// minorTickInterval: 'auto',
		// minorTicks: true,
		// minorTickWidth: 1,
		// startOnTick: false,
		// endOnTick: false,
		lineWidth: 0,
		labels: {
			align: 'center',
		},
	},
	yAxis: [
		{
			title: {
				enabled: false,
			},
			gridLineWidth: 1,
			gridLineColor: '#d8d6d6', //Dot
			gridLineDashStyle: 'Dot',
			startOnTick: false,
			endOnTick: false,
			minorTickWidth: 0,
			lineWidth: 0,
			tickInterval: 20,
			labels: {
				formatter: function() {
					return Math.abs(this.value);
				},
			},
		},
		{
			title: {
				text: '',
			},
			minPadding: 0,
			maxPadding: 0,
			max: 100,
			min: 0,
			opposite: true,
			labels: {
				format: '{value}%',
			},
		},
	],
	plotOptions: {
		column: {
			//pointPlacement: 0.5,
			//stacking: 'normal',
			grouping: false,
			borderWidth: 0,
			//borderRadius: 2,

			pointWidth: 14,
			//groupPadding: 1,
			dataLabels: {
				enabled: true,
				//allowOverlap: true,
				color: 'white',
				inside: true,
				//align: 'bottom',
				// borderColor: 'rgba(5,104,255,0.6)',
				// borderRadius: 1,
				// borderWidth: 0,
				//x: -0.5,
				//y: 40,
				style: {
					fontSize: '0.625rem',
					fontWeight: 'light',
					textOutline: '1px 1px rgba(5,104,255,0.6)',
					fontFamily: 'Fjalla One',

					// paintOrder: 'stroke',
					// stroke: '#0568FF',
					// strokeWidth: '1px',
					// strokeLinecap: 'butt',
					// strokeLinejoin: 'miter',
				},
				verticalAlign: 'bottom',
				formatter: function(data) {
					let v = Math.abs(this.y);
					return v ? v : '';
				},
			},
		},
		areaspline: {
			//pointPlacement: 0.5,
			//stacking: 'normal',
			//lineColor: '#ffffff',
			lineWidth: 1,
			//fillOpacity: 0.25,
			marker: {
				radius: 2.5,
				lineColor: 'rgba(57, 125, 255, 0.2)',
				lineWidth: 3,
				symbol: 'circle',
				width: 5,
				height: 5,
			},
		},
	},
	legend: {
		align: 'right',
		verticalAlign: 'top',
		enabled: true,
		itemStyle: {
			color: '#666666',
			fontSize: '0.75rem',
			fontWeight: 'light',
		},
		// itemHoverStyle: {
		// 	color: '#666666',
		// },
		// itemHiddenStyle: {
		// 	color: '#6b6b6b',
		// },
	},
	exporting: { enabled: false }, //隐藏导出图片
	credits: { enabled: false },
};
/**
 * 当前运营日航班统计
 * totalPlan 总计划航班数
 * completedPlan 完成航班数
 * departurePlan 离港计划数
 * arrivalPlan 进港计划数
 * completedDeparturePlan 完成离港数
 * completedArrivalPlan 完成进港数
 * return 返航数
 * cancel 取消数
 * alternate 备降数
 * originatedTotal 始发总数
 * originatedDelay 始发延误数
 * departureTotal 航班正常总数
 * departureDelay 航班延误数
 * takeOffTotal 放行正常总数
 * takeOffDelay 放行延误数
 * morningBusyHourTotal 早高峰航班正常总数
 * morningBusyHourDelay 早高峰航班延误数
 */
export const settings = {
	totalPlan: {
		type: 'number',
		key: 'schedule',
		value: (data, type) => {
			return `${get(data, ['statType', type, 'schedule', 0], '')} / ${get(data, ['statType', type, 'schedule', 1], '')}`;
		},
		title: '今日计划',
	},
	passengerTransport: {
		type: 'number',
		key: 'passenger',
		value: (data, type) => {
			return `${get(data, ['statType', type, 'passenger', 0], '')} / ${get(data, ['statType', type, 'passenger', 1], '')}`;
		},
		title: '客运',
	},
	cargo: {
		type: 'number',
		key: 'cargo',
		value: (data, type) => {
			return `${get(data, ['statType', type, 'cargo', 0], '')} / ${get(data, ['statType', type, 'cargo', 1], '')}`;
		},
		title: '货运',
	},
	arrival: {
		type: 'number',
		key: 'in',
		value: (data, type) => {
			return `${get(data, ['statType', type, 'in', 0], '')} / ${get(data, ['statType', type, 'in', 1], '')}`;
		},
		title: '进港',
	},
	'yesterday-completed-flights': {
		type: 'number',
		value: (data) => {
			return `${get(data, 'yesterdayCompletedFlights', '')}`;
		},
		title: '昨日执行架次',
	},
	departure: {
		type: 'number',
		key: 'out',
		value: (data, type) => {
			return `${get(data, ['statType', type, 'out', 0], '')} / ${get(data, ['statType', type, 'out', 1], '')}`;
		},
		title: '离港',
	},

	'yesterday-departure-passenger': {
		type: 'number',
		value: (data) => {
			return `${get(data, 'summary.passenger.departures', '')}`;
		},
		title: '昨日离港人数',
	},
	return: {
		type: 'number2',
		value: (data) => {
			return `${get(data, 'summary.return', '')}`;
		},
		title: '返航',
	},
	alternateInner: {
		type: 'number2',
		value: (data) => {
			return `${get(data, 'summary.alternate', '')}`;
		},
		title: '备降本场',
	},
	alternateOuter: {
		type: 'number2',
		value: (data) => {
			return `${get(data, 'summary.alternateOtherCity', '')}`;
		},
		title: '备降外场',
	},
	cancel: {
		type: 'number2',
		value: (data) => {
			return `${get(data, 'summary.cancel', '')}`;
		},
		title: '取消',
	},
	originatedDeparturePercent: {
		type: 'chart',
		title: '始发正常率',
		options: extend({}, chartOptions, {
			series: (data) => {
				//let count = get(data, 'percent.originatedDelay', 0);
				let count = get(data, 'percent.originatedNormal', 0);
				let total = get(data, 'percent.originatedTotal', 0);
				let value = null;
				if (count > 0 && total > 0 && count == total) {
					value = 100;
				} else if (total == 0) {
					value = 100;
				} else {
					value = Math.round((count * 10000) / total) / 100;
				}
				return [
					{
						name: '始发正常率',
						center: {},
						dataLabels: {
							format: `<div class="percentLabel"> {y}<span class="symbol">%</span> <div class="detail">{point.name}</div></div>`,
						},
						data: [
							{
								color: chartColor,
								radius: '106%',
								innerRadius: '89%',
								name: `${count}/${total}`,
								y: value,
								className: 'shadowBlue',
							},
						],
					},
				];
			},
		}),
	},
	departurePercent: {
		type: 'chart',
		title: '航班正常率',
		options: extend({}, chartOptions, {
			series: (data) => {
				let count = get(data, 'percent.departureNormal', 0);
				let total = get(data, 'percent.departureTotal', 0);
				let value = null;
				if (count > 0 && total > 0 && count == total) {
					value = 100;
				} else if (total == 0) {
					value = 100;
				} else {
					value = Math.round((count * 10000) / total) / 100;
				}
				return [
					{
						name: '航班正常率',
						dataLabels: {
							enabled: false,
							format: `<div class="percentLabel"> {y}<span class="symbol">%</span> <div class="detail">{point.name}</div></div>`,
						},
						data: [
							{
								color: chartColor,
								radius: '106%',
								innerRadius: '89%',
								name: `${count}/${total}`,
								y: value,
								className: 'shadowBlue',
							},
						],
					},
				];
			},
		}),
	},
	takeOffPercent: {
		type: 'chart',
		title: '放行正常率',
		options: extend({}, chartOptions, {
			series: (data, isEditing) => {
				let count = get(data, 'percent.takeOffNormal', 0);
				let total = get(data, 'percent.takeOffTotal', 0);
				let value = null;
				if (count > 0 && total > 0 && count == total) {
					value = 100;
				} else if (total == 0) {
					value = 100;
				} else {
					value = Math.round((count * 10000) / total) / 100;
				}
				return [
					{
						name: '放行正常率',
						dataLabels: {
							enabled: false,
							// format: `<div class="percentLabel"> {y}<span class="symbol">%</span> <div class="detail">{point.name}</div></div>`,
						},
						data: [
							{
								color: chartColor,
								radius: '106%',
								innerRadius: '89%',
								name: `${count}/${total}`,
								y: value,
								className: 'shadowBlue',
							},
						],
					},
				];
			},
		}),
	},
	arriveNormal: {
		type: 'chart',
		title: '进港正常率',
		options: extend({}, chartOptions, {
			series: (data) => {
				let count = get(data, 'percent.arriveNormalNormal', 0);
				let total = get(data, 'percent.arriveNormalTotal', 0);
				let value = null;
				if (count > 0 && total > 0 && count == total) {
					value = 100;
				} else if (total == 0) {
					value = 100;
				} else {
					value = Math.round((count * 10000) / total) / 100;
				}
				return [
					{
						name: '进港正常率',
						dataLabels: {
							format: `<div class="percentLabel"> {y}<span class="symbol">%</span> <div class="detail">{point.name}</div></div>`,
						},
						data: [
							{
								color: chartColor,
								radius: '106%',
								innerRadius: '89%',
								name: `${count}/${total}`,
								y: value,
								className: 'shadowBlue',
							},
						],
					},
				];
			},
		}),
	},
	// 放行正常率*70%+起飞正常率*30%
	departureNormal: {
		type: 'chart',
		title: '航班考核正常率',
		options: extend({}, chartOptions, {
			series: (data) => {
				let count = get(data, 'percent.departureNormalNormal', 0);
				let total = get(data, 'percent.departureNormalTotal', 0);
				let value = null;
				if (count > 0 && total > 0 && count == total) {
					value = 100;
				} else if (total == 0) {
					value = 100;
				} else {
					value = Math.round((count * 10000) / total) / 100;
				}
				return [
					{
						name: '航班考核正常率',
						dataLabels: {
							format: `<div class="percentLabel"> {y}<span class="symbol">%</span> <div class="detail">{point.name}</div></div>`,
						},
						data: [
							{
								color: chartColor,
								radius: '106%',
								innerRadius: '89%',
								name: `${count}/${total}`,
								y: value,
								className: 'shadowBlue',
							},
						],
					},
				];
			},
		}),
	},
	seatPercent: {
		type: 'chart',
		title: '机位占用率',
		options: extend({}, chartOptions, {
			series: (data) => {
				let count = get(data, 'percent.seatUsed', 0);
				let total = get(data, 'percent.seatTotal', 0);
				let value = null;
				if (count > 0 && total > 0 && count == total) {
					value = 100;
				} else if (total == 0) {
					value = 100;
				} else {
					value = Math.round((count * 10000) / total) / 100;
				}
				return [
					{
						name: '放行正常率',
						dataLabels: {
							format: `<div class="percentLabel"> {y}<span class="symbol">%</span> <div class="detail">{point.name}</div></div>`,
						},
						data: [
							{
								color: chartColor2,
								radius: '106%',
								innerRadius: '89%',
								name: `${count}/${total}`,
								y: value,
								className: 'shadowBlue',
							},
						],
					},
				];
			},
		}),
	},
	morningBusyHourPercent: {
		type: 'chart',
		title: '早高峰始发正常率',
		options: extend({}, chartOptions, {
			series: (data) => {
				let count = get(data, 'percent.morningBusyHourNormal', 0);
				let total = get(data, 'percent.morningBusyHourTotal', 0);
				let value = null;
				if (count > 0 && total > 0 && count == total) {
					value = 100;
				} else if (total == 0) {
					value = 100;
				} else {
					value = Math.round((count * 10000) / total) / 100;
				}
				return [
					{
						name: '早高峰航班正常率',
						dataLabels: {
							format: `<div class="percentLabel"> {y}<span class="symbol">%</span> <div class="detail">{point.name}</div></div>`,
						},
						data: [
							{
								color: chartColor,
								radius: '106%',
								innerRadius: '89%',
								name: `${count}/${total}`,
								y: value,
								className: 'shadowBlue',
							},
						],
					},
				];
			},
		}),
	},
	eta30min: {
		type: 'dataRows',
		title: 'ETA 30min',
		icon: 'fa-calendar-check-o',
		collection: (data) => {
			return get(data, 'eta30', []);
		},
		columns: [
			{
				name: 'flightNo',
				title: '航班号',
				font: 'font-One',
			},
			{
				name: 'aircraftNo',
				title: '机尾号',
				font: 'font-One',
			},
			{
				name: 'seat',
				title: '机位',
			},
			{
				name: 'displaySTAWithDate',
				title: '计划',
			},
			{
				name: 'displayMixEtaWithDate',
				title: '预达',
			},
			{
				name: 'runway',
				title: '跑道',
			},
		],
	},
	etaSelect: {
		type: 'dataRowsWithSelect',
		key: 'etaSelect',
		isSelect: true,
		checkedIndex: 2,
		// title: ['ETA 10min', 'ETA 20min', 'ETA 30min'],
		title: {
			'ETA 10min': 'eta10',
			'ETA 20min': 'eta20',
			'ETA 30min': 'eta30',
		},
		subtitle: ['test1', 'test2', 'test3'],
		options: ['eta10', 'eta20', 'eta30'],
		icon: 'fa-calendar-check-o',
		collection: (data, key) => {
			return get(data, key, []);
		},
		columns: [
			{
				name: 'index',
				title: '序号',
				font: 'font-One',
				width: '5rem',
			},
			{
				name: 'flightNo',
				title: '航班号',
				font: 'font-One',
			},
			{
				name: 'seat',
				title: '停机位',
			},
			{
				name: 'displayMixEtaWithDate',
				title: 'ETA',
			},
		],
	},
	direction: {
		type: 'mixinZone',
	},
	rate: {
		type: 'rate',
	},
	'delay-30min': {
		hide: true,
		type: 'dataRows',
		title: '延误 ( <= 30min)',
		collection: (now, summary, flights, seats) => {
			let flitered = filter(get(flights, '"0"'), (f) => {
				return !get(f, 'cancel') && get(f, 'delaySort') >= 0 && get(f, 'delaySort') < 30 * 60 * 100;
			});
			return orderBy(flitered, ['delaySort', 'std'], ['asc', 'asc']);
		},
		columns: [
			{
				name: 'flightNo',
				title: '航班号',
			},
			{
				name: 'displaySTD',
				title: '计划离港',
			},
			{
				name: 'displayGroundServicePlanLimit',
				title: '标准保障',
			},
		],
	},
	'delay-60min': {
		hide: true,
		type: 'dataRows',
		title: '延误 (30 ~ 60min)',
		collection: (now, summary, flights, seats) => {
			let flitered = filter(get(flights, '"0"'), (f) => {
				return !get(f, 'cancel') && get(f, 'delaySort') >= 30 * 60 * 1000 && get(f, 'delaySort') < 60 * 60 * 1000;
			});
			return orderBy(flitered, ['delaySort', 'std'], ['asc', 'asc']);
		},
		columns: [
			{
				name: 'flightNo',
				title: '航班号',
			},
			{
				name: 'displaySTD',
				title: '计划离港',
			},
			{
				name: 'displayGroundServicePlanLimit',
				title: '标准保障',
			},
		],
	},
	'delay-120min': {
		hide: true,
		type: 'dataRows',
		title: '延误 ( > 60min)',
		collection: (now, summary, flights, seats) => {
			let flitered = filter(get(flights, '"0"'), (f) => {
				return !get(f, 'cancel') && get(f, 'delaySort') > 60 * 60 * 1000;
			});
			return orderBy(flitered, ['delaySort', 'std'], ['asc', 'asc']);
		},
		columns: [
			{
				name: 'flightNo',
				title: '航班号',
			},
			{
				name: 'displaySTD',
				title: '计划离港',
			},
			{
				name: 'displayGroundServicePlanLimit',
				title: '标准保障',
			},
		],
	},
	totalDelayCity: {
		type: 'dataRowWith2Title',
		title: '到港延误城市|离港延误城市',
		collection: (data) => {
			return get(data, 'totalDelayCity', []);
		},
		columns: [
			{
				name: 'index',
				title: '序号',
				font: 'font-One',
				width: '10%',
			},
			{
				name: 'arrive',
				title: '城市',
				width: '30%',
			},
			{
				name: 'arriveNumber',
				title: '数量',
				width: '15%',
			},
			{
				name: 'departure',
				title: '城市',
				width: '30%',
			},
			{
				name: 'departureNumber',
				title: '数量',
				width: '15%',
			},
		],
	},
	'flight-courseReversal': {
		type: 'dataRows',
		title: '返航',
		collection: (data) => {
			return get(data, 'courseReversal', []);
		},
		columns: [
			{
				name: 'index',
				title: '序号',
				font: 'font-One',
				width: '5rem',
			},
			{
				name: 'flightNo',
				title: '航班号',
				font: 'font-One',
			},
			{
				name: 'seat',
				title: '停机位',
			},
			{
				name: 'displayMixEtaWithDate',
				title: '预计落地时间',
			},
		],
	},
	'flight-preparation': {
		type: 'dataRows',
		title: '备降',
		collection: (data) => {
			return get(data, 'preparation', []);
		},
		columns: [
			{
				name: 'index',
				title: '序号',
				font: 'font-One',
				width: '5rem',
			},
			{
				name: 'flightNo',
				title: '航班号',
				font: 'font-One',
			},
			{
				name: 'seat',
				title: '停机位',
			},
			{
				name: 'displayMixEtaWithDate',
				title: '预计落地时间',
			},
		],
	},
	'close-door-delay-60-to-90': {
		type: 'dataRows',
		title: '关舱门延误 ( 60min ~ 90min)',
		collection: (now, summary, flights, seats) => {
			let flitered = filter(get(flights, '"0"'), (f) => {
				return !get(f, 'cancel') && get(f, 'closeDoorDelaySort') >= 60 * 60 * 1000 && get(f, 'closeDoorDelaySort') < 90 * 60 * 1000;
			});
			return orderBy(flitered, ['closeDoorDelaySort', 'std'], ['asc', 'asc']);
		},
		columns: [
			{
				name: 'flightNo',
				title: '航班号',
			},
			{
				name: 'displaySTD',
				title: '计划',
			},
			{
				name: 'displayGroundServicePlanLimit',
				title: '标准保障',
			},
			{
				name: 'displayCloseDoorTime',
				title: '关舱门时间',
			},
			{
				name: 'lastMilestone.mileStoneName',
				title: '里程碑',
			},
		],
	},
	'close-door-delay-120': {
		type: 'dataRows',
		title: '关舱门延误 ( 120min )',
		collection: (now, summary, flights, seats) => {
			let flitered = filter(get(flights, '"0"'), (f) => {
				return !get(f, 'cancel') && get(f, 'closeDoorDelaySort') >= 120 * 60 * 1000;
			});
			return orderBy(flitered, ['closeDoorDelaySort', 'std'], ['asc', 'asc']);
		},
		columns: [
			{
				name: 'flightNo',
				title: '航班号',
			},
			{
				name: 'displaySTD',
				title: '计划',
			},
			{
				name: 'displayGroundServicePlanLimit',
				title: '标准保障',
			},
			{
				name: 'displayCloseDoorTime',
				title: '关舱门时间',
			},
			{
				name: 'lastMilestone.mileStoneName',
				title: '里程碑',
			},
		],
	},
	'delay-city': {
		hide: false,
		type: 'dataRows',
		title: '延误城市排名',
		icon: 'plan',
		collection: (now, summary, flights, seats) => {
			let flitered = filter(get(flights, '"0"'), (f) => {
				return get(f, 'arriveDelay') || get(f, 'departDelay');
			});
			let cityDelay = countBy(flitered, (f) => {
				let city = get(f, 'city');
				if (has(Airports, toUpper(city))) {
					city = get(Airports, `${toUpper(city)}.city`);
				}
				return city;
			});
			let result = map(cityDelay, (v, k) => {
				return {
					id: k,
					city: k,
					delayCount: v,
				};
			});
			return take(orderBy(result, ['delayCount'], ['desc']), 10);
		},
		columns: [
			{
				name: 'city',
				title: '城市',
			},
			{
				name: 'delayCount',
				title: '数量',
			},
		],
	},
	'arrival-delay-city': {
		hide: false,
		type: 'dataRows',
		title: '进港延误城市排名',
		icon: 'plan',
		collection: (data) => {
			return get(data, 'arrivalDelayCity');
		},
		columns: [
			{
				name: 'index',
				title: '序号',
				font: 'font-One',
				width: '5rem',
			},
			{
				name: 'city',
				title: '城市',
			},
			{
				name: 'delayCount',
				title: '数量',
				width: '5rem',
			},
		],
	},
	'departure-delay-city': {
		hide: false,
		type: 'dataRows',
		title: '离港延误城市排名',
		icon: 'plan',
		collection: (data) => {
			return get(data, 'departureDelayCity');
		},
		columns: [
			{
				name: 'index',
				title: '序号',
				font: 'font-One',
				width: '5rem',
			},
			{
				name: 'city',
				title: '城市',
			},
			{
				name: 'delayCount',
				title: '数量',
				width: '5rem',
			},
		],
	},
	seat: {
		type: 'seatChart',
		title: '机位占用情况',
		icon: 'plan',
		columns: [
			{
				name: 'seat',
				title: '机位',
			},
			{
				name: 'count',
				title: '占用数',
			},
		],
	},
	'summary-by-hour-today': {
		type: 'chart',
		title: '今日航班实时运行情况',
		options: extend({}, chartOptionsByHour, {
			yAxis: [
				{
					title: {
						enabled: false,
					},
					gridLineWidth: 1,
					gridLineColor: '#d8d6d6', //Dot
					gridLineDashStyle: 'Dot',
					startOnTick: false,
					endOnTick: false,
					minorTickWidth: 0,
					lineWidth: 0,
					tickInterval: 20,
					labels: {
						formatter: function() {
							return Math.abs(this.value);
						},
					},
				},
				{
					title: {
						text: '',
					},
					minPadding: 0,
					maxPadding: 0,
					max: 100,
					min: 0,
					opposite: true,
					gridLineColor: 'rgba(216,214,214,0.24)', //Dot
					labels: {
						format: '{value}%',
					},
				},
			],
			series: (data, cb) => {
				if (!data.byHours.today) {
					return [];
				}
				let result = [
					{
						type: 'areaspline',
						name: '计划离港',
						color: '#0566FF',
						lineColor: chartColor4,
						fillOpacity: 0.05,
						data: get(data, 'byHours.today.departurePlan', []),
					},
					{
						type: 'column',
						name: '实际离港',
						color: chartColor1,
						//borderColor: 'rgba(12, 159, 255, 0.1)',
						data:
							map(data.byHours.today.departureActual, (v) => {
								return {
									y: v,
									className: 'roundTop',
								};
							}) || [],
						className: 'shadowBlue',
						events: {
							click: function(e) {
								cb && cb(e.point.category, 'D', true);
							},
						},
					},
					{
						type: 'areaspline',
						name: '计划进港',
						color: '#009F23',
						lineColor: chartColor3,
						fillOpacity: 0.05,
						data:
							map(data.byHours.today.arrivalPlan, (v) => {
								return {
									y: v === 0 ? v : -v,
								};
							}) || [],
						marker: {
							lineColor: 'rgba(0, 159, 35, 0.2)',
						},
					},

					{
						type: 'column',
						name: '实际进港',
						color: chartColor2,
						//borderColor: '#e0ece1',
						//borderColor: 'rgba(0, 205, 73, 0.1)',
						dataLabels: {
							verticalAlign: 'top',
							//x: 0.5,
							y: 5,
							style: {
								textOutline: '1px 1px rgba(0,161,37,0.6)',
							},
							//borderColor: 'rgba(0, 205, 73, 0.1)',
						},
						data:
							get(data, 'byHours.today.arrivalActual.length') === 0
								? []
								: map(data.byHours.today.arrivalActual, (v) => {
										return {
											y: v === 0 ? v : -v,
											className: 'roundBottom',
										};
								  }) || [],
						className: 'shadowBlue',
						events: {
							click: function(e) {
								cb && cb(e.point.category, 'A', true);
							},
						},
					},
					{
						// type: 'scatter',
						type: 'spline',
						name: '航班放行正常率',
						yAxis: 1,
						// color: '#ff9f00',
						lineColor: chartColor3,
						lineWidth: 0,

						// fillOpacity: 0.05,
						dataLabels: {
							enabled: true,
							verticalAlign: 'top',
							// format: '{y}%',
							format: '<span>{y}<span style="font-size:8px">%</span><span>',
							allowOverlap: true,
							//x: 0.5,
							// y: 5,
							style: {
								textOutline: '0px 0px rgba(0,161,37,0.1)',
								// textOutline: '1px 0px #999',
								fontSize: 11,
								fontFamily: 'Fjalla One',
								color: '#fff',
								// color: '#fff',
							},
							//borderColor: 'rgba(0, 205, 73, 0.1)',
						},
						data:
							map(data.byHours.today.takeOffRate, (v) => {
								let value = Math.round((v[0] / v[1]) * 1000) / 10;
								let color = 'rgba(251, 0, 0, 0.7)';
								if (value >= 80) color = 'rgba(251, 156, 0, 0.7)';
								if (value >= 85) color = 'rgba(1, 189, 42, 0.7)';
								if (value >= 90) color = 'rgba(2, 107, 254, 0.7)';
								return {
									y: value || null,
									color: color,
									name: v[0] + '/' + v[1],
								};
							}) || [],
						marker: {
							radius: 3,
							// radius: 4,
							lineColor: 'rgba(102,102,102,0.5)',
							lineWidth: 1,
							// symbol: 'diamond',
						},
						// tooltip: {
						// 	valueSuffix: '%',
						// },
					},
				];
				return result;
			},
		}),
	},
	'summary-by-hour-yesterday': {
		type: 'chart',
		title: '昨日航班实时运行情况',
		checkInCounters: (data) => {
			return get(data, 'checkInCounters');
		},
		options: extend({}, chartOptionsByHour, {
			yAxis: [
				{
					title: {
						enabled: false,
					},
					gridLineWidth: 1,
					gridLineColor: '#d8d6d6', //Dot
					gridLineDashStyle: 'Dot',
					startOnTick: false,
					endOnTick: false,
					minorTickWidth: 0,
					lineWidth: 0,
					tickInterval: 20,
					labels: {
						formatter: function() {
							return Math.abs(this.value);
						},
					},
				},
				{
					title: {
						text: '',
					},
					minPadding: 0,
					maxPadding: 0,
					max: 100,
					min: 0,
					opposite: true,
					gridLineColor: 'rgba(216,214,214,0.24)', //Dot
					labels: {
						format: '{value}%',
					},
				},
			],
			series: (data, cb) => {
				if (!data.byHours.yesterday) {
					return [];
				}
				let result = [
					{
						type: 'areaspline',
						name: '计划离港',
						color: '#0566FF',
						lineColor: chartColor4,
						fillOpacity: 0.05,
						data: get(data, 'byHours.yesterday.departurePlan', []),
					},
					{
						type: 'column',
						name: '实际离港',
						color: chartColor1,
						//borderColor: 'rgba(12, 159, 255, 0.1)',
						data:
							map(data.byHours.yesterday.departureActual, (v) => {
								return {
									y: v,
									className: 'roundTop',
								};
							}) || [],
						className: 'shadowBlue',
						events: {
							click: function(e) {
								cb && cb(e.point.category, 'D');
							},
						},
					},
					{
						type: 'areaspline',
						name: '计划进港',
						color: '#009F23',
						lineColor: chartColor3,
						fillOpacity: 0.05,
						data:
							map(data.byHours.yesterday.arrivalPlan, (v) => {
								return {
									y: v === 0 ? v : -v,
								};
							}) || [],
						marker: {
							lineColor: 'rgba(0, 159, 35, 0.2)',
						},
					},

					{
						type: 'column',
						name: '实际进港',
						color: chartColor2,
						//borderColor: 'rgba(0, 205, 73, 0.1)',
						dataLabels: {
							verticalAlign: 'top',
							//x: 1,
							y: 5,
							style: {
								textOutline: '1px 1px rgba(0,161,37,0.6)',
							},
						},
						data:
							get(data, 'byHours.yesterday.arrivalActual.length') === 0
								? []
								: map(data.byHours.yesterday.arrivalActual, (v) => {
										return {
											y: v === 0 ? v : -v,
											className: 'roundBottom',
										};
								  }) || [],
						className: 'shadowBlue',
						events: {
							click: function(e) {
								cb && cb(e.point.category, 'A');
							},
						},
					},
				];
				return result;
			},
		}),
	},
	'summary-by-hour-backlog': {
		type: 'chart',
		title: '今日航班实时积压情况',
		options: extend({}, chartOptionsByHour, {
			yAxis: {
				title: {
					enabled: false,
				},
				gridLineWidth: 1,
				gridLineColor: '#d8d6d6', //Dot
				gridLineDashStyle: 'Dot',
				startOnTick: false,
				endOnTick: false,
				minorTickWidth: 0,
				lineWidth: 0,
				tickInterval: 10,
				labels: {
					formatter: function() {
						return Math.abs(this.value);
					},
				},
			},
			series: (data) => {
				if (!data.byHours.backlog) {
					return [];
				}
				let prediction = get(data, 'byHours.backlog.prediction', []);
				let actual = get(data, 'byHours.backlog.actual', {});
				let executable = get(data, 'byHours.backlog.executable', []);
				//let timeCfg = ['04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '00', '01', '02', '03'];
				let timeCfg = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
				let result = [
					{
						type: 'column',
						name: '可执行积压',
						color: chartColor1,
						// dataLabels: {
						// 	verticalAlign: 'top',
						// 	//x: 0.5,
						// 	y: 5,
						// 	style: {
						// 		textOutline: '1px 1px rgba(0,161,37,0.6)',
						// 	},
						// 	//borderColor: 'rgba(0, 205, 73, 0.1)',
						// },
						data: map(timeCfg, (time) => {
							let v = executable[time];
							return {
								y: v,
								className: 'roundTop',
							};
						}),
						className: 'shadowBlue',
					},
					// {
					// 	type: 'areaspline',
					// 	name: '预计积压',
					// 	color: '#0566FF',
					// 	lineColor: chartColor4,
					// 	fillOpacity: 0.05,
					// 	data: map(timeCfg, (v) => {
					// 		return prediction[v] || 0;
					// 	}),
					// },
					{
						type: 'column',
						name: '积压航班',
						color: chartColor2,
						dataLabels: {
							verticalAlign: 'top',
							//x: 0.5,
							y: 5,
							style: {
								textOutline: '1px 1px rgba(0,161,37,0.6)',
							},
							//borderColor: 'rgba(0, 205, 73, 0.1)',
						},

						//borderColor: 'rgba(12, 159, 255, 0.1)',
						data:
							JSON.stringify(actual) === '{}'
								? []
								: map(timeCfg, (v) => {
										let res = {
											y: -actual[v] || 0,
											className: 'roundBottom',
											color: chartColor2,
										};
										if (actual[v] >= 150) {
											return extend(res, { color: chartColorRed });
										}
										if (actual[v] >= 100) {
											return extend(res, { color: chartColorOrg });
										}
										if (actual[v] >= 50) {
											return extend(res, { color: chartColorYellow });
										}

										return res;
								  }) || [],
						className: 'shadowBlue',
					},
				];
				return result;
			},
		}),
	},
	'summary-departure-delay-by-hour': {
		type: 'chart',
		options: {
			chart: {
				backgroundColor: 'transparent',
			},
			colors: ['#049175', '#049175', '#074e7a', '#074e7a'],
			tooltip: {
				crosshairs: [true],
				valueSuffix: '架次',
				split: true,
				shared: true,
			},
			title: {
				text: '航班延误',
				style: {
					color: '#9a94cc',
					fontSize: '14px',
				},
			},
			xAxis: {
				categories: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, ' 4 '],
			},
			plotOptions: {
				column: {
					pointPlacement: 0.5,
					stacking: 'normal',
					dataLabels: {
						enabled: true,
						color: 'white',
					},
				},
				areaspline: {
					pointPlacement: 0.5,
					stacking: 'normal',
					lineColor: '#ffffff',
					lineWidth: 1,
					fillOpacity: 0.25,
					dataLabels: {
						enabled: true,
						color: 'white',
					},
				},
			},
			legend: {
				align: 'center',
				verticalAlign: 'top',
				enabled: true,
				itemStyle: {
					color: '#fff',
				},
				itemHoverStyle: {
					color: '#fff',
				},
				itemHiddenStyle: {
					color: '#6b6b6b',
				},
			},
			series: (data) => {
				let result = [
					{
						type: 'areaspline',
						name: '计划进港航班架次',
						data: [],
					},
					{
						type: 'column',
						name: '进港延误航班架次',
						data: [],
					},
					{
						type: 'areaspline',
						name: '计划离港航班架次',
						data: [],
					},
					{
						type: 'column',
						name: '离港延误航班架次',
						data: [],
					},
				];
				each([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3], (h) => {
					result[0].data.push(get(data, `"0".arrivalsByHour.${h}.plan`, 0));
					result[1].data.push(get(data, `"0".delayByHour.${h}.arrivals`, 0));
					result[2].data.push(get(data, `"0".departureByHour.${h}.plan`, 0));
					result[3].data.push(get(data, `"0".delayByHour.${h}.departure`, 0));
				});
				result[0].data.push(null);
				result[1].data.push(null);
				result[2].data.push(null);
				result[3].data.push(null);
				return result;
			},
		},
	},
};
