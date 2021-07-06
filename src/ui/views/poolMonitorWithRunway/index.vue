<template>
	<div class="poolMonitorWithRunway">
		<span class="buttonDiv">
			<span class="left" @click="move(-15)"><span></span></span>
			<span :class="moveNum!==0?'middle':'middle middleNow' " @click="middle"><span></span></span>
			<span class="right" @click="move(15)"><span></span></span>
		</span>
		<span class="jlg">
			<span @click="filterData('jg')">
				<span :class="{jg:jg}"></span>
				<span>进港</span>
			</span>
			<span @click="filterData('lg')">
				<span :class="{lg:lg}"></span>
				<span>离港</span>
			</span>
		</span>
		<el-dropdown class="positionDropdown" trigger="click" :hide-on-click="false">
      			<span class="el-dropdown-link">
        			<i class="el-icon-setting el-icon--right"></i>自定义
				</span>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item v-for="(opt) in pageListObj" :key="opt.key">
					<el-checkbox v-model="opt.show" :label="opt.name"></el-checkbox>
				</el-dropdown-item>
				<div @click="resetPageList" class="resetPage">重置</div>
			</el-dropdown-menu>
		</el-dropdown>

		<div class="toprunway">
			<!--<i class ="iconfont icon-feiji2 depart" />-->
			<div class="runway runway1" v-for="(opt) in runway" :key="opt.runway">
				<div class="title">{{opt.runway}}</div>
				<div :class="`zhezhao ${opt.usage==3?'zhezhaoWarn':''}`" :style="zhezhaoWidth"></div>
				<div :class="`flights ${opt.usage==3?'flightsWarn':''}`">
					<div v-if="isShowFlight(item[0].movement)" :class="'feiji fiji'+item[0].movement"
						 :style="getLeft(item[0],index)"
						 v-for="(item,index) in opt.normal" :key="index+'qaz'">
						<div class="status" :style="getFoldStyle(item,opt.runway)"
							 @click="unfoldFlightInfo(item[0],opt.runway)">
							<span class="unfoldSpan" v-for="flightData in getFlightDatas(item,opt.runway)"
								  :key="flightData.flightNo+'q'">{{flightData.elecFlightStatus || '未激活'}}</span>
							<span v-if="item.length>1" :class="getUnfoldBtnClass(item[0],opt.runway)">
								<icon-svg iconClass="paixu"></icon-svg>
							</span>
						</div>
						<div class="flightNo" :style="getFoldStyle(item,opt.runway)"
							 @click="unfoldFlightInfo(item[0],opt.runway)">
							<span class="unfoldSpan" v-for="(flightData,indexunfold) in getFlightDatas(item,opt.runway)"
								  :key="indexunfold+'w'">{{flightData.flightNo}}</span>
							<span v-if="item.length>1" :class="getUnfoldBtnClass(item[0],opt.runway)">
								<icon-svg iconClass="paixu"></icon-svg>
							</span>
						</div>
						<div class="icon">
							<icon-svg iconClass="feiji3"></icon-svg>
						</div>
					</div>
					<div v-if="isShowFlight(item[0].movement)" :class="'feiji fijiYC'+item[0].movement"
						 :style="getLeft(item[0],index)"
						 v-for="(item,index) in opt.delay" :key="item.flightNo">
						<div class="status" :style="getFoldStyle(item,opt.runway)"
							 @click="unfoldFlightInfo(item[0],opt.runway)">
							<span class="unfoldSpan" v-for="flightData in getFlightDatas(item,opt.runway)"
								  :key="flightData.flightNo+'q'">{{flightData.elecFlightStatus || '未激活'}}</span>
							<span v-if="item.length>1" :class="getUnfoldBtnClass(item[0],opt.runway)">
								<icon-svg iconClass="paixu"></icon-svg>
							</span>
						</div>
						<div class="flightNo" :style="getFoldStyle(item,opt.runway)"
							 @click="unfoldFlightInfo(item[0],opt.runway)">
							<span class="unfoldSpan" v-for="(flightData,indexunfold) in getFlightDatas(item,opt.runway)"
								  :key="indexunfold+'w'">{{flightData.flightNo}}</span>
							<span v-if="item.length>1" :class="getUnfoldBtnClass(item[0],opt.runway)">
								<icon-svg iconClass="paixu"></icon-svg>
							</span>
						</div>
						<div class="icon">
							<icon-svg iconClass="feiji3"></icon-svg>
						</div>
					</div>
				</div>
			</div>
			<div class="itemBox">
				<div class="time time1" ref="time">
					<div class="itemtime1" v-for="opt in runwayTime" :key="opt">
						<div class="timespan"></div>
					</div>
				</div>
				<div class="time time2">
					<div class="itemtime2" v-for="opt in runwayTime" :key="opt">
						<div class="title">{{getTime(opt)}}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="bottomTable">
			<div class="bottomItem " :class="opt.columns?'bottomItemTwoTable':''" v-if="opt.show"
				 v-for="(opt,index) in pageListObj" :key="index">
				<div class="itemTitle"
					 :style="'background-image:url('+opt.bg+') ;background-repeat:no-repeat;background-size:100% 100%;'">
					<div>
						{{opt.name}}（{{getLength(opt)}}）
						<el-select v-if="opt.select" v-model="delayFlights" placeholder="请选择" size="mini">
							<el-option v-for="item in delayFlightsOptions" :key="item.value" :label="item.label"
									   :value="item.value"></el-option>
						</el-select>
					</div>
					<div>
						<i v-if="!notSeting(opt)" @click="openSetting(opt)" class="el-icon-setting"></i>
						<span v-if="opt.dig" @click="bangzhu(opt) " style="color:#fff">
							<icon-svg iconClass="bangzhu"></icon-svg>
						</span>
					</div>
				</div>
				<div class="  twotablediv" v-if="opt.columns">
					<div class="tabledivItem" v-for="(optItem) in opt.columns" :key="optItem.key">
						<div class="T_title">{{optItem.name}}</div>
						<div class="tablediv">
							<AdvTable :tab-data="optItem.data" :columnConfig="optItem.tableConfig">
								<template slot="flightNo" slot-scope="{row,index}">
									<!--<div>航班号</div>-->

									<div class="flightTypeBox cursor" @click="toDetails(row)">
										<span>{{row['flightNo']||''}}</span>
										<span class="flightType">{{row['overStationType'] ? '实' : '预'}}</span>
									</div>

								</template>
								<template slot="noRequestedHandle" slot-scope="{row,index}">
									<!--<div> 过站时间不足 操作 </div>-->
									<span @click="jiantou(row,opt.key,opt.name) " class="jiantouSpan cursor">
										<icon-svg iconClass="jiantou1"
												  :style="{transform: 'rotate(-90deg)'}"></icon-svg>
									</span>
								</template>
								<template slot="requestedHandle" slot-scope="{row,index}">
									<!--<div> 过站时间不足 操作 </div>-->
									<span class="xietiao  ">
										<span class="xietiaoC1 cursor" @click="xietiao(row,opt.key) "
											  v-if="row[xietiaoObj[opt.key]]==0" :title="row.descript">
											协调
										</span>
										<span class="xietiaoC2 " v-else-if="row[xietiaoObj[opt.key]]==1"
											  :title="'备注信息：'+row.descript">
											已协调
										</span>
										<span class="xietiaoC2 " v-else :title="row.descript">
											已拒绝
										</span>
 									</span>
								</template>
							</AdvTable>
						</div>
					</div>
				</div>
				<div class="tablediv tabledivWC" v-else>
					<AdvTable :tab-data="getData(opt)" :columnConfig="opt.tableConfig">
						<template slot="flightNo" slot-scope="{row,index}">
							<!--<div>航班号</div>-->
							<span class="cursor" @click="toDetails(row)">{{row.flightNo}}</span>
						</template>
					</AdvTable>
				</div>
			</div>
		</div>
		<Setting :setting="setting" ref="Setting" col="7" @getCol="getCol"></Setting>
		<Bangzhu ref="Bangzhu"></Bangzhu>
		<Coordination ref="Coordination"></Coordination>

	</div>
</template>

<script>

    import postal from 'postal';
    import {map, keyBy} from 'lodash';
    import {setting} from './help';
    import PostalStore from "../../lib/postalStore";
    import moment from "moment"

    let postalStore = new PostalStore();
    import AdvTable from "@/ui/components/advTable.vue";
    import {remtopxByCS} from "@/ui/lib/viewSize.js";
    import Setting from "@components/setTableCol/setting";
    import Bangzhu from './components/bangzhu'
    import Coordination from './components/coordination'
    import ksgzc from '../../assets/img/ksgzc.png'
    import ljywc from '../../assets/img/ljywc.png'
    import sfhbc from '../../assets/img/sfhbc.png'
    import yywc from '../../assets/img/yywc.png'
    import cqywc from '../../assets/img/cqywc.png'

    export default {
        name: "index",
        components: {AdvTable, Setting, Bangzhu, Coordination},
        data() {
            return {
                moveNum: 0,
                unfoldObj: {},//同一个时间的多个航班是否展开
                timerInterval: null,
                nowTime: null,
                runway: [{}, {}, {}],
                runwayTime: 1,
                setting,
                jg: true,
                lg: true,
                delayFlights: 'unNormal',
                delayFlightsData: {},
                xietiaoObj: {
                    fastEnter: 'overStationStatus',
                    critical: 'criticalDelayStatus',
                },
                pageListObj: {
                    delayFlights2: {
                        name: '已延误池',
                        key: 'delayFlights2', select: true,
                        bg: ksgzc, data: [], show: true, tableConfig: []
                    },
                    fastEnter: {
                        name: '快速过站池', key: 'fastEnter', dig: true, bg: yywc, show: true, columns: {
                            fastEnter_noRequested: {
                                name: '过站时间不足',
                                key: 'fastEnter_noRequested',
                                data: [],
                                tableConfig: []
                            },
                            fastEnter_requested: {
                                name: '协调快速保障',
                                key: 'fastEnter_requested',
                                data: [],
                                tableConfig: []
                            },
                        }
                    },
                    critical: {
                        name: '临界延误池', key: 'critical', dig: true, bg: ljywc, show: true, columns: {
                            critical_noRequested: {
                                name: '临界保障延误',
                                key: 'critical_noRequested',
                                data: [],
                                tableConfig: []
                            },
                            critical_requested: {name: '协调临界保障', key: 'critical_requested', data: [], tableConfig: []},
                        }
                    },
                    initialFlights2: {
                        name: '始发航班池',
                        bg: sfhbc,
                        key: 'initialFlights2',
                        data: [],
                        show: true,
                        tableConfig: []
                    },
                    alwaysDelay: {name: '长期延误池', bg: cqywc, key: 'alwaysDelay', data: [], show: true, tableConfig: []},
                    departGuarantee: {
                        name: '起飞保障池',
                        bg: ljywc,
                        key: 'departGuarantee',
                        data: [],
                        show: true,
                        tableConfig: []
                    },
                },
                delayFlightsOptions: [{value: 'unNormal', label: '航班不正常'}, {
                    value: 'allowtakeOff',
                    label: '放行不正常'
                }, {value: 'orignalAllowTakeOff', label: '始发不正常'}, {
                    value: 'OrignalAllowTakeOffInMorning',
                    label: '早高峰始发不正常'
                }, {value: 'departure', label: '起飞不正常'}, {value: 'arrive', label: '落地不正常'}],
            }
        },
        computed: {
            getFlightDatas() {
                return (item, runway) => {
                    let blo = this.isUnfold(item[0], runway)
                    return blo ? item : [item[0]]
                }
            },
            getFoldStyle() {
                return (item, runway) => {
                    let blo = this.isUnfold(item[0], runway)
                    return {
                        width: blo ? item.length * 62 / 100 + 'rem' : '0.62rem',
                        filter: `brightness(${item[0].actualTime ? '65%' : '100%'})`
                    }
                }
            },
            isShowFlight() {
                return (movement) => {
                    let blo = movement == 'A' && this.jg || (movement == 'D' && this.lg)
                    return blo
                }
            },
            getUnfoldBtnClass() {
                return (item, runway) => {
                    let blo = this.isUnfold(item, runway)
                    return blo ? 'unfoldBtn' : 'foldBtn'
                }
            },
            getLeft() {
                return (opt) => {
                    let num = Math.floor(this.runwayTime / 2) - 1;
                    let time = this.nowTime.getTime() - num * 60 * 1000;
                    let time1 = opt.actualTime || opt.eta || opt.ctot;
                    let time2 = Math.ceil((time1 - time) / 60 / 1000) * 62
                    console.log(time1, time1 / 60);
                    return {left: time2 / 100 + 'rem', zIndex: opt.zIndex,}
                }
            },
            zhezhaoWidth() {
                let num = Math.floor(this.runwayTime / 2) - 1 - this.moveNum;
                if (num > this.runwayTime) {
                    num = this.runwayTime
                } else if (num < 0) {
                    num = 0
                }
                return {width: num * 62 / 100 + 'rem'}
            },
            notSeting() {
                return (opt) => {
                    return opt.key == 'fastEnter' || opt.key == 'critical'
                }
            },
            qgettime() {
                return (opt) => {
                    return moment(opt.actualTime || opt.eta || opt.ctot).format('HH:mm')
                }
            },
            getTime() {
                return (opt) => {
                    let num = Math.floor(this.runwayTime / 2) - this.moveNum;
                    let time = new Date(this.nowTime.getTime() + (opt - num) * 60 * 1000);
                    return moment(time).format('HH:mm')
                }
            },
            getLength() {
                return (opt) => {
                    let len = (opt.data || []).length
                    if (opt.columns) {
                        let s = opt.key + '_noRequested'
                        let s1 = opt.key + '_requested'
                        len = opt.columns[s].data.length + opt.columns[s1].data.length
                    }
                    if (opt.select) {
                        len = (this.delayFlightsData[this.delayFlights] || []).length
                    }
                    return len || 0
                }
            },
            getData() {
                return (opt) => {
                    let data = opt.data
                    if (opt.select) {
                        data = this.delayFlightsData[this.delayFlights]
                    }
                    return data
                }
            },

        },
        methods: {
            toDetails(row) {
                this.$FlightDetais.open({flightId: row.flightId})
            },
            move(num) {
                this.moveNum += num
                console.log(this.moveNum);
                let time = this.nowTime.getTime() - (Math.floor(this.runwayTime / 2) - 1 - this.moveNum) * 60 * 1000
                console.log(moment(time).format('HH:mm'));
                postal.publish({
                    channel: 'Worker',
                    topic: 'QueuesMonitor.TimeFilter',
                    data: {startTime: time}
                });
            },
            filterData(key) {
                this[key] = !this[key]
            },
            middle() {
                if (this.moveNum !== 0) {
                    this.moveNum = 0
                    this.nowTime = new Date()
                    postal.publish({
                        channel: 'Worker',
                        topic: 'QueuesMonitor.TimeFilter',
                    });
                }
            },

            //同一跑到同一时间多个航班 是否展开 runway为null时返回格式化时间
            isUnfold(item, runway) {
                let time = moment(item.actualTime || item.eta || item.ctot).format('HH_mm')
                if (!runway) {
                    return time
                }
                return this.unfoldObj[time + '_' + runway]
            },
            unfoldFlightInfo(item, runway) {
                let time = this.isUnfold(item, null)
                this.$set(this.unfoldObj, time + '_' + runway, !this.isUnfold(item, runway))
            },
            getRunwayTime() {
                let time = document.getElementsByClassName('time')[0]
                let timeitem = document.getElementsByClassName('timespan')[0]
                let timewidth = parseInt(getComputedStyle(time)['width'])
                let timeItemWidth = parseInt(getComputedStyle(timeitem)['width'])
                // console.log(parseInt(timewidth / timeItemWidth));
                return Math.ceil(timewidth / timeItemWidth)
            },

            xietiao(row, key) {
                let obj = {
                    fastEnter: {
                        role: 'edit-overstation-request-coordination',
                        type: 'overStation'
                    },
                    critical: {
                        role: 'edit-delay-request',
                        type: 'criticalDelay'
                    },

                }
                if (!this.$hasRole(obj[key].role)) {
                    return
                }
                let fn = (data) => {
                    this.$request.post('situation', 'pool/status', data, true).then((res) => {
                        if (res.code != 200) {
                            this.$message.warning(res.message)
                            return
                        }
                        this.$message.success('操作成功')
                    })
                }
                let o = {status: 1, flightId: row.flightId, type: obj[key].type}
                this.$confirm(`你确认协调${row.flightNo}航班吗?`, '提示', {
                    type: 'warning',
                    confirmButtonText: '确认协调',
                    cancelButtonText: '不协调',
                }).then(() => {
                    fn(o)
                }).catch(() => {
                    o.status = null
                    fn(o)
                    // this.$message.info('已取消操作')
                })
            },
            jiantou({flightId}, key, name) {
                let obj = {
                    fastEnter: {
                        role: 'edit-overstation-request-coordination',
                        type: 'overStation'
                    },
                    critical: {
                        role: 'edit-delay-request',
                        type: 'criticalDelay'
                    },
                }
                let type = obj[key].type
                if (this.$hasRole(obj[key].role)) {
                    this.$refs.Coordination.open({name, flightId, type})
                }
            },
            bangzhu({name, key}) {
                this.$refs.Bangzhu.open({name, key})
            },
            resetPageList() {
                map(this.pageListObj, (k, l) => {
                    k.show = true
                })
            },
            openSetting({name, key, tableConfig,}) {
                this.$refs.Setting.open({name, key, tableConfig})
            },
            getCol(cols, key) {
                this.pageListObj[key].tableConfig = [...cols]
            },

        },
        created() {
            this.nowTime = new Date()
            let time = (60 - this.nowTime.getSeconds()) * 1000
            setTimeout(() => {
                this.nowTime = new Date(this.nowTime.getTime() + time)
                this.timerInterval = setInterval(() => {
                    let num = Math.floor(this.runwayTime / 2) - 1 - this.moveNum
                    if (this.runwayTime > num && num > 0) {
                        console.log(222);
                        this.nowTime = new Date(this.nowTime.getTime() + 1000 * 60)
                    }
                }, 1000 * 60)
            }, time)
            map(this.pageListObj, (k, l) => {
                let arr = setting[l]
                if (k.columns) {
                    let arr2 = setting[l + '_noRequested']
                    let arr1 = setting[l + '_requested']
                    k.columns[l + '_noRequested']
                    map(arr1, (k1) => {
                        let obj = {...k1}
                        !k1.reference && k.columns[l + '_requested'].tableConfig.push(obj)
                    })
                    map(arr2, (k1) => {
                        let obj = {...k1}
                        !k1.reference && k.columns[l + '_noRequested'].tableConfig.push(obj)
                    })
                } else {
                    map(arr, (k1) => {
                        let obj = {...k1}
                        !k1.reference && k.tableConfig.push(obj)
                    })
                }
            })
            postal.publish({
                channel: 'Worker',
                topic: 'Page.poolMonitorWithRunway.Start',
            });
        },

        mounted() {
            this.runwayTime = this.getRunwayTime();
            // 已延误池 delayFlights2; 快速过站池 fastEnter;临界延误池 critical
            // 始发航班池 initialFlights2; 长期延误池 alwaysDelay;起飞保障池 departureGuarantee
            // let arr=['delayFlights2','fastEnter','critical','initialFlights2','alwaysDelay', 'departureGuarantee']

            postalStore.sub('runwayModels', (data) => {
                console.log('runwayModels', data);
                this.runway = data;
            })

            postalStore.sub('poolMonitorWithRunway.table', (data) => {
                let obj = this.pageListObj[data.key]
                data.key == 'critical' && console.log('critical', data['data'], data.key);
                if (!data.data || !obj) {
                    return
                }
                if (obj.columns) {
                    let s = data.key + '_noRequested'
                    let s1 = data.key + '_requested'
                    if (!data.data[s] || !this.pageListObj[data.key].columns[s]) {
                        return
                    }
                    this.$set(this.pageListObj[data.key].columns[s], 'data', data.data[s] || [])
                    this.$set(this.pageListObj[data.key].columns[s1], 'data', data.data[s1] || [])
                } else {
                    if (data.key == 'delayFlights2') {
                        this.delayFlightsData = data.data
                    } else {
                        this.$set(this.pageListObj[data.key], 'data', data.data || [])
                    }
                }
            });
        },
        beforeDestroy() {
            this.$FlightDetais.destroy()
            clearInterval(this.timerInterval)
            postal.publish({
                channel: 'Worker',
                topic: 'Page.poolMonitorWithRunway.Stop',
            })
            postalStore.unsubAll()
        },
    }
</script>

<style lang="scss" scoped>
	.resetPage {
		color: #28a745;
		cursor: pointer;
		text-align: center;
		padding-top: 10px;
	}

	.el-dropdown-menu {
		padding: 15px !important;
	}

	::v-deep .el-dropdown-menu__item {
		padding: 0px;
		border-bottom: 1px #ddd solid !important;
	}

	$border: 1px #565c67 solid;
	::v-deep .adv-table-container {
		.adv-table_main-container {
			border: 0 !important;
		}

		.adv-table_header-container {
			border: 0 !important;
		}
		table {
			tr {
				border-top: $border;
				border-bottom: $border;
				th {
					/*<!--border-top: $border;-->*/
					border-bottom: $border !important;
					border-right: 0 !important;
					background: #36445a !important;
				}
				td {
					border-right: 0 !important;
					border-bottom: $border !important;
					.flightType {
						padding: 1px;
						border: 1px solid #ffffff;
						border-radius: 4px 4px 0px 0px;
						font-size: 12px;
					}
					.jiantouSpan {
						padding: 3px 8px;
						border-radius: 2px;
						background: rgba(220, 222, 224, 0.2);
					}
					.xietiaoC1 {
						background: #4181e9;
						padding: 3px 8px;
						border-radius: 2px;
					}
					.xietiaoC2 {
						color: rgba(255, 255, 255, 0.4)
					}
				}
			}
		}
	}

	.poolMonitorWithRunway {
		& > * {
			box-sizing: border-box;
		}
		height: calc(100vh - 40px);
		overflow: hidden;
		padding: 15px 15px 0px 15px;
		.positionDropdown {
			cursor: pointer;
			color: #fff;
			position: fixed;
			z-index: 10000;
			right: -50px;
			top: calc(45vh + 7px);;
			background: linear-gradient(90deg, #4b8efd 0, #3fb3ff 100%);
			box-shadow: 0 0 0.25rem #4b4b4b;
			padding: 5px 6px;
			border-radius: 12px;
			.el-icon-setting {
				margin-right: 5px;
			}

		}

		.positionDropdown:hover {
			right: 0px;
			transition: .8s;
		}
		.buttonDiv {
			display: inline-block;
			padding: 4px 0;
			height: 27px;
			background: #0566ff;
			border-radius: 2px;
			.middle, .right, .left {
				display: inline-block;
				width: 26px;
				height: 18px;
				line-height: 18px;
				text-align: center;
				span {
					display: inline-block;
					width: 0;
					height: 0;
					border: 5px solid;
					border-color: transparent #fff transparent transparent;
				}
			}
			.right, .left {
				width: 23px;
			}
			.middle {
				$border: 1px rgba(255, 255, 255, 0.31) solid;
				border-left: $border;
				border-right: $border;
				span {
					height: 10px;
					width: 10px;
					border: 1px solid #ffffff;
					border-radius: 50%;
				}
			}
			.middleNow {
				/*background: #1E2A3D!important;*/
				/*background: rgba(59, 59, 59, 0.52);*/
			}
			.right {
				padding-left: 2px;
				span {
					border-color: transparent transparent transparent #fff;
				}
			}
		}

		.jlg {
			& > span:first-child {
				margin: 20px;
			}
			& > span {
				& > span {
					display: inline-block;
					color: #fff;
					cursor: pointer;
				}
				& > span:first-child {
					background: #979c9a;
					width: 12px;
					height: 12px;
				}
				.jg {
					background: #009f23 !important;
				}
				.lg {
					background: #2e67f6 !important;
				}
			}
		}
		.bottomTable, .toprunway {
			position: relative;
			height: calc(55vh - 32px);
			/*height: 600px;*/

		}
		.toprunway {
			margin-top: 5px;
			/*height: 395px;*/
			height: calc(45vh - 60px);
			position: relative;
			.runway {
				height: 110px;
				border-top: 1px #279dff solid;
				position: relative;
				& > div {
					height: 100%;
					position: absolute;
					left: 24px;
					color: #fff;
				}
				.title {
					line-height: 110px;
					left: 0px;
					width: 24px;
					text-align: center;
					background: #36445a;
				}
				.zhezhao {
					z-index: 100;
					width: 0px;
					background: #17212f;
					box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.50);
					border-right: 1px dashed #ffffff;
				}
				.zhezhaoWarn {
					background: #301933;
				}
				.flightsWarn {
					background: #3f2347 !important;
				}
				.flights {
					width: calc(100% - 24px);
					background: #233147;
					box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.50);
					display: flex;
					align-items: center;
					overflow: hidden;
					& > div {
						/*z-index: 200;*/
						position: absolute;
					}

					.feiji {
						transition: 1s;
						color: #fff;
						padding: 1px;
						& > div {
							font-family: FjallaOne, FjallaOne-Regular;
							text-align: center;
						}
						.icon {
							width: 62px;
						}
						.flightNo {
							padding: 4px 1px;
							margin: 6px 0 12px 0;
							background: #2e67f6;
							border-radius: 2px;
							box-shadow: 0px 0px 10px 0px #2d50a6;
						}
						.status {
							font-size: 12px;
							padding: 3px 1px;
							border: 1px solid #2e67f6;
							border-radius: 12px;
							background: #1E2A3D;

						}

						.status, .flightNo {
							width: 63px;
							white-space: nowrap;
							line-height: 14px;
							.unfoldSpan {
								font-size: 12px !important;
								padding: 0 3px;
								display: inline-block;
								border-left: 1px solid rgba(255, 255, 255, 0.51);
							}
							.unfoldSpan:first-child {
								border: none !important;
							}
							.foldBtn, .unfoldBtn {
								/*width: 15px;*/
								margin-left: -5px;
								svg {
									font-size: 12px;
									transform: rotate(90deg);
								}
							}
							.unfoldBtn {
								svg {
									transform: rotate(270deg);
								}
							}
						}
						svg {
							font-size: 25px;
						}
					}
					.fijiYCA, .fijiA {
						.status {
							border: 1px solid #3bab0b;
						}
						.flightNo {
							background: #3bab0b;
						}
					}
					.fijiYCD, .fijiD {
						svg {
							transform: rotate(-60deg);
						}
					}
					.fijiYCA, .fijiYCD {
						.icon {
							color: #c35555;
						}
					}
					.fijiD {
						.icon {
							color: #2e67f6;
						}
					}
					.fijiA {
						.icon {
							color: #3bab0b;
						}
					}
				}

			}
			.runway:first-child {
				border: none !important;
			}
			.depart {
				background: #2e67f6;
				transform: rotate(-50deg);
				display: inline-block;
			}
			/*<!--$border: 1px  solid #279dff;-->*/
			.itemBox {
				position: relative;
				top: -7px;
			}
			.time {
				position: relative;
				z-index: 300;
				width: 100%;
				display: flex;
				justify-content: left;
				.itemtime2, .itemtime1 {
					color: #fff;
					width: 62px;
				}
				.itemtime2 {
					height: 20px;
					line-height: 20px;
					div {
						width: 62px;
						text-align: center;
					}
				}
				.timespan {
					height: 5px;
					border: 1px solid #279dff;
					display: inline-block;
					width: 62px;
					border-top: 0;
				}
			}
			.time1 {
				line-height: 5px;
				width: calc(100% - 24px);
				margin-left: 24px;
				overflow: hidden;
			}
			.time2 {
				overflow: hidden;
				background: #152c4a;
				padding-left: 24px;
			}

		}
		.bottomTable {
			color: #fff;
			width: 100%;
			overflow-x: auto;
			white-space: nowrap;
			.bottomItem {
				display: inline-block;
				height: calc(55vh - 40px);
				padding: 5px;
				width: 20% !important;
				vertical-align: top;
				.tablediv {
					margin-top: -1px;
					position: relative;
					width: 100%;
					height: calc(100% - 40px);
				}
				.tabledivWC {
					border: $border;
					border-top: 0;
				}
				.twotablediv {
					height: calc(100% - 40px);
					.T_title {
						width: 100%;
						height: 37px;
						line-height: 37px;
						background: #36445a;
						text-align: center;
						border-bottom: $border;
						position: relative;
						z-index: 10;
					}
					.tabledivItem {
						width: 50% !important;
						height: calc(100%);;
						display: inline-block;
						position: relative;
						border: $border;
						border-top: 0;
					}
					.tabledivItem:last-child {
						border-left: 0;
					}
				}
				.adv-table-container {
					width: 100%;
				}
				.itemTitle {
					width: 100%;
					height: 37px;
					line-height: 37px;
					border-radius: 6px 6px 0 0;
					/*background: #234479;*/
					display: flex;
					padding: 0 15px;
					justify-content: space-between;
					::v-deep .el-select {
						width: 120px;
						.el-input__inner {
							background: rgba(0, 124, 215, 0.55) !important;
							border: 1px solid rgba(255, 255, 255, 0.45) !important;
							color: #ffffff;
						}
					}
				}
			}
			.bottomItemTwoTable {
				width: 40% !important;
			}
		}
	}
</style>