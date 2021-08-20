<template>
	<div class="footerIndex">
		<div class="left item">
			<TrafficCapacity></TrafficCapacity>
		</div>
		<div class="right item">
			<div class="divBox">
				<div class="titleSX">
					航班调整调减
				</div>
				<div class="tableBox">
					<ele-table :columnConfig=" tableConfig" :table-data="getPlanData">

					</ele-table>
				</div>
			</div>
			<div class="huifujieduan">
				<div class="titleSX">恢复阶段运行决策</div>
				<div class="content">
					<div class="huifujieduanleft">
						<el-form ref="form"   :inline="true" label-position="top" :model="form" class="demo-form-inline">
							<el-form-item label="开始时间">
								<el-date-picker :clearable="false" v-model="form.startTime" type="datetime" value-format="timestamp" format="yyyy-MM-dd HH:mm" placeholder=" "></el-date-picker>
							</el-form-item>
							<el-form-item label="结束时间">
								<el-date-picker :clearable="false"  v-model="form.endTime" type="datetime" value-format="timestamp" format="yyyy-MM-dd HH:mm" placeholder=" "></el-date-picker>

							</el-form-item>
							<el-form-item label="跑道模式" >
								<el-select v-model="form.direction" @change="diretionChange"  placeholder=" ">
									<el-option v-for="opt in runwayDirection" :key="opt.value" :label="opt.label"
											   :value="opt.value"></el-option>
								</el-select>
								<div class="selectPadding" v-for="item in getRunwayData">
									<div class="label"> <span>{{item}}</span></div>
									<el-select v-model="form.useAge[item]" placeholder="请选择" >
										<el-option v-for="opt in getOption(item)" :key="opt.value" :label="opt.label"
												   :value="opt.value"></el-option>
									</el-select>
								</div>
							</el-form-item>
							<div class="buttonDiv">
								<el-button size="mini" @click="reset"><i class="el-icon-refresh-left"></i> 重置</el-button>
								<el-button type="primary" @click="handleSubmit('form')" size="mini">确定</el-button>
							</div>
						</el-form>
					</div>
					<div class="huifujieduanright">
						<el-tabs v-model="activeName" @tab-click="handleClick">
							<el-tab-pane  :name="item" v-for="item in tabArr" :key="item+'q'" >
								<!--:label="`${item}（${getLength(item)}）`"-->
								<span slot="label">{{item}} <span class="font12">({{getLength(item)}})</span></span>
							</el-tab-pane>
						 </el-tabs>
						<div class="tableBox" v-if="isObjectK">
							<ele-table :columnConfig=" tableConfig1" :table-data="getTableData">
								<el-table-column   slot="displayRouter" label="航线" align="center"  >

									<template   slot-scope="{row}" >
										<div class="hangxian"  >
											<div v-for="(opt,index) in row.displayRouter" :key="index">
												<span v-if="index!==0"><icon-svg iconClass="jiantou"></icon-svg></span>
												<span>{{opt}} </span>
											</div>
										</div>
									</template>
								</el-table-column>
								<el-table-column  label="计划时间"   slot="staStd" align="center"width="60px" >

									<template   slot-scope="{row}" >
										<div   >
											 {{getTime(row)}}
										</div>
									</template>
								</el-table-column>
							</ele-table>

						</div>
						<div class="kong" v-else>
							暂无数据
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    import postal from 'postal';
    import PostalStore from "@ui_lib/postalStore";

    let postalStore = new PostalStore();
    import TrafficCapacity from '../../../components/trafficCapacity/trafficCapacity'
    import {columns,columnsRunDecision} from './help'
    import {mapValues, filter, map, get} from 'lodash'

    export default {
        name: "footerIndex",
        components: {TrafficCapacity},
        data() {
            return {
                tableConfig1:columnsRunDecision,
                tabArr:[],
                activeName:'11',
                runwayObj:{
                    north:['11','01','02'],
                    south:['11','19','20']
				},
                runwayDirection: [{value: "north", label: "北"}, {value: "south", label: "南"}],
                runway11: [{value: 1, label: "起飞"}, {value: 3, label: "暂停使用"}],
                runway1Or2: [{value: 0, label: "落地"}, {value: 1, label: "起飞"}, {value: 2, label: "起飞+落地"}, {value: 3, label: "暂停使用"}],
                form: {useAge:{},direction:'north'},
                tableConfig: columns,
                suggestPlan: [],//航班调整调减
                 runDecisionTable:{},//恢复阶段运行决策
                currentType:null,// 调整调减类型
                rules: {
                    name: [
                        { required: true, message: '请输入', trigger: 'blur' },
					],

                }
            }
        },
		computed:{
            getPlanData(){
              return this.currentType&&this.suggestPlan
			},
			getTableData(){
              return this.runDecisionTable[this.activeName]
			},
			isObjectK(){
			    return Object.keys(this.runDecisionTable)?.length
			},
            getRunwayData(){
                return this.runwayObj[this.form.direction]
			},
            getOption(){
                return (val)=>{
                    let data=val=='11'?this.runway11:this.runway1Or2
                    return data
				}
			} ,
			getLength(){
                return (key)=>{
                    let len=this.runDecisionTable[key]?.length||0
                    return len
				}
			},
			getTime(){
                return (data)=>{

                    let movement = get(data, "movement")
                    return  movement === "D" ? get(data, "displaySTDWithDate", "&#45;&#45;") : get(data, "displaySTAWithDate", "&#45;&#45;")
				}
			}
		},
        methods: {
            handleClick(){
                console.log(this.activeName);
            },
            reset(){
                this.runDecisionTable={}
                this.tabArr=[]
                this.form.useAge={}
			},
            diretionChange(){
                this.reset()
			},
			submit(){
                let obj={...this.form}

                postal.publish({
                    channel: 'Worker',
                    topic: 'get.runDecisionTable.data',
                    data: obj,
                });
			},
            handleSubmit(form){
                console.log(this.form);
                let fn=(num,obj)=>{
                    let blo=Object.keys(obj).length==num
					return blo
				}
				if(fn(4,this.form)){
                    if(fn(3,this.form.useAge)){
						if(this.form.startTime>new Date().getTime()){
                            if(this.form.endTime>this.form.startTime){
									this.submit()
                            }else {
                                this.$message.warning('结束时间不能小于开始时间')
                            }
						}else {
                            this.$message.warning('开始时间不能小于当前时间')
						}
                    }else{
                        this.$message.warning('参数不能为空')
                        return false
                    }
				}else{
				    this.$message.warning('参数不能为空')
				    return false
				}
            },
            formatSuggestForEdit(currentReduce) {
                const formatData = (data) => {
                    let totalA = 0;
                    let totalR = 0;
                    map(data, (item) => {
                        totalA += item.totalPlanAdjust || 0;
                        totalR += item.totalPlanReduce || 0;
                    });
                    return {
                        ...mapValues(data, (item) => ({...item, A: item.totalPlanAdjust, R: item.totalPlanReduce})),
                        total: {A: totalA, R: totalR}
                    };
                };

                let actualPlan = mapValues(currentReduce.planDetail, (item) => {
                    return {
                        totalPlanAdjust: filter(item, (plan) => plan.type === 'A').length,
                        totalPlanReduce: filter(item, (plan) => plan.type === 'R').length,
                    };
                });
                const airLines = [{key: 'total', cnName: '全部'}, {key: 'CA', cnName: '国航'}, {
                    key: '3U',
                    cnName: '川航'
                }, {key: 'MU', cnName: '东航'}, {key: 'CZ', cnName: '南航'}, {key: 'EU', cnName: '成航'}, {
                    key: '8L',
                    cnName: '祥航'
                }, {key: 'other', cnName: '其他'}];
                let formated = formatData(currentReduce.plan);
                let formatedActual = formatData(actualPlan);
                return map(airLines, (item, key) => {
                    let current = formated[item.key];
                    let actualCurrent = formatedActual[item.key];
                    return {
                        ...current,
                        airline: item.cnName,
                        A: current?.A||0,
                        R: current?.R||0,
                        actualA: get(actualCurrent, 'A', 0),
                        actualR: get(actualCurrent, 'R', 0)
                    };
                });
            },
            getCurrentDelayType() {
                this.$request.get('adverse', 'adjust/getCurrentDelayType').then((res) => {
                    this.currentType = res.data.type==2
                    console.log(this.currentType);

                })
            },

        },
        created() {
            this.getCurrentDelayType()
        }
        ,
        mounted() {
            postalStore.sub('push.delayNew.data', ({data, key}) => {
                let myData = data
                if(key=='runDecisionTable'){//恢复阶段运行决策
                    this.tabArr=[]
					map(data,(k,l)=>{
                        console.log(l);
                        l==='11'? this.tabArr.unshift(l):this.tabArr.push(l)
					})
				}
                 this[key] = myData;
            });
            //
            postalStore.sub('FlightsByHours.GetCurrentReduce.Response', (data) => {
                console.log(11,data);
                this.suggestPlan =this.formatSuggestForEdit(data.currentReduce) || [];
            });

            postal.publish({
                channel: 'Worker',
                topic: 'Decrease.GetCurrentReduce',
                data: '2',
            });
            postal.publish({
                channel: 'Worker',
                topic: 'Adverse.Network.Connected',
             });
            postal.publish({
                channel: 'Worker',
                topic: 'Page.FlightAdjustment.Start',
             });
        }
        ,
        beforeDestroy() {
            postalStore.unsubAll()

        }
    }
</script>

<style lang="scss" scoped>
	.footerIndex {
		height: 100%;
		width: 100%;
		display: flex;
		color: #fff;
		.item {
			width: calc(50% - 6px);
		}
		.left {
			margin-right: 12px;
		}
		.right {
			display: flex;
			.huifujieduan,
			.divBox {
				padding: 12px;
				height: 100%;
				background: rgba(25, 37, 60, 0.81);
				border-radius: 5px;

			}
			.divBox {
				margin-right: 12px;
				width: 270px;
				.tableBox {
					height: calc(100% - 30px);
					margin-top: 12px;
					::v-deep .cell {

						div {
							font-family: ALiB;
							font-size: 12px !important;
						}
					}
				}
			}
			.huifujieduan {
				width: calc(100% - 282px);
				.content {
					margin-top: 12px;
					height: calc(100% - 30px);
					display: flex;
					$border: 1px #111926 solid;
					.huifujieduanleft, .huifujieduanright {
						height: 100%;
						padding: 12px 3px;
						border-top: $border;
					}
					.huifujieduanleft {
						padding-top: 0px;
						border-right: $border;
						width: 180px;
						overflow-y: auto;
						.buttonDiv{
							text-align: center;
							margin-top:20px;
							::v-deep .el-button:first-child{
								background: rgba(255, 255, 255, 0);
								border: 1px #666 solid;
								padding: 7px 15px;
							}
							::v-deep .el-button:last-child{
								padding: 7px 20px;
							}
							::v-deep .el-button:first-child:hover{

								background:#666;
								border: 1px #666 solid;
								color: #fff;
							}
						}
						::v-deep .el-form {
							.el-form-item {
								margin: 0!important;
								.selectPadding{
									position: relative;
									.label{
										position: absolute;
										z-index: 100;
										font-size: 12px;
 										padding:0 5px;
										height: 40px!important;
										display: flex;
										align-items: center;
									}
									.label::after{
										content: '';
										display: inline-block;
										margin-left: 5px;
										width: 1px;
										height: 14px;
										background: #37455c;
 									}
									.el-input__inner{
										padding-left: 32px;
									}
								}
								.el-select,
								.el-date-editor {
									width: 100%;
								}

								.el-input__inner{
									height: 30px;
									font-size: 12px;
									font-family: FjallaOne;
								}
							}
							.el-form-item__label {
								padding: 0;
								color: #fff;
								height: 30px;
							}
						}
					}
					.huifujieduanright {
						width: calc(100% - 180px);
						padding-top: 0px;
						.kong{
							text-align: center;
							height: 150px;
							line-height: 150px;
							color: rgba(255, 255, 255, 0.51);
						}
						.tableBox {

							width: 100%;
							height: calc(100% - 22px);
							position: relative;


							::v-deep  .cell {
								font-size: 12px !important;
								font-weight: 400;
								padding: 0 2px !important;
								* {
									font-size: 12px !important;
								}
								.hangxian {
									display: flex;
									justify-content: center;
									&>div{
										flex:  0 1 auto;
									}
									svg {
										margin: 0 2px;
										width: 10px;
										fill: #3b639a;
									}
								}

							}

						}
						::v-deep .el-tabs {
							.el-tabs__item  {
								height: 30px;
								line-height: 30px;
								color: #fff!important;
								&>span{
									font-weight: 500;
								}
								.font12{
									font-size: 12px;
								}
							}
							.el-tabs__header{

								margin-bottom: 5px;
							}
							.el-tabs__active-bar  {
								height: 1px;
							}
							.el-tabs__nav {
								left: 50%;
								transform: translateX(-50%)!important;
							}
							.el-tabs__nav-wrap:after{
								height: 1px;
								background-color: rgba(5, 102, 255, 0.15);
							}
						}
					}
				}
			}
		}

	}
</style>