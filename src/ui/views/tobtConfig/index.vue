<template>
	<div class="tobtConfig">
		<div class="box">
			<div class="itemTitle ">
				<div class="div1">
					<span></span>
					<span  > TOBT配置</span>

				</div>
				<div class="div2 cursor" @click="add(null)"><span  >新增</span></div>
			</div>
			<div class="divF">
				<div class="tableDiv">
					<AdvTable :tab-data="data"   :columnConfig="tableConfig" >

						<template slot="associatedAirport" slot-scope="{row,index}">
							<!--<div>取消预警</div>-->
							<span>{{dataAirport[row.associatedAirport]}}</span>
						</template>
						<template slot="operation" slot-scope="{row,index}">
							<!--<div>取消预警</div>-->
							<span @click="add(row) "  class="operation1 cursor">
							<icon-svg  iconClass="bianji"   ></icon-svg>
					</span>
							<span @click="del(row) "  class="cursor">
							<icon-svg  iconClass="shanchu11"   ></icon-svg>
					</span>
						</template>


					</AdvTable>

				</div>
			</div>

			<Add ref="Add" :dataAirport="dataAirport"></Add>

		</div>
	</div>
</template>

<script>
	import Add from './add'
    import AdvTable from "@/ui/components/advTable.vue"
    import {tableConfig} from './help';
    import postal from 'postal';
    import {map} from 'lodash';
     import PostalStore from "../../lib/postalStore";
    let postalStore = new PostalStore();
    export default {
        name: "tobtConfig",
        components: {AdvTable,Add},
        data() {
            return {
                dataAirport:[],
                 tableConfig,
                data:[],
			}
        },
        methods: {
            add(row){
				this.$refs.Add.open(row)
			},
			del(row){
                // if(!this.$hasRole('edit-batch-cancel')){
                //     return
                // }
                this.$confirm(`确认删除该信息？`, '提示', {
                    type: 'warning',
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then(() => {
                     this.$request.post('adverse', 'flight/removeTobtConstant?constantId='+row.id,null,false,'delete').then((res)=>{
                        if(res.code!=200){
                            this.$message.warning(res.message)
                            return
                        }
                        this.$message.success('删除成功')
                    })

                }).catch(() => {
                    this.$message.info('已取消操作')
                })
			}
		},
        created() {
            postal.publish({
                channel: 'Worker',
                topic: 'Page.tobtConfig.Start',
            }) ;

            this.$request.get('delays', 'Flight/FlightSchedule/rankAirport',null,false).then((res)=>{
                if(res.code==200){
                    // console.log(200,res.data,200);
                    this.dataAirport=JSON.parse(res.data)

                }
             })
        },
        mounted(){

            postalStore.sub( 'tobtConfig',(data)=>{
                // console.log('tobtConfig',data);
                this.data=data

            });

        },
        beforeDestroy() {
            postal.publish({
                channel: 'Worker',
                topic: 'Page.tobtConfig.Stop',
            })
            postalStore.unsubAll()
        },
    }
</script>

<style lang="scss" scoped>
	.tobtConfig {
		box-sizing: border-box;
		padding: 11px 15px;
		width: 100%;
 		.box {
			background: #162134;
			width: 100%;
			height: 100%;

			.itemTitle {
				padding: 10px 20px 10px 0;
				display: flex;
				justify-content: space-between;
				span {
					display: inline-block;
					vertical-align: middle;
					color: #fff;
					font-family: ALiB;
					font-size: 14px;
				}
				.div1 {
					height: 25px;
					line-height: 25px;
					& > span:first-child {
						width: 4px;
						height: 16px;
						opacity: 1;
						background: #649fff;
						border-radius: 1px;
						margin: 0 8px 0 10px;
					}
					& > span:last-child {
						font-size: 18px;
					}
				}
				.div2{
					padding: 6px 15px;
					opacity: 1;
					background: #0566ff;
					border-radius: 2px;
				}

			}
		}
		.divF{
			padding: 20px;
			padding-top: 0;
			width: 100%;

			height: calc(100% - 40px);
		}
		.tableDiv{
			width: 100%;
			position: relative;

			height: 100%;
			.operation1{
				margin-right: 15px;
			}
		}
	}
</style>