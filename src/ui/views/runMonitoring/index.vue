
 <template>
	<div class="runMonitoringIndex">

		<div class="listMonitor">
			<el-dropdown class="positionDropdown" trigger="click" :hide-on-click="false">
      			<span class="el-dropdown-link">
        			<i class="el-icon-setting el-icon--right"></i>自定义
				</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item   v-for="(opt) in pageList" :key="opt.key">
						<el-checkbox @change="showChange" v-model="runMonitorShow[opt.key]" :label="opt.name"></el-checkbox>
					</el-dropdown-item>
					<div @click="resetPageList" class="resetPage">重置</div>
				</el-dropdown-menu>
			</el-dropdown>
			<div  class="itemMonitor" :class="  index>2?' itemMonitor1':'' " v-if="runMonitorShow[opt.key]" v-for="(opt,index) in pageList" :key="index">
				<div class="itemTitle">
					<div>{{opt.name}}（{{(opt.data||[]).length}}）</div>
					<div >

						<span v-if="isWarning(opt)" @click="openWaring(opt) " :class="{infoIcon:!getMoreWarnLength(opt.key)}">
							<!--<icon-svg  iconClass="warning" ></icon-svg>-->
							<i class="iconfont icon-warning"></i>

						</span>
 						<i @click="openSetting(opt)" class="iconfont icon-zidingyi"></i>
						<icon-svg @click.native="openBangzhu(opt)" v-if="!opt.bangzhu" iconClass="bangzhu" ></icon-svg>
					</div>

				</div>
				<div class="tablediv">
					<AdvTable :tab-data="opt.data" @rowClassExtend="rowClassExtend(...arguments,opt)" :columnConfig="opt.tableConfig" >
 						<template slot="flightNo" slot-scope="{row,index}">
							<!--<div>航班号</div>-->
							 <span class="cursor fo" @click="toDetails(row)">{{row.flightNo}}</span>
						</template>
						<template slot="batchSet" slot-scope="{row,index}">
							<!--<div>批量预警</div>-->
							<el-checkbox class="labelNone" @change="idMapNo(row)" v-model="allCheckWarn[opt.key]" :label="row.flightId">
								<span  >1</span>
							</el-checkbox>
						</template>
						<template slot="warnDetail" slot-scope="{row,index}">
							<!--<div>取消预警</div>-->
							<span @click="resetWaring(row) "  class="quxiao" :class="{infoquxiao:!row.hightLightStatus}">
							<icon-svg  iconClass="huifu"  :class="{infoSvg:!row.hightLightStatus}"></icon-svg>
						</span>
						</template>
						<template slot="cancel" slot-scope="{row,index}">
							<!--<div>取消关注</div>-->
							<span @click="delWaring(row) "  class="  quxiao1">
							<icon-svg  iconClass="shanchu"  ></icon-svg>
						</span>
						</template>
						<template slot="displayRouter" slot-scope="{row,index}">
							<!--<div>航线 displayRouter</div>-->
							<div class="hangxian"  >
								<div v-for="(opt,index) in row.displayRouter" :key="index">
									<span v-if="index!==0"><icon-svg iconClass="jiantou"></icon-svg></span>
									<span>{{opt}} </span>
								</div>
							</div>

						</template>

					</AdvTable>

				</div>
			</div>
		</div>
		<Setting :setting="setting" ref="Setting" col="7" @getCol="getCol"></Setting>
		<Warning ref="Warning" ></Warning>
		<Bangzhu ref="Bangzhu" ></Bangzhu>
	</div>
</template>

<script>
	import Bangzhu from './bangzhu'
    import postal from 'postal';
    import {map,keyBy} from 'lodash';
    import {setting} from './help';
    import PostalStore from "../../lib/postalStore";
    let postalStore = new PostalStore();
    import Setting from "@components/setTableCol/setting"

    import Warning from "./warning"
	import AdvTable from "@/ui/components/advTable.vue"
    export default {
        name: "runMonitoringIndex",
        components: {Setting,Bangzhu,AdvTable,Warning},
        data() {
            return {
                runMonitorShow:{},
                idMapNoObj:{},
                setting,
                infoObj:{},
                statusOptions:[],
                timeOptions:[],
                allCheckWarn:{
                    batchConcern:[],
                    vvpFlights:[],
                },
                pageListObj: {
                    batchConcern: {bangzhu:true,name: '批量航班关注池',key:'batchConcern', data: [ ], show: true, tableConfig: [ ]},
                    advanceArrive:{name: '提前落地航班',key:'advanceArrive', data: [], show: true, tableConfig: []},
                    guaranteeWarn:{name: '地面保障告警池',key:'guaranteeWarn', data: [], show: true, tableConfig: []},
                    vvpFlights:{name: '要客航班池',key:'vvpFlights', data: [], show: true, tableConfig: []},
                     closeDoorWait:{name: '关舱等待池',key:'closeDoorWait', data: [], show: true, tableConfig: []},
                },

            }
        },
        computed:{
            isWarning(){
              return (opt)=>{
                  return opt.key=='batchConcern'||opt.key=='vvpFlights'
			  }
			},
            pageList(){
                return map(this.pageListObj,(k,l)=>{
                    return k
                })
            } ,
            getMoreWarnLength(){
                return (key)=>this.allCheckWarn[key].length
            },
        },
        created() {
            let obj={
                batchConcern:true,
                advanceArrive:true,
                guaranteeWarn:true,
                vvpFlights:true,
                closeDoorWait:true,
            }
            let data=localStorage.getItem('runMonitorShow')
            let obj1=data&&JSON.parse( data)
             this.runMonitorShow=obj1||obj
            localStorage.setItem('runMonitorShow',JSON.stringify(this.runMonitorShow))
            map(this.pageListObj,(k,l)=>{
                k.tableConfig=[];
                map(setting[l],(k1,l)=>{
                    let obj={...k1}
                    !k1.reference&&k.tableConfig.push(obj)

                })
            })
            postal.publish({
                channel: 'Worker',
                topic: 'Page.RunMonitor.Start',
            }) ;
            this.getTimeS()
        },
        mounted(){
            //批量关注池
            postalStore.sub( 'batchConcern',(data)=>{
                let length=Object.keys(data[0]||{}).length

                length&&this.$set(this.pageListObj.batchConcern,'data',data)
                // this.allCheckWarn.batchConcern=[]flight/batchConcern/del
             });
            //提前落地池
            postalStore.sub( 'advanceArrive',(data)=>{
                let length=Object.keys(data[0]||{}).length
                length&&this.$set(this.pageListObj.advanceArrive,'data',data)
                // length&&this.$set(this.pageListObj.batchConcern,'data',data)
                // length&&this.$set(this.pageListObj.guaranteeWarn,'data',data)
                // length&&this.$set(this.pageListObj.vvpFlights,'data',data)
                // length&&this.$set(this.pageListObj.closeDoorWait,'data',data)
             });
            //地面保障池
            postalStore.sub( 'guaranteeWarn',(data)=>{
                let length=Object.keys(data[0]||{}).length
                length&&this.$set(this.pageListObj.guaranteeWarn,'data',data)
             });
            //要客航班池
            postalStore.sub( 'vvpFlights',(data)=>{
                let length=Object.keys(data[0]||{}).length
                length&&this.$set(this.pageListObj.vvpFlights,'data',data)
             });
            //关舱等待池
            postalStore.sub( 'closeDoorWait',(data)=>{
                let length=Object.keys(data[0]||{}).length
                length&&this.$set(this.pageListObj.closeDoorWait,'data',data)
                 // console.log('closeDoorWait',data);
            });
        },
        beforeDestroy() {
            postal.publish({
                channel: 'Worker',
                topic: 'Page.RunMonitor.Stop',
            })
            postalStore.unsubAll()
        },
        methods: {
            showChange(){

              localStorage.setItem('runMonitorShow',JSON.stringify(this.runMonitorShow))
			},
            idMapNo(row){
                this.idMapNoObj[row.flightId]=row.flightNo
			},
            toDetails(row){
				this.$FlightDetais.open({flightId:row.flightId},true)
			},
            openBangzhu({name, key}){
				this.$refs.Bangzhu.open({name, key})
			},
            rowClassExtend(row,key,opt){
                if(this.isWarning(opt)&&row.hightLightStatus){
                      row[key]='warningRow'
                }
			},
            getTimeS(){
                this.$request.post('situation', 'batchConcernStatus/list', null,true).then((res)=>{
                    if(res.code!=200||!res.data){
                         return
                    }
                    this.statusOptions=map(res.data.statusType,(k,l)=>{
                        return {value:l,label:k}
                    });
                    this.timeOptions=map(res.data.timeType,(k,l)=>{
                        return {value:l,label:k}
                    })
                    map({...res.data.timeType,...res.data.statusType},(k,l)=>{
                        this.infoObj[l]=k
                    })
                })

            },
            resetWaring(row){
				if(!row.hightLightStatus){
				    return
				}
                this.$confirm(`当前预警：${this.infoObj[row.hightLightStatus]}；是否确认取消 航班${row.flightNo}的预警状态？`, '提示', {
                    type: 'warning',
                }).then(() => {
                    this.$request.post('flight', 'batchConcernStatus/cancel/'+row.flightId, {flightId: row.flightId},false).then((res)=>{
                        if(res.code!=200||!res.data){
                            this.$message.warning(res.message)
                            return
                        }
                        this.$message.success('操作成功')
                    })

				}).catch(() => {
                    this.$message.info('已取消操作')
				})
            },
            delWaring(row){
                 if(!this.$hasRole('edit-batch-cancel')){
                    return
                }
                this.$confirm(`是否确认取消关注航班${row.flightNo}？`, '提示', {
                    type: 'warning',
                }).then(() => {
                    this.$request.post('situation', 'flight/batchConcern/del/'+row.flightId, null,true).then((res)=>{
                        if(res.code!=200||!res.data){
                            this.$message.warning(res.message)
                            return
                        }
                        this.$message.success('取消关注成功')
                    })

				}).catch(() => {
                    this.$message.info('已取消操作')
				})
            },
            getCol(cols,key){
                this.pageListObj[key].tableConfig=[...cols]
            },
            resetPageList(){
                map(this.pageListObj,(k,l)=>{
                    k.show=true
                })
            },
            openSetting({name,key,tableConfig, }){
                this.$refs.Setting.open({name,key,tableConfig})
            },
            openWaring({name,key,tableConfig, }){
                // <!--edit-batch-confirm-->
                // <!--编辑-批量设置确认-->
                // <!--edit-vvp-confirm-->
                // <!--编辑-要客航班确认-->
                // <!--edit-batch-cancel-->
                // <!--编辑-批量关注航班取消-->
				let obj={
                    batchConcern:'edit-batch-confirm',
                    vvpFlights:'edit-vvp-confirm',
				}
                if(!this.getMoreWarnLength(key)||!this.$hasRole(obj[key])){
                    return
                }
                this.$refs.Warning.open({name,key,tableConfig},this.allCheckWarn[key],this.statusOptions,this.timeOptions,this.infoObj,this.idMapNoObj)
            },
        },

    }
</script>

<style lang="scss" scoped>
	.tablediv{
		background: #19263b;
	}
	::v-deep .adv-table-container {
		.adv-table_main-container {
			border: 0 !important;
		}

		.adv-table_header-container {
			border: 0 !important;
		}
		$border: 1px #565c67 solid;
		table {
			tr {
				border-top: $border;
				border-bottom: $border;
				th {
					/*<!--border-top: $border;-->*/
					border-bottom: $border !important;
					border-right: 0 !important;
					background: #233147 !important;
				}
				td {
					border-right: 0 !important;
					border-bottom: $border !important;
					background: #19263b !important;
					.hangxian {
						display: flex;
						justify-content: center;
						svg {
							margin: 0 2px;
							width: 10px;
							fill: #3b639a;
						}
					}
				}
			}
		}

		.warningRow{
			td{
 				background: #f2dede!important;
			}
		}
	}


	 .el-dropdown-menu{
		padding:15px!important;
	}
	::v-deep .el-dropdown-menu__item{
		padding: 0px;
		border-bottom: 1px #ddd solid!important;
	}
	.labelNone{
		::v-deep .el-checkbox__label{
			display: none;
		}
	}

	 .quxiao{
		 padding: 3px 11px ;
		 background: #2e67f6;
		 border-radius: 3px;
	 }
	 .quxiao1{
		 border-radius: 3px;
		 padding: 3px ;
		 background: #3f485b;
	 }
	 .infoquxiao{
		 background: rgba(46, 103, 246, 0.66);
	 }
	 .resetPage{
		 color:#28a745;
		 cursor: pointer;
		 text-align: center;
		 padding-top: 10px ;
	 }
	 .resetPage:hover{
		 opacity: .6;
	 }
	.runMonitoringIndex {
		position: relative;

		.positionDropdown{
			cursor: pointer;
			color:#fff;
			position: absolute;
			right:30px;
			top:2px;
			background: linear-gradient(90deg,#4b8efd 0,#3fb3ff 100%);
			box-shadow: 0 0 0.25rem #4b4b4b;
			padding: 3px 6px;
			font-size: 12px;
			.el-icon-setting{
				margin-right:5px;
			}

		}
		.listMonitor {
			height: calc(100vh - 40px);
			padding: 11px;
			padding-right: 0;
			color: #fff;
			display: flex;
			justify-content: left;
			flex-wrap: wrap;
			.itemMonitor {
				height: calc(50% - 2px);
 				width: 33.333333%!important;
				padding: 0px 11px 11px 0 ;
				.tablediv{
					margin-top: -1px;
					position: relative;
					width: 100%;
					height: calc(100% - 37px);
				}
				.adv-table-container {
					width: 100%;
				}
				.itemTitle {
					width: 100%;
					height: 37px;
					line-height: 37px;
					border-radius: 6px 6px 0 0;
					background: #234479;
					display: flex;
					padding: 0 15px;
					justify-content: space-between;
					.icon-zidingyi{
						font-size: 13px;
						margin: 0 2px;
					}
					.infoIcon{

						.icon-warning{
							color: #6c757d !important;
							cursor: not-allowed;
						}
					}
					.icon-warning{
						font-size: 15px!important;
					}


				}
			}
			.itemMonitor1{
				padding-bottom:0;
			}
		}
	}
</style>
