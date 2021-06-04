
// flight/ proFlightField 使用

//lock 是否锁定   可配
//sort 是否可以排序 不可配
//auto 是否需要计算列宽
//reference 数据排序参考列，不需要显示，不需要配置
//unConfigurable 不可配置列，不可搜索
//full 字段说明，显示为dom title
//search 搜索配置，搜索框类型
//remoteOptionField 搜索配置，从远程获取的筛选项
export const allField = {
	examine: {
		text: '操作',
		unConfigurable: true,
		referenceTo: ['concern', 'concernReason', 'reasonType', 'illegalReleaseStatus', 'illegalCustomerStatus'],
		hidInHistory: true,
		search: false,
	},
	flightIndex: { text: '序号', unConfigurable: true, search: false },
	position: { text: '排序', reference: true, search: false },
	flightNo: { text: '航班号', search: { type: 'text' } },
	shareFlights: { text: '共享航班号', auto: true,width: '60px' , search: { type: 'text' } },
	flightId: { text: '航班ID', sort: true, width: '50px' ,search: { type: 'text' } },
	scheduleTime: { text: 'scheduleTime', reference: true, search: false },
	// displayScheduleTime: { text: 'scheduleTime', sort: true, referenceTo: 'scheduleTime' },
	'sta-std': { text: '计划',width: '30px' , full: '计划进港sta，计划离港合并std', sort: true, referenceTo: 'scheduleTime', search: { type: 'time' } },
	'ata-atd': { text: '实际',width: '30px' , full: '实际进港ata，实际离港合并atd', sort: true, search: { type: 'time' } },
	sta: { text: '计划到达', reference: true },
	displaySTA: { text: '计划到达',width: '50px' , referenceTo: 'sta', search: { type: 'time' } },
	std: { text: '计划起飞', width: '50px' ,reference: true },
	displaySTD: { text: '计划起飞',width: '50px' , referenceTo: 'std', search: { type: 'time' } },
	// eatimateTime: { text: '预计时间', full: 'ETA和CTOT合并' },
	'eta-ctotSort': { text: '预计',width: '30px' , reference: true },
	'eta-ctot': { text: '预计', width: '30px' ,full: '预计时间ETA和CTOT合并', sort: true, referenceTo: 'eta-ctotSort', search: { type: 'time' } },
	amisEta: { text: '空管预计到达',width: '80px' , reference: true },
	displayAmisEta: { text: '空管预计到达',width: '80px' , referenceTo: 'amisEta', search: { type: 'time' } },
	flightIndicator: {
		text: '国内国际',
		full: '国内国际混合',
        width: '50px' ,
		search: { type: 'select', options: { D: '国内', I: '国际', M: '混合', R: '地区' } },
	},
	displayRouter: { text: '航线',width: '35px' , auto: true, search: { type: 'text' } },
	direction: { text: '方向', width: '30px' ,search: { type: 'select', options: { 西安: '西安', 贵阳: '贵阳', 重庆: '重庆', 拉萨: '拉萨', 兰州: '兰州', 昆明: '昆明' } } },
	elecFlightStatus: { text: '电子进程单状态',width: '100px' , search: { type: 'select', options: ['未激活', '激活', '申请放行', '已发放行', '准备好', '未推出', '推出', '开车', '推出开车', '滑行', '滑回', '管制', '上跑道', '起飞', '起飞中断', '降落', '塔台滑行', '管制结束', '未管制', '降落', '落地', '入位'] } },
	displayElecPublishTime: { text: '电子进程单发布', width: '100px' ,full: '电子进程单发布时间', search: { type: 'time' } },
	c: { text: '机类', sort: true,width: '30px' , search: { type: 'select', options: ['B', 'C', 'D', 'E', 'F'] } },
	mark: { text: '标记', width: '30px' ,search: { type: 'select', options: { markD: 'D', markV: 'V' } } },
	tailNo: { text: '飞机号',width: '45px' , search: { type: 'text' } },
	runway: { text: '跑道',width: '30px' , search: { type: 'select', options: ['11', '01', '19', '20', '02'] } },
	aircraftType: { text: '机型',width: '50px' , search: { type: 'text' } },
	closeDoorTime: { text: '关舱门',width: '50px' , search: { type: 'time' } },
	// delay: { text: '航班延误', search: { type: 'text' } },
	relatedFlightNo: { text: '关联航班',width: '50px' , search: { type: 'text' } },
	arriveAircraftNo: { text: '进港机号',width: '50px' , search: { type: 'text' } },
	ata: { text: '实际进港',width: '50px' , },
	originated: { text: '始发航班',width: '50px' , search: { type: 'select', options: { true: '始', false: '--' } } },
	displayMaintainTime: { text: '标准保障',width: '50px' , full: '标准保障时间', search: { type: 'time' } },
	isSeatConflict: { text: '冲突机位',width: '50px' , },
	seat: { text: '机位',width: '50px' , search: { type: 'text' } },
	// groundService: { text: '代理' },
	displayGate: { text: '登机口',width: '50px' , search: { type: 'text' } },
	movement: { text: '进/离', width: '50px' ,search: { type: 'select', options: { A: '进港', D: '离港' } } },
	mixEta: { text: 'mixEta',width: '50px' , reference: true },
	displayMixEtaWithDate: { text: '预达',width: '50px' , sort: true, referenceTo: 'mixEta' },
	displayETI: { text: '预位',width: '50px' , sort: true, referenceTo: 'eti' },
	'eta-etd': { text: '优利预计',width: '50px' , },
	flightStatusText: { text: '运营状态',width: '50px' , search: { type: 'select', remoteOptionField: 'flightStatusText' } },
	displayPreATDOrETD: { text: '前站起飞',width: '50px' , },
	counters: { text: '值机柜台',width: '50px' , },
	displayCarousels: { text: '转盘' ,width: '50px' ,},
	airlineCnName: { text: '航空公司', width: '50px' ,auto: true, search: { type: 'text' } },
	cobt: { text: 'COBT', reference: true },
	ctot: { text: 'CTOT', reference: true },
	tobt: { text: 'TOBT', reference: true },
	displayCOBT: { text: 'COBT',width: '50px' , referenceTo: 'cobt', sort: true, search: { type: 'time' } },
	displayCTOT: { text: 'CTOT',width: '50px' , referenceTo: 'ctot', sort: true, search: { type: 'time' } },
	displayTOBT: { text: 'TOBT',width: '50px' , referenceTo: 'tobt', sort: true, search: { type: 'time' } },
	// delayReason: { text: '延误原因' },
	exceptionReason: { width: '50px' ,text: '异常原因' },
	displayDELAYTIME: {width: '50px' , text: '延误时间' },
	// startCatering: { text: '开始配餐' },
	endCatering: { width: '50px' ,text: '结束配餐' },
	startDeicing: { width: '50px' ,text: '开始除冰' },
	endDeicing: { width: '50px' ,text: '除冰结束' },
	startRefueling: {width: '50px' , text: '开始加油' },
	endRefueling: { width: '50px' ,text: '加油结束' },
	vtt: { text: 'VTT',width: '50px' , search: { type: 'text' } },
	displayCounters: {width: '50px' , text: '值机柜台' },
	checkInCounters: { width: '50px' ,text: '已值机' },
	boardingCounters: {width: '50px' , text: '已登机' },
	securityCheckQty: {width: '50px' , text: '已安检' },
	passengerService: { width: '50px' ,text: '旅客服务' },
	assignmentAgent: { width: '50px' ,text: '签派代理' },
	serviceAgent: { text: '地服代理', width: '50px' ,full: '勤务代理' },
	preOrNxtPlanTime: { text: '前后站计划',width: '60px' , full: '前后站计划时间', reference: true },
	preOrNxtActualTime: { text: '前后站实际',width: '60px' , full: '前后站实际时间', reference: true },
	displayPreOrNxtPlanTime: { text: '前后站计划',width: '60px' , full: '前后站计划时间', sort: true, referenceTo: 'preOrNxtPlanTime', search: { type: 'time' } },
	displayPreOrNxtActualTime: { text: '前后站实际', width: '60px' ,full: '前后站实际时间', sort: true, referenceTo: 'preOrNxtActualTime', search: { type: 'time' } },
	terminal: { text: '航站楼',width: '50px' , search: { type: 'select', options: ['T1', 'T2'] } },
	lastModifier: { text: 'TOBT最后修改人',width: '100px' , full: 'TOBT最后修改人' },
	maintenance: { width: '50px' ,text: '放行机务' },
	flightType: { width: '50px' ,text: '航班类型', search: { type: 'select', options: ['正班', '客加班', '货加班', '备降', '试飞', '包机', '测试', '补班', '普客加班', '货班', '公务', '调机', '货包', '返航'] } },
	airlineCode: { width: '80px' ,text: '航空公司代码' },
	takeOffDelay: { width: '50px' ,text: '放行延误' },
	// displayEti: { text: '预计入位' },
	// displayOperationDate: { text: '运营日' },
	displayUpdateTime: {width: '100px' , text: '航班数据更新时间', reference: true },
	concernReason: { width: '50px' ,text: '关注原因', referenceTo: 'reasonType' },
	reasonType: { width: '50px' ,text: '关注类型', reference: true },
	concern: { width: '50px' ,text: '是否被关注' },
	gate: { width: '50px' ,text: '登机口' },
	quick: { width: '50px' ,text: '快速过站' },
	displayIn: { width: '50px' ,text: '入位时间' },
	displayOut: { width: '50px' ,text: '推出时间' },
	masterFlightId: { width: '50px' ,text: '有主航班', full: '是否是共享航班' },
	deleted: { width: '50px' ,text: '是否删除' },
	// flightStatus: { text: '航班状态' },
	// flightExtStatusText: { text: '外部状态', full: '航班外部状态', search: { type: 'text' } },
	returnCode: { width: '50px' ,text: '返航代码' },
	alternate: { width: '50px' ,text: '是否备降' },
	cancel: { width: '50px' ,text: '是否取消' },
	homewardVoyage: { width: '50px' ,text: '返航' },
	passengerHandling: {width: '50px' , text: '旅客装卸' },
	maintanceAgent: { width: '50px' ,text: '维护代理', full: '航班维护代理' },
	apronOrg: { width: '50px' ,text: '机坪代理', full: '机坪处理代理机构' },
	displayBlockOnStart: { width: '60px' ,text: '上轮档开始', full: '上轮档开始时间' },
	displayBlockOffEnd: {width: '60px' , text: '撤轮档结束', full: '撤轮档结束时间' },
	standardTakeOffTime: {width: '50px' , text: '标准起飞', full: '标准起飞时间', reference: true },
	displayStandardTakeOffTime: {width: '50px' , text: '标准起飞', full: '标准起飞时间', sort: true, referenceTo: 'standardTakeOffTime', search: { type: 'time' } },
	nxtCity: { width: '50px' ,text: '下站城市' },
	preCity: { width: '50px' ,text: '上站城市' },
	returnReason: {width: '50px' , text: '返航原因' },
	alternateCity: {width: '50px' , text: '备降城市' },
	isPassagerFlight: { width: '50px' ,text: '客运', search: { type: 'select', options: { true: '是', false: '否' } } },
	isAlternateLandingFlight: { width: '50px' ,text: '备降外场' },
	passenger: {width: '50px' , text: '乘机人数' },
	flyingTime: { width: '50px' ,text: '飞行时间' },
	contrlPoint: { width: '50px' ,text: '流控点' },
	fix: { width: '50px' ,text: '走廊口' },
	contrlStatus: {width: '50px' , text: '是否流控' },
	displayFirstLuggageEstimateArriveTime: { width: '150px' ,text: '首件行李预计到达时间' },
	estimateBordingLength: { width: '150px' ,text: '预计登机时长(分钟)' },
	displayEstimateGuaranteeCompleteTime: { width: '110px' ,text: '预计保障完成时间' },
	displayFirstLuggageActualArriveTime: { width: '150px' ,text: '首件行李实际到达时间' },
	actualBordingLength: { width: '150px' ,text: '实际登机时长(分钟)' },
	actualRoute: { width: '50px' ,text: '航路' },
	planRoute: { width: '50px' ,text: '计划航路' },

	// ATOTout: { text: '外站实际起飞' },
	// FIRT: { text: '本场雷达更新' },
	// FNLT: { text: '本场近进' },
	// ELDT: { text: '本场预计陆地' },
	// ALDT: { text: '本场实际落地' },
	// TLDT: { text: '本场目标落地' },
	// EIBT: { text: '预计上轮档' },
	// AIBT: { text: '实际上轮档' },
	// ACGT: { text: '地服实际开始' },
	// AEGT: { text: '地服实际结束' },
	// COBT: { text: '估算撤轮档' },
	// TOBT: { text: '目标撤轮档' },
	// TSAT: { text: '目标开车时间' },
	// TTOT: { text: '目标起飞时间' },
	// ASBT: { text: '开始登机' },
	// AEBT: { text: '结束登机' },
	// EOBT: { text: '预计下轮档' },
	// ETOT: { text: '预计本站起飞' },
	// ARDT: { text: '准备完成', full: '航空器准备完成，可以推出（航空公司）' },
	// ASRT: { text: '申请开车', full: '申请开车(航空公司）' },
	// ASAT: { text: '同意开车', full: '同意开车(空管)' }, //（空管）
	// AOBT: { text: '实际撤轮档' }, //
	// ATOT: { text: '实际本站起飞' }, //
	displayActualStartTime: { text: '除冰实际开始', width: '80px' }, //
	displayActualEndTime: { text: '除冰实际结束', width: '80px' }, //
	// ADIT: { text: '除冰实际持续', width: '80px' }, //
	displayEstimateStartTime: { text: '除冰预计开始', width: '80px' }, //
	displayEstimateEndTime: { text: '除冰预计结束', width: '80px' }, //
	// EDIT: { text: '除冰预计持续', width: '80px' }, //
	showVideo: { text: '播放视频', search: false, unConfigurable: true },
	preDeicing: { text: '预除冰' }, // 预除冰
	preRefueling: { text: '预加油' }, // 预加油
	// expectRunWay: { text: '计划使用跑道', width: '80px' }, // 预加油
	milestoneStatusCn: { text: '空地里程碑', width: '80px' }, //
	qualificationStatus: { text: '航空公司二类资质录入', search: { type: 'select', options: { 1: '是', 0: '否' } } }, //
	displayDSGT: { text: '放行标准保障时间', width: '100px' },
	displayTSGT: { text: '起飞标准保障时间', width: '100px' },
	displayDSTT: { text: '放行标准起飞时间', width: '100px' },
	displayTSTT: { text: '起飞标准起飞时间', width: '100px' },
	displayOverStationMinTime: { text: '最小过站时间', width: '80px' },
	displayOverStationScheduleTime: { text: ' 计划过站时间', width: '80px' },
	delayBasis: { text: '延误依据', search: { type: 'text' } },
	airportDesc: { text: '机场延误备注', search: { type: 'text' }, width: '80px' },
	airlineDesc: { text: '航司延误备注', search: { type: 'text' }, width: '80px' },
	abnormalCategory: {
		text: '不正常分类',
		referenceTo: 'delayReasonMerge',
		search: {
			type: 'cascader',
			searchKey: 'delayReasonMerge',
		},
	},
	// // EIBT2: { text: '预计上轮档' }, //
	// // ELDT2: { text: '预计落地时间' }, //
	// EXIT: { text: '预计滑入时间' }, //
	// EXOT: { text: '预计滑出时间' }, //
	// EEDT: { text: '预计关货舱门' }, //
	// EEGT: { text: '地服预计结束' }, //
};

export const defaultColumns = [
	{ key: 'flightIndex', lock: true },
	{ key: 'examine', lock: true },
	{ key: 'airlineCnName', lock: true }, //航空公司
	{ key: 'flightNo', lock: true }, //航班号
	{ key: 'tailNo', lock: true }, //机号
	{ key: 'aircraftType', lock: true }, //机型
	{ key: 'seat', lock: true }, //机位
	{ key: 'displayGate', lock: true }, //登机口
	{ key: 'flightType', lock: true }, //航班类型
	{ key: 'flightStatusText' }, //运营状态
	{ key: 'displayRouter' }, //航线
	{ key: 'direction' }, //方向
	{ key: 'sta-std' }, //计划时间
	{ key: 'ata-atd' }, //实际时间
	{ key: 'displayPreOrNxtPlanTime' }, //前后站计划时间
	{ key: 'displayPreOrNxtActualTime' }, //前后站实际时间
	{ key: 'eta-ctot' }, //预计时间
	{ key: 'displayStandardTakeOffTime' }, //标准起飞时间
	{ key: 'elecFlightStatus' }, //电子进程单状态
	{ key: 'movement' }, //进/离
	{ key: 'displayRunway' }, //跑道
	// { key: 'delayReason' }, // 延误原因
	{ key: 'exceptionReason' }, // 延误原因
	{ key: 'displayDELAYTIME' }, // 延误时间
	{ key: 'displayCOBT' }, //COBT
	{ key: 'displayTOBT' }, //TOBT
	{ key: 'vtt' }, //VTT
	{ key: 'flightIndicator' }, //航班性质
	// { key: 'flightExtStatusText' }, //外部状态
	{ key: 'relatedFlightNo' }, //关联航班号
	{ key: 'shareFlights' }, //共享航班
	{ key: 'c' }, //机类
	{ key: 'displayCarousels' }, //转盘
	{ key: 'displayCounters' }, //值机柜台
	{ key: 'terminal' }, //航站楼
	{ key: 'assignmentAgent' }, //签派代理
	{ key: 'passengerService' }, //旅客代理
	{ key: 'maintenance' }, //机务代理
	{ key: 'serviceAgent' }, //勤务代理
	{ key: 'checkInCounters' }, //已值机
	{ key: 'securityCheckQty' }, //已安检
	{ key: 'boardingCounters' }, //已登机
	{ key: 'lastModifier' }, //最后修改人
	{ key: 'contrlPoint' }, //流控点
	{ key: 'fix' }, //走廊口
	{ key: 'contrlStatus' }, //是否流控
	{ key: 'displayFirstLuggageEstimateArriveTime', width: 160 }, //首件行李预计到达时间
	{ key: 'estimateBordingLength', width: 120 }, //预计登机时长
	{ key: 'displayEstimateGuaranteeCompleteTime', width: 140 }, //预计保障完成时间
	{ key: 'displayFirstLuggageActualArriveTime', width: 160 }, //首件行李实际到达时间
	{ key: 'actualBordingLength', width: 140 }, //实际登机时长
	{ key: 'qualificationStatus' },
	{ key: 'milestoneStatusCn' },
	{ key: 'displayDSGT' },
	{ key: 'displayTSTT' },
	{ key: 'displayDSTT' },
	{ key: 'displayTSGT' },
	{ key: 'displayOverStationMinTime' },
	{ key: 'displayOverStationScheduleTime' },
	{ key: 'planRoute' },
	{ key: 'abnormalCategory' }, // 不正常分类
	{ key: 'delayBasis' }, // 延误依据
	{ key: 'airlineDesc' }, // 延误备注
	{ key: 'airportDesc' }, // 延误备注

	{ key: 'displayActualStartTime' },
	{ key: 'displayActualEndTime' },
	{ key: 'displayEstimateStartTime' },
	{ key: 'displayEstimateEndTime' },
	{ key: 'showVideo' }, //
];
