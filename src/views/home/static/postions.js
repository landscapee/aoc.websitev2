export const postions = {
	totalPlan: {//今日计划
		position: 'p-0x0 s-5x10',
		icon: 'todayPlan',
		barBg: '#068221',
		barColor:'linear-gradient(90deg,#c6ea9d 0,#79d313 100%)'
	},
	passengerTransport: {//客运
		position: 'p-5x0 s-5x10',
		icon: 'passenger',
		barBg: '#089b86',
		barColor:'linear-gradient(90deg,#a1d9fd 0,#7eefa4 100%)'
	},
	cargo: {//货运
		position: 'p-10x0 s-5x10',
		icon: 'cargo',
		barBg: '#068221',
		barColor:'linear-gradient(90deg,#c6ea9d 0,#79d313 100%)'
	},
	arrival: {//进港
		position: 'p-15x0 s-5x10',
		icon: 'movementA',
		barBg: '#068221',
		barColor:'linear-gradient(90deg,#c6ea9d 0,#79d313 100%)'
	},
	departure: {//离港
		position: 'p-20x0 s-5x10',
		icon: 'movementD',
		barBg: '#326ecf',
		barColor:'linear-gradient(90deg,#29e9cd 0,#4dd2fd 100%)'
	},
	return: {//返航
		position: 'p-0x1 s-3x1',
		icon: 'return',
		toolTip: 'getReturnFlight',
	},
	alternateInner: {//备降本场
		position: 'p-3x1 s-3x1',
		icon: 'alternate',
		toolTip: 'getAlternateFlight',
	},
	alternateOuter: {//备降外场
		position: 'p-6x1 s-3x1',
		icon: 'alternateOut',
		toolTip: 'getAlternateOtherCityFlight',
	},
	cancel: {//取消
		position: 'p-9x1 s-3x1',
		icon: 'cancel',
		toolTip: 'getCancelFlight',
	},
	monthStatistics: {//月度统计
		position: 'p-9x1 s-3x1',
	},




	originatedDeparturePercent: {
		position: 'p-12x0 s-4x2',
	},
	departurePercent: {
		position: 'p-16x0 s-4x2',
	},
	takeOffPercent: {
		position: 'p-20x0 s-4x2',
	},
	morningBusyHourPercent: {
		position: 'p-24x0 s-4x2',
	},
	eta30min: {
		position: 'p-0x2 s-12x5',
	},

	'arrival-delay-city': {
		position: 'p-0x7 s-6x3',
	},

	'departure-delay-city': {
		position: 'p-6x7 s-6x3',
	},

	'summary-by-hour-today': {
		position: 'p-12x2 s-16x4',
	},
	'summary-by-hour-yesterday': {
		position: 'p-12x6 s-16x4',
	},
};
