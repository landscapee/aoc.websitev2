<template>
	<div class="bottomLeftIndex">
		<!--预警和跑到-->
		<div class="warnRunway item">
			<div class="warn">
				<div class="title">
					<div class="shuxian"></div>
					<div class="text">MDRS预警</div>
					<div class="status" :style="{color:statusObj[2],borderColor:statusObj[2]}">失效</div>
				</div>
				<div class="content">
					{{messageData.content}}
				</div>
			</div>
			<div class="runway">
				<span class="runwayTitle">跑道运行模式</span>
				<div class="runwayItem">
					<div class="runwayLeft">{{runwayData.direction}}</div>
					<div class="runwayRight" v-for="(opt,index) in runwayData.runway" :key="index+'right'">
						<div class="runwayRightTop">{{opt.top}}</div>
						<div class="runwayRightBottom">{{opt.bottom}}</div>
					</div>
				</div>
			</div>
		</div>
		<!--预警下面的表格-->
		<div class="tableBox item">
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
			<TrafficCapacity :optionsEC="trafficCapacity" :tableData="delayBoard||[]"></TrafficCapacity>
		</div>
		<Bangzhu ref="Bangzhu"></Bangzhu>
	</div>
</template>

<script>
    import {memoryStore} from "@/worker/lib/memoryStore";

    import postal from 'postal';
    import PostalStore from "@ui_lib/postalStore";

    let postalStore = new PostalStore();
    import moment from 'moment'
    import {filter, map, get} from 'lodash'
    import TrafficCapacity from './trafficCapacity'
    import {runwayStandardConfig} from './help'
import Bangzhu from './bangzhu'
    export default {
        name: "bottomLeftIndex",
        components: {TrafficCapacity,Bangzhu},
        data() {
            return {
                tableConfig: runwayStandardConfig,
                tableData:[],
                statusObj: {
                    0: '#24ca87', //sx
                    1: '#3280e7', //dsx
                    2: '#888888', //sx
                },
                trafficCapacity: {},//通行能力
                delayBoard: [],//动态时段
                messageData: {},//MDRS预警
                runwayData: {},//paodao
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

            // 动态时段 通行能力
            postalStore.sub('trafficCapacity', ({data, key}) => {
                this[key] = data;
            });
            postalStore.sub('runwayStandard', ({data, key}) => {
                this.tableData = data;
                console.log(data,11);
            });
            postalStore.sub('push.runway.Data', (runwayData) => {
                console.log(111, runwayData);
                let directionOpt = {
                    north: '北',
                    south: '南',
                };
                let direction = directionOpt[get(runwayData, '0.direction')];
                let oOptions = {0: '落地', 1: '起飞', 2: '起飞+落地', 3: '暂停使用'};
                let runway = map(runwayData, (item) => {
                    return {
                        bottom: oOptions[item.usage],
                        top: item.runway,
                    }
                })
                this.runwayData = {
                    direction, runway
                }
             });
            postalStore.sub('push.message.Data', (messageClientData) => {
                let mdrs = filter(messageClientData, (item) => item.category === 'MDRS预警');
                let mdrsObj = mdrs[0] || {};
                let now = memoryStore.getItem('global').now;
                // 1:生效 2:待生效 3:失效
                // 当前时间早于开始时间 待生效
                if (moment(now).isBefore(mdrsObj.closeStartTime)) {
                    mdrsObj.status = 2;
                }
                // 当前时间晚于开始时间 并且 早于结束时间 生效
                if (moment(now).isAfter(mdrsObj.closeStartTime) && moment(now).isBefore(mdrsObj.closeEndTime)) {
                    mdrsObj.status = 1;
                }
                // 当前时间晚于结束时间 失效
                if (moment(now).isAfter(mdrsObj.closeEndTime)) {
                    mdrsObj.status = 3;
                }
                this.messageData = mdrsObj;
            });
            postal.publish({
                channel: 'Worker',
                topic: 'Get.message.Data',
            });
            postal.publish({
                channel: 'Worker',
                topic: 'Get.runway.Data',
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
		.runway, .warn {
			width: 50%;
			background: rgba(25, 37, 60, 0.8);

		}
		.warn {
			margin-right: 10px;
			padding: 10px 10px;
			.title {
				font-size: 14px;
				display: flex;
				align-items: center;
				.shuxian {
					width: 4px;
					height: 14px;
					background: #0566ff;
					border-radius: 1px;
				}
				.text {
					margin: 0 12px 0 8px;
				}
				.status {

					padding: 2px 9px;
					border: 1px solid;
					border-radius: 10px 10px 10px 0px;
				}

			}
			.content {
				margin: 30px 45px 0 12px;
				line-height: 22px;
			}
		}
		.runway {
			padding: 15px 10px;
			.runwayTitle {
				background: url("../../../../../assets/img/pdyxms.png");
				background-size: 100% 100%;
				display: inline-block;
				width: 115px;
				padding: 3px;
			}
			.runwayItem {
				display: flex;
				margin-top: 20px;
				& > div {
					margin-left: 10px;
				}
			}

			.runwayLeft {
				margin: 0;
				line-height: 70px;
				text-align: center;
				width: 45px;
				height: 70px;
				color: #00d3ff;
				font-size: 16px;
				box-shadow: 0px 0px 8px 0px #649fff inset;
			}
			.runwayRight {
				width: 118px;
				height: 70px;
				border: 1px solid #649fff;
				.runwayRightTop {
					color: #649fff;
					width: 118px;
					height: 25px;
					line-height: 25px;
					text-align: center;
					box-shadow: 0px 0px 8px 0px #649fff inset;
				}
				.runwayRightBottom {
					line-height: 45px;
					font-size: 18px;
					text-align: center;
					color: #00d3ff;
				}
			}
		}
	}

	.tableBox {
		margin: 15px 0;
		height: calc(21.5% - 10px);
		background: rgba(25, 37, 60, 0.8);
		border-radius: 5px;
	}

	.txnl {
		height: calc(57% - 10px);

		background: rgba(25, 37, 60, 0.8);
		border-radius: 5px;
		box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.50);
	}
	::v-deep th{
		background: #113671;
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
</style>