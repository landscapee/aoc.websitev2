import { get, set, filter, orderBy, countBy, keyBy, take, map, each, has, toUpper, size, extend } from 'lodash';

import Airports from 'data/airports.json';
import China from 'data/cn-all-sar-taiwan.geo.json';
import Citys from 'data/cities';
import { fixPx, pxtorem } from './helper/viewSize';
// let getCitys = (chinaCity) => {
// 	return map(['成都', '重庆', '西安', '昆明', '拉萨', '兰州'], (cityName) => {
// 		let city = chinaCity[cityName];
// 		return extend({
// 			x: city.x,
// 			y: -city.y,
// 			name: cityName,
// 			color: '#FFE300',
// 			dataLabels: {
// 				enabled: cityName != '成都',
// 				align: 'left',
// 				x: 5,
// 				verticalAlign: 'middle',
// 			},
// 		});
// 	});
// };

function pointsToPath(from, to, invertArc) {
	// var arcPointX = (from.x + to.x) / (invertArc ? 2.4 : 1.6),
	// 	arcPointY = (-from.y + -to.y) / (invertArc ? 2.4 : 1.6);
	var arcPointX = (from.x + to.x) / invertArc,
		arcPointY = (-from.y + -to.y) / invertArc;
	return 'M' + from.x + ',' + -from.y + 'Q' + arcPointX + ' ' + arcPointY + ',' + to.x + ' ' + -to.y;
}
var chengduPoint = Citys['成都'];
let getCityRoutes = (chinaCity) => {
	let invertArc = [2, 1.8, 2.1, 2.1, 1.8, 1.9];
	return map(['重庆', '西安', '昆明', '贵阳', '拉萨', '兰州'], (cityName, index) => {
		let city = chinaCity[cityName];
		return {
			id: 'chengdu-' + cityName,
			path: pointsToPath(chengduPoint, city, invertArc[index]),
		};
	});
};

const chartColor = { linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 }, stops: [[0, '#0C9FFF'], [1, '#0566FF']] };
const chartColor1 = { linearGradient: { x1: 0, x2: 0, y1: 1, y2: 0 }, stops: [[0, '#0566FF'], [1, '#0C9FFF']] };
const chartColorRed = { linearGradient: { x1: 0, x2: 0, y1: 1, y2: 0 }, stops: [[0, '#BF0B23'], [1, '#ff0002']] };
const chartColorOrg = { linearGradient: { x1: 0, x2: 0, y1: 1, y2: 0 }, stops: [[0, '#ff7300'], [1, '#ffa517']] };
const chartColorOrg2 = { linearGradient: { x1: 0, x2: 0, y1: 1, y2: 0 }, stops: [[0, '#ff7300'], [1, '#ffc700']] };
// const chartColorYellow = { linearGradient: { x1: 0, x2: 0, y1: 1, y2: 0 }, stops: [[0, '#FFE300'], [1, '#fff200']] };
const chartColorYellow = { linearGradient: { x1: 0, x2: 0, y1: 1, y2: 0 }, stops: [[0, '#d99c00'], [1, '#ffd700']] };
const chartColor2 = { linearGradient: { x1: 0, x2: 0, y1: 1, y2: 0 }, stops: [[0, '#00CD49'], [1, '#009F23']] };
const chartColorP = { linearGradient: { x1: 0, x2: 0, y1: 1, y2: 0 }, stops: [[0, '#03831F'], [1, '#05FF5E']] };
const chartColorP2 = { linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 }, stops: [[0, '#00FFDE'], [1, '#004EFF']] };
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
		spacing: [0, 0, 0, 0],
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
				outerRadius: '85%',
				innerRadius: '80%',
				backgroundColor: '#576781',
				borderWidth: 0,
			},
		],
	},
	plotOptions: {
		solidgauge: {
			dataLabels: {
				y: -36,
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
		//split: true,
		crosshairs: [true],
		valueSuffix: '架次',
		shared: true,
		//pointFormat: '{series.name}: <b>{point.y}</b>',
		formatter: function() {
			let s = `<b>${this.x}点</b>`;
			let self = this;
			map(self.points, function(point) {
				if (point.series.name.indexOf('计划') > -1) {
					s += `<br/><div><span style="color:${point.color}">- </span><span style="color:#666;">${point.series.name}</span> : <span style="font-family:'Fjalla One';color:${point.color}">${Math.abs(point.y)}</span><span style="color:#666;">架次</span></div>`;
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
		gridLineColor: '#999', //Dot
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
	yAxis: {
		title: {
			enabled: false,
		},
		gridLineWidth: 1,
		gridLineColor: '#999', //Dot
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
					// fontSize: '0.625rem',
					fontSize: '1rem',
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
		// enabled: true,
		itemStyle: {
			color: '#666666',
			fontSize: '0.75rem',
			fontWeight: 'light',
		},
		enabled: false,
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
		value: (data) => {
			return `${get(data, 'summary.completedPlan', '')} / ${get(data, 'summary.totalPlan', '')}`;
		},
		title: '',
	},
	arrival: {
		type: 'number',
		value: (data) => {
			return `${get(data, 'summary.completedArrivalPlan', '')} / ${get(data, 'summary.arrivalPlan', '')}`;
		},
		title: '',
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
		value: (data) => {
			return `${get(data, 'summary.completedDeparturePlan', '')} / ${get(data, 'summary.departurePlan', '')}`;
		},
		title: '',
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
		title: '今日返航',
	},
	alternate: {
		type: 'number2',
		value: (data) => {
			return `${get(data, 'summary.alternate', '')}`;
		},
		title: '今日备降',
	},
	cancel: {
		type: 'number2',
		value: (data) => {
			return `${get(data, 'summary.cancel', '')}`;
		},
		title: '今日取消',
	},
	delayNum: {
		type: 'number2',
		value: (data) => {
			return `${get(data, 'summary.delayNum', '')}`;
		},
		title: '延误航班',
	},
	vipNum: {
		type: 'number2',
		value: (data) => {
			return `${get(data, 'summary.vipNum', '')}`;
		},
		title: 'VIP航班',
	},
	backlogNum: {
		type: 'number2',
		value: (data) => {
			return `${get(data, 'summary.backlogNum', '')}`;
		},
		title: '可执行积压',
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
								color: chartColorP2,
								radius: '89%',
								innerRadius: '72%',
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
							format: `<div class="percentLabel"> {y}<span class="symbol">%</span> <div class="detail">{point.name}</div></div>`,
						},
						data: [
							{
								// color: chartColor,
								color: chartColorP2,
								radius: '89%',
								innerRadius: '72%',
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
			series: (data) => {
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

				let color = chartColorRed;
				if (value >= 80) color = chartColorOrg2;
				if (value >= 85) color = chartColorP;
				if (value >= 90) color = chartColorP2;
				return [
					{
						name: '放行正常率',
						dataLabels: {
							format: `<div class="percentLabel"> {y}<span class="symbol">%</span> <div class="detail">{point.name}</div></div>`,
						},
						data: [
							{
								color: color,
								radius: '89%',
								innerRadius: '72%',
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
	examinePercent: {
		type: 'chart',
		title: '考核正常率',
		options: extend({}, chartOptions, {
			series: (data) => {
				let takeOffNormal = get(data, 'percent.takeOffNormal', 1);
				let takeOffTotal = get(data, 'percent.takeOffTotal', 1);

				// let takeOffP = Math.round((takeOffNormal * 10000) / takeOffTotal) / 100;
				let takeOffP = takeOffNormal / takeOffTotal;

				let departureNormal = get(data, 'percent.departureNormal', 1);
				let departureTotal = get(data, 'percent.departureTotal', 1);

				let departureP = departureNormal / departureTotal;
				// let departureP = Math.round((departureNormal * 10000) / departureTotal) / 100;

				let value = takeOffP * 0.7 + departureP * 0.3;
				// value = value.toFixed(2);
				value = Math.round(value * 10000) / 100;
				// let value = null;
				// if (count > 0 && total > 0 && count == total) {
				// 	value = 100;
				// } else if (total == 0) {
				// 	value = 100;
				// } else {
				// 	value = Math.round((count * 10000) / total) / 100;
				// }

				let color = chartColorRed;
				if (value >= 80) color = chartColorOrg2;
				if (value >= 85) color = chartColorP;
				if (value >= 90) color = chartColorP2;
				return [
					{
						name: '考核正常率',
						dataLabels: {
							format: `<div class="percentLabel"> {y}<span class="symbol">%</span> <div class="detail">{point.name}</div></div>`,
						},
						data: [
							{
								color: color,
								radius: '89%',
								innerRadius: '72%',
								// name: `${count}/${total}`,
								name: '',
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
				// let count = get(data, 'percent.seatUsed', 0);get(this.state, 'seats.used')
				// let total = get(data, 'percent.seatTotal', 0);get(this.state, 'seats.total')
				let count = get(data, 'seats.used', 0);
				let total = get(data, 'seats.total', 1);
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
						name: '机位占用率',
						dataLabels: {
							format: `<div class="percentLabel"> {y}<span class="symbol">%</span> <div class="detail">{point.name}</div></div>`,
						},
						data: [
							{
								color: chartColorP2,
								radius: '89%',
								innerRadius: '72%',
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
								color: chartColorP2,
								radius: '89%',
								innerRadius: '72%',
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
	approachMaintenanceFlight: {
		title: '临界保障池',
		type: 'dataRows',
		collection: (data) => {
			return get(data, 'approachMaintenanceFlight');
		},
		columns: [
			{
				name: 'index',
				title: '序号',
				font: 'index',
			},
			{
				name: 'flightNo',
				title: '航班号',
				font: 'flightNo',
			},
			{
				name: 'displaySTDWithDate',
				title: '计划起飞',
				font: 'displaySTDWithDate',
			},
			{
				name: 'displayCOBTWithDate',
				title: 'COBT',
				font: 'displayCOBTWithDate',
			},
		],
	},
	approachTakeOffFlight: {
		title: '临界起飞池',
		type: 'dataRows',
		collection: (data) => {
			return get(data, 'approachTakeOffFlight');
		},
		columns: [
			{
				name: 'index',
				title: '序号',
				font: 'index',
			},
			{
				name: 'flightNo',
				title: '航班号',
				font: 'flightNo',
			},
			{
				name: 'displaySTDWithDate',
				title: '计划起飞',
				font: 'displaySTDWithDate',
			},
			{
				name: 'displayCTOTWithDate',
				title: 'CTOT',
				font: 'displayCTOTWithDate',
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
			series: (data) => {
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
							map(data.byHours.today.arrivalActual, (v) => {
								return {
									y: v === 0 ? v : -v,
									className: 'roundBottom',
								};
							}) || [],
						className: 'shadowBlue',
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
				let actual = get(data, 'byHours.backlog.actual', []);
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
							map(timeCfg, (v) => {
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
	'direction-map': {
		type: 'Map',
		title: '方向放行率',
		options: {
			chart: {
				height: fixPx(400),
				backgroundColor: 'transparent',
				// marginLeft: -20,
				// marginRight: -20,
				spacing: [0, 0, 0, 0],
				animation: false,
			},
			exporting: {
				enabled: false,
			},
			title: {
				text: '',
			},
			credits: {
				enabled: false,
			},
			mapNavigation: {
				enabled: false,
				buttonOptions: {
					verticalAlign: 'bottom',
				},
			},
			tooltip: {
				// useHTML: true,
				// formatter: function() {
				// 	return this.point.name;
				// },
				enabled: false,
			},
			legend: {
				enabled: false,
			},
			plotOptions: {
				series: {
					// dataLabels: {
					// 	color: 'white',
					// 	borderWidth: 0,
					// 	style: { color: 'contrast', fontSize: '16px', fontWeight: 'light', textOutline: '0px 0px contrast' },
					// },
					marker: {
						fillColor: 'rgba(255, 227, 0, 0.8)',
						lineWidth: 3,
						lineColor: 'rgba(255, 227, 0, 0.3)',
						radius: 2,
					},
				},
			},
			series: (data) => {
				const mapdata = China;
				let directions = keyBy(data.direction, 'hallway');
				let renderColor = function(arr, data) {
					let normal = get(data, 'normal', 0);
					let total = get(data, 'total', 0);
					let percent = total == 0 ? 1 : normal / total;
					percent = Math.round(percent * 1000) / 10;
					let color;
					if (percent <= 100 && percent >= 90) {
						color = '#14264A';
					} else if (percent < 90 && percent >= 80) {
						color = '#1F4D78';
					} else if (percent < 80) {
						color = '#661748';
					}
					return map(arr, (item) => ({ name: item, color: color, dataLabels: { enabled: false } }));
				};
				let taiwanOrigin = map(China['features'], (item) => {
					if (item['properties']['country'] === 'Taiwan') {
						return item['properties']['name'];
					}
				});
				let taiwan = filter(taiwanOrigin, (item) => item);
				let lanzhou = renderColor(['Qinghai', 'Xinjiang', 'Gansu'], directions[2]);
				let xian = renderColor(['Inner Mongol', 'Heilongjiang', 'Jilin', 'Liaoning', 'Hebei', 'Beijing', 'Tianjin', 'Hebei', 'Shandong', 'Shanxi', 'Henan', 'Hubei', 'Shaanxi', 'Ningxia'], directions[3]);
				let chongqing = renderColor(['Chongqing', 'Hubei', 'Anhui', 'Shanghai', 'Jiangsu', 'Zhejiang', 'Fujian', 'Jiangxi', 'Hunan', 'Hsinchu', ...taiwan], directions[4]);
				let guiyang = renderColor(['Guizhou', 'Guangxi', 'Guangdong', 'Hainan'], directions[5]);
				let kunming = renderColor(['Yunnan', 'Sichuan'], directions[6]);
				let lasa = renderColor(['Xizang'], directions[1]);

				let result = [
					{
						colorByPoint: true,
						data: [...lanzhou, ...xian, ...chongqing, ...guiyang, ...kunming, ...lasa],
						mapData: mapdata,
						// keys: ['region', 'value', 'color'],
						dataLabels: {
							enabled: true,
							format: '{point.name}',
						},
						states: {
							hover: {
								enabled: false,
								borderWidth: 0,
								borderColor: 'rgba(0,0,0,0)',
							},
						},
						joinBy: 'name',
						name: '中国地图',
						borderWidth: 1,
						borderColor: 'rgba(0,158,241,0.4)',
						nullColor: 'rgba(0, 147, 230, 0.3)',
					},
					{
						type: 'mappoint',
						name: '通过经纬度描点',
						color: '#FFE300',
						dataLabels: {
							//format: '{point.name}',
							useHTML: true,
							formatter: function() {
								let self = this;
								let data = self.point.id.split('-');
								let normal = parseInt(data[1]);
								let total = parseInt(data[2]);
								let percent = total == 0 ? '1' : normal / total;
								percent = Math.round(percent * 1000) / 10;
								if (data) {
									return `<div class="direction">
                                        <div class="percent"  style="color:#fff">${percent}%</div>
										<div class="cityname"  style="color:#fff">${self.point.name}
										<span>
											${normal}/${total}
										</span>
										</div>
									</div>`;
								} else {
									return self.point.name;
								}
							},
						},
						data: [
							{
								id: 'chengdu',
								x: Citys['成都'].x,
								y: -Citys['成都'].y,
								name: '成都方向',
								dataLabels: {
									enabled: false,
								},
								marker: {
									fillColor: '#FFE300',
									radius: 3,
									lineWidth: 4,
									lineColor: 'rgba(255, 227, 0, 0.5)',
								},
							},
							{
								id: `chongqing-${get(directions, [4, 'normal'], 0)}-${get(directions, [4, 'total'], 0)}`,
								x: Citys['重庆'].x,
								y: -Citys['重庆'].y,
								name: '重庆方向',
								dataLabels: {
									align: 'left',
									x: 5,
									verticalAlign: 'middle',
								},
							},
							{
								id: `xian-${get(directions, [3, 'normal'], 0)}-${get(directions, [3, 'total'], 0)}`,
								x: Citys['西安'].x,
								y: -Citys['西安'].y,
								name: '西安方向',
								dataLabels: {
									align: 'left',
									x: 10,
									y: -12,
									verticalAlign: 'middle',
								},
							},
							{
								id: `guiyang-${get(directions, [5, 'normal'], 0)}-${get(directions, [5, 'total'], 0)}`,
								x: Citys['贵阳'].x,
								y: -Citys['贵阳'].y,
								name: '贵阳方向',
								dataLabels: {
									align: 'left',
									x: 12,
									y: 27,
									verticalAlign: 'middle',
								},
							},
							{
								id: `kunming-${get(directions, [6, 'normal'], 0)}-${get(directions, [6, 'total'], 0)}`,
								x: Citys['昆明'].x,
								y: -Citys['昆明'].y,
								name: '昆明方向',
								dataLabels: {
									align: 'center',
									y: 20,
									x: -20,
									verticalAlign: 'middle',
								},
							},
							{
								id: `lanzhou-${get(directions, [2, 'normal'], 0)}-${get(directions, [2, 'total'], 0)}`,
								x: Citys['兰州'].x,
								y: -Citys['兰州'].y,
								name: '兰州方向',
								dataLabels: {
									align: 'center',
									y: -30,
									x: -10,
									verticalAlign: 'middle',
								},
							},
							{
								id: `lanzhou-${get(directions, [1, 'normal'], 0)}-${get(directions, [1, 'total'], 0)}`,
								x: Citys['拉萨'].x,
								y: -Citys['拉萨'].y,
								name: '拉萨方向',
								dataLabels: {
									align: 'right',
								},
							},
						],
					},
					{
						name: 'chengdu flight routes',
						type: 'mapline',
						lineWidth: 1,
						color: '#FFE300',
						data: getCityRoutes(Citys),
					},
				];
				return result;
			},
		},
	},
};
