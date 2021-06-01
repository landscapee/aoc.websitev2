




 <template>
	<div class="runMonitoringIndex">

		<div class="listMonitor">
			<el-dropdown class="positionDropdown" trigger="click" :hide-on-click="false">
      			<span class="el-dropdown-link">
        			<i class="el-icon-setting el-icon--right"></i>自定义
				</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item   v-for="(opt) in pageList" :key="opt.key">
						<el-checkbox v-model="opt.show" :label="opt.name"></el-checkbox>
					</el-dropdown-item>
					<div @click="resetPageList" class="resetPage">重置</div>
				</el-dropdown-menu>
			</el-dropdown>
			<div class="itemMonitor" v-if="opt.show" v-for="(opt,index) in pageList" :key="index">
				<div class="itemTitle">
					<div>{{opt.name}}（{{(opt.data||[]).length}}）</div>
					<div >
						<span v-if="index==0||index==3" @click="openWaring(opt) " :class="{infoSvg:!getMoreWarnLength(opt.key)}">
							<icon-svg  iconClass="warning" ></icon-svg>
						</span>
 						<i @click="openSetting(opt)" class="el-icon-setting"></i>
					</div>

				</div>
				<div class="tablediv">
					<AdvTable :tab-data="opt.data" :columnConfig="opt.tableConfig" >
 						<template slot="batchSet" slot-scope="{row,index}">
							<!--<div>批量预警</div>-->
							<el-checkbox class="labelNone" v-model="allCheckWarn[opt.key]" :label="row.flightId">
								<span  >1</span>
							</el-checkbox>
						</template>
						<template slot="warnDetail" slot-scope="{row,index}">
							<!--<div>取消预警</div>-->
							<span @click="resetWaring(row) " >
							<icon-svg  iconClass="huifu"  :class="{infoSvg:!row.hightLightStatus}"></icon-svg>
						</span>
						</template>

					</AdvTable>

				</div>
			</div>
		</div>
		<Setting ref="Setting" @getCol="getCol"></Setting>
		<Warning ref="Warning" ></Warning>
	</div>
</template>

<script>
    import postal from 'postal';
    import {map,keyBy} from 'lodash';
    import {setting} from './help';
    import PostalStore from "../../lib/postalStore";
    let postalStore = new PostalStore();
	import Setting from "./setting"
	import Warning from "./warning"
	import AdvTable from "@/ui/components/advTable.vue"
    export default {
        name: "runMonitoringIndex",
        components: {Setting,AdvTable,Warning},
        data() {
            return {
                allCheckWarn:{
                    batchConcern:[],
                    vvpFlights:[],
                },
                pageListObj: {
                    batchConcern: {name: '批量航班关注池',key:'batchConcern', data: [ ], show: true, tableConfig: [ ]},
                    advanceArrive:{name: '提前落地航班',key:'advanceArrive', data: [], show: true, tableConfig: []},
                    guaranteeWarn:{name: '地面保障告警池',key:'guaranteeWarn', data: [], show: true, tableConfig: []},
                    vvpFlights:{name: '要客航班池',key:'vvpFlights', data: [], show: true, tableConfig: []},
                },

            }
        },
        computed:{
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
            let flight=JSON.parse( localStorage.getItem('runmonitor'))

            postal.publish({
                channel: 'Worker',
                topic: 'getadvanceArrive',
                data:flight
            }) ;

        },
        mounted(){
            //批量关注池
            postalStore.sub( 'batchConcern',([data,flight])=>{
                let length=Object.keys(data[0]||{}).length
                localStorage.setItem('runmonitor',JSON.stringify(flight))

                length&&this.$set(this.pageListObj.batchConcern,'data',data)
                this.allCheckWarn.batchConcern=[]
                console.log('batchConcern',data);
            });
            //提前落地池
            postalStore.sub( 'advanceArrive',(data)=>{
                let length=Object.keys(data[0]||{}).length
                length&&this.$set(this.pageListObj.advanceArrive,'data',data)
                length&&this.$set(this.pageListObj.batchConcern,'data',data)
                length&&this.$set(this.pageListObj.guaranteeWarn,'data',data)
                length&&this.$set(this.pageListObj.vvpFlights,'data',data)

                console.log('advanceArrive',data);
            });
            //地面保障池
            postalStore.sub( 'guaranteeWarn',(data)=>{
                let length=Object.keys(data[0]||{}).length
                length&&this.$set(this.pageListObj.guaranteeWarn,'data',data)
                console.log('guaranteeWarn',data);
            });
            //要客航班池
            postalStore.sub( 'vvpFlights',(data)=>{
                let length=Object.keys(data[0]||{}).length
                length&&this.$set(this.pageListObj.vvpFlights,'data',data)
                this.allCheckWarn.batchConcern=[]
                console.log('vvpFlights',data);
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
            cancelAttention(row){

            },
            resetWaring(row){

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
                if(!this.getMoreWarnLength(key)){
                    return
                }
                this.$refs.Warning.open({name,key,tableConfig},this.allCheckWarn[key])
            },
        },

    }
</script>

<style lang="scss" scoped>
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
	 .infoSvg{
		 fill:#6c757d;
		 svg{
			 fill:#6c757d;
		 }
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
			right:20px;
			top:2px;
			background: linear-gradient(90deg,#4b8efd 0,#3fb3ff 100%);
			box-shadow: 0 0 0.25rem #4b4b4b;
			padding: 5px 6px;
			.el-icon-setting{
				margin-right:5px;
			}

		}
		.listMonitor {
			padding: 15px;
			color: #fff;
			display: flex;
			justify-content: left;
			flex-wrap: wrap;
			.itemMonitor {
				height: calc(50vh - 39px);
 				width: 33.333333%!important;
				padding: 5px;
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

				}
			}
		}
	}
</style>
