<template>
	<div class="topIndex">
		<div class="cbqst cursor" @click="showLineOption('dataLineCB')">
			除冰趋势图

		</div>
		<div class="cbqstLine ">
			<MYLine v-show="dataLineCB" :options="dataLineCB" @close="lineClose" ref="dataLineCB"></MYLine>
		</div>
		<div class="item item0">

			<div class="rightItem">
				<icon-svg iconClass="tianqi"></icon-svg>

				<div class="timeText">
					<div class="first"><span>{{ weather.temp||'--'}}</span>℃</div>
					<div class="second">温度</div>
				</div>
				<div class="shuxian"></div>
				<div class="timeText">
					<div class="first"><span>{{ weather.humid||'--'}}</span>%</div>
					<div class="second">湿度</div>
				</div>
				<div class="shuxian"></div>
				<div class="timeText">
					<div class="first"><span>{{ weather.td||'--'}}</span>℃</div>
					<div class="second">露点温度</div>
				</div>
			</div>
		</div>
		<div class="item item1">

			<div class="rightItem">
				<icon-svg iconClass="cbcl"></icon-svg>
				<div class="timeText rightItemleft cursor" @click="edit('carTotal')">
					<div class="first" ref="carTotal">
						<el-input ref="input" v-model="value" @blur="blur" @keyup.enter.native="submit"
								  v-if=" editKey=='carTotal'"></el-input>
						<span v-else>{{deiceStatistics.carTotal||'--'}}</span>辆
					</div>
					<div class="second">除冰车辆总数</div>
				</div>
				<div class="shuxian"></div>
				<div class="timeText cursor" @click="edit('carUsed')">
					<div class="first" ref="carUsed">
						<el-input ref="input" v-model="value" @blur="blur" @keyup.enter.native="submit"
								  v-if=" editKey=='carUsed'"></el-input>

						<span v-else>{{deiceStatistics.carUsed||'--'}}</span>辆
					</div>
					<div class="second">启用总数</div>
				</div>
			</div>
			<div class="positionBottom">
				<el-progress :percentage="getPercentage"></el-progress>
			</div>
		</div>
		<div class="item item2 cursor">
			<div class="rightItem">
				<div class="rightItem" @click="showLineOption('dataLineLG')">
					<icon-svg iconClass="lgsl"></icon-svg>
					<div class="timeText">
						<div class="first"><span>{{get(departRate,'D.rate','--')}}</span>架次/小时</div>
						<div class="second">离港速率</div>
					</div>

				</div>
				<div class="tableBoxPosition ">
					<MYLine v-show="dataLineLG" :options="dataLineLG" @close="lineClose" ref="dataLineLG"></MYLine>
				</div>
			</div>

		</div>
		<div class="item item3">
			<div class="rightItem">
				<icon-svg iconClass="cbsl"></icon-svg>
				<div class="timeText cursor" @click="edit('currentDeiceRate')">
					<div class="first" ref="currentDeiceRate">
						<el-input ref="input" v-model="value" @blur="blur" @keyup.enter.native="submit"
								  v-if=" editKey=='currentDeiceRate'"></el-input>

						<span v-else>{{deiceStatistics.currentDeiceRate||'--'}}</span>分/架次
					</div>
					<div class="second">除冰速率</div>
				</div>

			</div>
		</div>
		<div class="item item4">
			<div class="rightItem">
				<icon-svg iconClass="schk"></icon-svg>
				<div class="timeText">
					<div class="first"><span>{{getShulv('timePeriod.deiceRate.3U')}}</span>分/架次</div>
					<div class="second">川航除冰速率</div>
				</div>

			</div>
		</div>
		<div class="item item5">
			<div class="rightItem">
				<icon-svg iconClass="guohang"></icon-svg>
				<div class="timeText">
					<div class="first"><span>{{getShulv('timePeriod.deiceRate.CA')}}</span>分/小时</div>
					<div class="second">国航除冰速率</div>
				</div>

			</div>
		</div>
		<div class="item item6">
			<div class="rightItem">
				<icon-svg iconClass="dfcb"></icon-svg>
				<div class="timeText">
					<div class="first"><span>{{getShulv('timePeriod.deiceRate.DF')}}</span>分/小时</div>
					<div class="second">地服除冰速率</div>
				</div>

			</div>
		</div>

	</div>
</template>

<script>
    import MYLine from './Line'
    import {get,map} from 'lodash'
    import {getOptionsLG,getOptionsCB} from './options'

    import moment from 'moment'
    import PostalStore from '@ui_lib/postalStore'
    import {memoryStore} from "@/worker/lib/memoryStore";

    let postalStore = new PostalStore()
    export default {
        // name: 'topIndex',
        components: {MYLine},
        data() {
            return {
                value: '',
                editKey: '',

                get,
                weather: {},// 天气
                deiceStatistics: {},// 除冰
                departRate: {},// 离港速率
                departureRate: {},// 离港速率 离港速率变化曲线图
                dataLineLG: null,
                dataLineCB: null,
             }
        },
        computed: {

            getShulv() {
                return (key) => {
                    let now = memoryStore.getItem('global').now
                    let nowHour = moment(now).format('HH');
                    let data = get(this.deiceStatistics, key, '--')
                    return data[nowHour] || 0
                }
            },
            getPercentage() {
                let num = this.deiceStatistics.carUsed || 0
                let num1 = this.deiceStatistics.carTotal || 1
                return Number((num / num1 * 100).toFixed(2))
            },
            displayTime() {
                return (type, index) => {

                    let v
                    if (!v || !moment(v).isValid()) {
                        return '--'
                    }
                    return moment(v).format(type)
                }
            },
            getData() {
                return (opt) => {
                    return 1
                }
            }

        },
        methods: {
            submit() {
                let reg = /^[1-9]\d*$/g
                let type = 'zs' //整数
                let s = '请输入正整数'
                if (this.editKey == 'currentDeiceRate') {
                    type = 'xs'//小数
                    s = '请输入正确的数字(保留两位小数）'
                    reg = /^(([^0][0-9]+|0)\.([0-9]{1,2}))$|^[1-9]\d*$/g
                }
                let blo = reg.test(this.value)
                console.log(this.value, reg, blo);

                if (!blo) {
                    this.$message.warning(s)
                    return false
                }
                let obj = {
                    'carTotal': 'totalCarCount',
                    'carUsed': 'usedCarCount',
                    'currentDeiceRate': 'deiceRate'
                }
                let key = this.editKey
                let data = {}
                data[obj[key]] = this.value
                this.$request.post('adverse', 'deice/edit', data, false, 'put').then((res) => {
                    if (res.code == 200) {
                        this.editKey = ''
                        this.$message.success('编辑成功')
                    } else {
                        this.$message.warning(res.message)
                    }
                })
            },
            edit(key) {
                this.editKey = key
                this.value = this.deiceStatistics[key]
            },
            blur() {
                this.editKey = ''
                this.value = ''
            },
            lineClose(key) {
                this[key] = null
				this.options=null
             },
            showLineOption(key) {
				// key= dataLineLG |dataLineCB
                this[key] = this.getOptions(key)

                this.$refs[key].open(  key)
            },
			getOptions(key){
				let obj={
                    dataLineCB: {
                        getYData:this.getCBYData(),
						getOptions:getOptionsCB
					},
                    dataLineLG: {
                        getYData:this.getLGData(),
                        getOptions:getOptionsLG
					},
				}
				let data=obj[key]
                console.log(data.getOptions(data.getYData),data);
                return data.getOptions(data.getYData)
			},
			getLGData(){
                let obj={
                    '02L跑道':{
                        data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
						runway:'02L跑道'
					},
                    '02跑道':{
                        data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
						runway:'02跑道'
					},
                    '11跑道':{
                        data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
						runway:'11跑道'
					},
                    '全部跑道':{
                        data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
						runway:'全部跑道'
					},
				}
                let ratesObj={}
                let arr=[]
				map(this.departureRate.rates,(k,l)=>{
                    ratesObj[k.runway]=k
                })
				map(obj,(k,l)=>{
                    arr.push(ratesObj[l]||k)

				})
                console.log(11,ratesObj);
                this.departureRate.rates=arr
                return this.departureRate
			},
            getCBYData() {
                let deiceStatistics = this.deiceStatistics
                let time = map(new Array(24), (item, index) => {
                    if (index < 10) {
                        return '0' + index;
                    } else {
                        return '' + index;
                    }
                });
                let yData = [];
                yData.push({
                    data: map(time, (item) => get(deiceStatistics, `timePeriod.departSchedule.total.${item}`)),
                    name: '计划出港'
                });
                yData.push({
                    data: map(time, (item) => get(deiceStatistics, `timePeriod.deiceSchedule.total.${item}`)),
                    name: '预计除冰'
                });
                yData.push({
                    data: map(time, (item) => get(deiceStatistics, `timePeriod.deiceFinish.total.${item}`)),
                    name: '已除冰'
                });
                console.log(this.deiceStatistics, yData);
                return yData
            },
        },
        created() {
        },
        mounted() {
            postalStore.sub('Page.deiceTop', ({data, key}) => {

                console.log(1122221, key, data);
                this[key] = data
            })
        },
        beforeDestroy() {
            postalStore.unsubAll()
        },
    }
</script>

<style lang="scss" scoped>
	.topIndex {
		box-sizing: border-box;
		height: 70px;
		width: 100%;
		display: flex;
		color: #fff;
		.cbqst {
			width: 90px;
			height: 30px;
			text-align: center;
			line-height: 30px;
			background: rgba(5, 102, 255, 0.13);
			border: 1px solid rgba(5, 102, 255, 0.49);
			border-radius: 2px;
			position: absolute;
			right: 15px;
			top: 10px;
			color: #0566ff;

		}
		.cbqst:hover {
			background: #0566ff;
			color: #fff;
		}
		.cbqstLine {
			position: absolute;
			right: 15px;
			top: 137px;
			border-radius: 4px;
			z-index: 1001;
		}

		.item {
			height: 100%;
			flex: 1 1 auto;
			border-radius: 5px;
			box-shadow: 0px 2px 10px 0px rgba(63, 78, 90, 0.05);
			margin-left: 10px;
			padding: 12px 22px;
			.rightItem {
				width: 100%;
				display: flex;
				align-items: center;
				position: relative;
				.shuxian {
					height: 25px;
					border-right: 1px solid #2696d1;
				}
				.timeText {
					margin-left: 15px;
					.first {
						margin-bottom: 5px;
						span {
							font-size: 22px;
							font-family: FjallaOne;
							margin-right: 1px;
						}
						::v-deep .el-input {
							width: 50px !important;
							margin: 0 !important;
							background: rgba(255, 255, 255, 0) !important;
							.el-input__inner {
								border-radius: 2px;
								border-color: #fff !important;
								background: rgba(255, 255, 255, 0.27) !important;
								height: 20px;
								width: 50px !important;
								padding: 0 1px !important;
							}
						}
					}
					.second {
						color: rgba(255, 255, 255, 0.51);
					}
				}
			}
			svg {
				width: 45px;
				height: 45px;
			}
		}
		.item0, .item1 {
			width: 324px;
			flex: 0 1 auto;
		}
		.item0 {
			margin-left: 0;
			display: flex;
			background: #3280e7;
			.rightItem {
				justify-content: space-between;
			}
			.shuxian {
				margin-left: 15px;
			}
		}
		.item1 {
			position: relative;
			background: #32a9e7;
			border-radius: 5px;

			.shuxian {
				margin: 0 10px 0 25px;
			}
			.rightItemleft {
				margin-left: 10px;
			}
			.rightItem {
				position: relative;
			}
			.positionBottom {
				width: calc(100% - 24px);
				position: absolute;
				left: 22px;
				bottom: 1px;
				border-radius: 4px;
				z-index: 1000;
			}
		}

		.item2 {
			background: #32c8e7;
			.rightItem {

				position: relative;
				.tableBoxPosition {
					position: absolute;
					top: 75px;
					left: -240px;
					z-index: 1000;
					border-radius: 4px;
				}

			}
		}
		.item3 {
			background: #24ca87;
		}
		.item4 {

			background: #72c165;
		}
		.item5 {
			background: #6b47c6;
		}
		.item6 {
			background: #8f35aa;
		}

	}

	::v-deep .el-progress-bar__outer {
		background: #248fc6;
		height: 4px !important;
	}

	::v-deep .el-progress-bar__inner {
		background: #FFF;
		height: 4px !important;
	}

	::v-deep .el-progress__text {
		color: #fff;
		font-size: 12px !important;
	}

</style>