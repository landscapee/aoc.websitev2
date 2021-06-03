<template>
	<div class="poolMonitorWithRunway">
		<span class="buttonDiv">
			<span class="left" @click="left"><span></span></span>
			<span class="middle" @click="middle"><span></span></span>
			<span class="right" @click="right"><span></span></span>
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
				<el-dropdown-item v-for="(opt) in pageList" :key="opt.key">
					<el-checkbox v-model="opt.show" :label="opt.name"></el-checkbox>
				</el-dropdown-item>
				<div @click="resetPageList" class="resetPage">重置</div>
			</el-dropdown-menu>
		</el-dropdown>

		<div class="top">
			<div style="width: 100px ;height: 100px;background: url('../../assets/img/ksgzc.png')">

			</div>
		</div>
		<div class="bottom">
			<div class="bottomItem " :class="opt.columns?'bottomItemTwoTable':''" v-if="opt.show"
				 v-for="(opt,index) in pageList" :key="index">
				<div class="itemTitle"
					 :style="'background-image:url('+opt.bg+') ;background-repeat:no-repeat;background-size:100% 100%;'">
					<div>
						{{opt.name}}（{{getLength(opt)}}）
						<el-select v-if="opt.select" v-model="delayFlights" placeholder="请选择" size="mini"  >
							<el-option v-for="item in delayFlightsOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
					<div>
						<i v-if="!notSeting(opt)" @click="openSetting(opt)" class="el-icon-setting"></i>
						<span v-if="opt.dig" @click="bangzhu(opt) "  style="color:#fff"  >
							<icon-svg  iconClass="bangzhu"  ></icon-svg>
						</span>
					</div>
				</div>
				<div class="  twotablediv" v-if="opt.columns">
					<div class="tabledivItem" v-for="(optItem) in opt.columns" :key="optItem.key">
						<div class="T_title">{{optItem.name}}</div>
						<div class="tablediv">
							<AdvTable :tab-data="optItem.data" :columnConfig="optItem.tableConfig">
								<template slot="handle" slot-scope="{row,index}">
									<!--<div> 过站时间不足 操作 </div>-->
									<span @click="jiantou(row) "  class="jiantouSpan cursor">
										<icon-svg  iconClass="jiantou1" :style="{transform: 'rotate(-90deg)'}" ></icon-svg>
									</span>
								</template>
							</AdvTable>
						</div>
					</div>
				</div>
				<div class="tablediv tabledivWC" v-else>
					<AdvTable :tab-data="getData(opt)" :columnConfig="opt.tableConfig">

					</AdvTable>
				</div>
			</div>
		</div>
		<Setting :setting="setting" ref="Setting" col="7" @getCol="getCol"></Setting>
		<Bangzhu   ref="Bangzhu"  ></Bangzhu>

	</div>
</template>

<script>
    import postal from 'postal';
    import {map, keyBy} from 'lodash';
    import {setting} from './help';
    import PostalStore from "../../lib/postalStore";

    let postalStore = new PostalStore();
    import AdvTable from "@/ui/components/advTable.vue";
    import Setting from "@components/setTableCol/setting";
    import Bangzhu from './bangzhu'
    import ksgzc from '../../assets/img/ksgzc.png'
    import ljywc from '../../assets/img/ljywc.png'
    import sfhbc from '../../assets/img/sfhbc.png'
    import yywc from '../../assets/img/yywc.png'
    import cqywc from '../../assets/img/cqywc.png'



    export default {
        name: "index",
        components: {AdvTable, Setting,Bangzhu},
        data() {
            return {
                cqywc,
                setting,
                jg: true,
                lg: true,
                delayFlights:'unNormal',
                delayFlightsData:{},
                pageListObj: {
                    delayFlights2: {name: '已延误池',
                        key: 'delayFlights2', select: true,
                        bg: ksgzc, data: [], show: true, tableConfig: []
                    },
                    fastEnter: {
                        name: '快速过站池', key: 'fastEnter',dig:true, bg: yywc, show: true, columns: {
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
                        name: '临界延误池', key: 'critical',dig:true, bg: ljywc, show: true, columns: {
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
                delayFlightsOptions: [{ value: 'unNormal', label: '航班不正常' }, { value: 'allowtakeOff', label: '放行不正常' }, { value: 'orignalAllowTakeOff', label: '始发不正常' }, { value: 'OrignalAllowTakeOffInMorning', label: '早高峰始发不正常' }, { value: 'departure', label: '起飞不正常' }, { value: 'arrive', label: '落地不正常' }],

            }
        },
        computed: {
            notSeting() {
                return (opt) => {
                    return opt.key == 'fastEnter' || opt.key == 'critical'
                }
            },
            getLength() {
                return (opt) => {
                    let len = (opt.data || []).length
                    if (opt.columns) {
                        len = opt.columns[0].data.length + opt.columns[1].data.length
                    }
                    if (opt.select) {
                        len =(this.delayFlightsData[this.delayFlights]||[]).length
                    }
                    return len || 0
                }
            },
			getData() {
                return (opt) => {
                    let data = opt.data
                    if (opt.select) {
                        data =this.delayFlightsData[this.delayFlights]
                    }
                     return data
                }
            },
            pageList() {
                return map(this.pageListObj, (k, l) => {
                    let obj = {...k}
                    if (obj.columns) {
                        obj = {...obj, columns: {...obj.columns}}
                        let arr = map({...obj.columns}, (item, i) => {
                            return item
                        })
                        obj.columns = arr
                    }
                    return obj

                })
            },
        },


        methods: {
            left() {

            },
            filterData(key) {
                this[key] = !this[key]
            },
            middle() {

            },
            right() {

            },

            jiantou(opt){
                console.log('qqqq',this.$hasRole('edit-overstation-request-coordination'));
            },
			bangzhu({name, key}){
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
            // 已延误池 delayFlights2; 快速过站池 fastEnter;临界延误池 critical
            // 始发航班池 initialFlights2; 长期延误池 alwaysDelay;起飞保障池 departureGuarantee
            // let arr=['delayFlights2','fastEnter','critical','initialFlights2','alwaysDelay', 'departureGuarantee']

            postalStore.sub('poolMonitorWithRunway.channel', (data) => {
                let obj = this.pageListObj[data.key]
              data.key=='fastEnter'&&  console.log('batchConcern111', data['data'], data.key);

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
					if(data.key=='delayFlights2'){
                        console.log('delayFlights2',data.data);
                        this.delayFlightsData=data.data
					}else{
                        this.$set(this.pageListObj[data.key], 'data', data.data || [])

                    }
                }

            });
        },
        beforeDestroy() {
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
		.bottom, .top {
			position: relative;
			height: calc(55vh - 46px);
		}
		.top {
			height: calc(45vh - 46px);
		}
		.bottom {
			color: #fff;
			width: 100%;
			overflow-x: auto;
			white-space: nowrap;
			.bottomItem {
				display: inline-block;
				height: calc(55vh - 55px);
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
					::v-deep .el-input__inner{
						background: rgba(0, 124, 215, 0.55);
						border: 1px solid rgba(255, 255, 255, 0.45);
						color: #ffffff;
					}
				}
			}
			.bottomItemTwoTable {
				width: 40% !important;
			}
		}
	}
</style>