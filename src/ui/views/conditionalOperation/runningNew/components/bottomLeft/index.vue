<template>
	<div class="bottomLeftIndex">
		<!--预警和跑到-->
		<div class="warnRunway item">
			<MDRSWarning></MDRSWarning>
			<Runway></Runway>
		</div>
		<!--预警下面的表格-->
		<div class="tableBoxWB  item">
			<ele-table :columnConfig=" tableConfig"  :table-data="tableData">

				<el-table-column class="optionq" slot="departureStandard" align="center" width="140px" >
					<template  slot="header" slot-scope="scope" >
						<div  >
							<span  >预测起飞结果</span>
							<icon-svg class="cursor" @click.native="open('departureStandard')" iconClass="bangzhu"></icon-svg>
						</div>
					</template>
					<template   slot-scope="{row}" >
						<span  > {{row.departureStandard}}</span>
					</template>
				</el-table-column>
				<el-table-column class="optionq" slot="arriveStandard" align="center"  width="140px">
					<template  slot="header"  >
						<div  >
							<span  >预测落地结果</span>
							<icon-svg class="cursor" @click.native="open('arriveStandard')" iconClass="bangzhu"></icon-svg>
						</div>
					</template>
					<template   slot-scope="{row}" >
						<span  > {{row.arriveStandard}}</span>
					</template>
				</el-table-column>
			</ele-table>
		</div>

		<div class="txnl item">
			<!--通行能力 动态时段-->
			<TrafficCapacity  ></TrafficCapacity>
		</div>
		<Bangzhu ref="Bangzhu"></Bangzhu>
	</div>
</template>

<script>
    import {memoryStore} from "@/worker/lib/memoryStore";

    import postal from 'postal';
    import PostalStore from "@ui_lib/postalStore";

    let postalStore = new PostalStore();
     import {filter, map, get} from 'lodash'
     import Runway from '../../../components/runway'
    import MDRSWarning from '../../../components/MDRSWarning'
    import TrafficCapacity from '../../../components/trafficCapacity/trafficCapacity'
    import {runwayStandardConfig} from './help'
import Bangzhu from './bangzhu'
    export default {
        name: "bottomLeftIndex",
        components: {TrafficCapacity,Bangzhu,Runway,MDRSWarning},
        data() {
            return {
                status:2,
                tableConfig: runwayStandardConfig,
                tableData:[ ],
            }
        },
        methods: {
            open(key){
                this.$refs.Bangzhu.open(key)
            }
		},
        created() {
            // Get.message.Data

        },
        mounted() {

            postalStore.sub('runwayStandard', ({data, key}) => {
                this.tableData = data;
             });
        },
        beforeDestroy() {
            postalStore.unsubAll()
        },
    }
</script>

<style lang="scss" scoped>
	.bottomLeftIndex {
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		color: #fff;
		display: flex;
		flex-direction: column;
		.item {
			flex: 1 1 auto;
		}
	}

	.warnRunway {
		width: 100%;
		height: calc(21.5% - 10px);
		display: flex;
 		&>div {
			width: 50%;
			background: rgba(25, 37, 60, 0.8);
		}
		&>div:nth-child(2){
			padding-bottom: 25px;
		}
	}

	.tableBoxWB {
		margin: 15px 0;
		height: calc(21.5% - 14px);
		background: rgba(25, 37, 60, 0.8);
		border-radius: 5px;
		::v-deep th{
			background: #113671!important;
		}
		::v-deep tr{
			/*background: red;*/
			/*height: 30px!important;*/
			td,th{
				height: 37px!important;
			}
		}
		::v-deep .cell {

			font-size: 14px !important;
			font-weight: 400;
			padding: 0 2px !important;
			*{
				font-size: 14px !important;
			}
			.textSecondary{
				font-size: 12px !important;
				color: #666!important;
			}
		}
	}

	.txnl {
		height: calc(57% - 9px);

		background: rgba(25, 37, 60, 0.8);
		border-radius: 5px;
		box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.50);
	}

</style>