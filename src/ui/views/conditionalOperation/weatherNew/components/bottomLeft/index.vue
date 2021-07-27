<template>
	<div class="bottomLeftIndex">
		<div  class="weatherWarnRunway">
			<!--天气-->
			<div class="weather">
				<div class="title">
					<div class="shuxian"></div>
					<div class="text">天气标准</div>
 				</div>

				<div class="weatherItem" v-for="opt in weatherPageData" :key="opt.icon">
 					<img :src="opt.icon" alt="">
					<div class="content">
						<div>{{opt.name}}</div>
						<div>{{opt.content}}</div>
					</div>
				</div>

			</div>
			<!--预警和跑到-->
			<div class="warnRunway item">
				<MDRSWarning></MDRSWarning>
				<Runway></Runway>
			</div>
		</div>
		<div class="txnl item">
			<!--&lt;!&ndash;通行能力 动态时段&ndash;&gt; showDTSD==true 不显示动态时段-->
			<TrafficCapacity  :showDTSD="true"></TrafficCapacity>
		</div>
		<Bangzhu ref="Bangzhu"></Bangzhu>
	</div>
</template>

<script>
	import dafeng from '@assets/img/dafeng.png'
	import leidian from '@assets/img/leidian.png'
	import dayu from '@assets/img/dayu.png'
	import baoyu from '@assets/img/baoyu.png'
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
                dafeng:'../../../../../assets/img/dafeng.png',
                weatherPageData:[
                    {name:'雷电',icon:leidian,content:'雷暴天气条件下发生的伴有闪电和雷鸣的一种放电现象'},
                    {name:'大风',icon:dafeng,content:'瞬时风速>=17.2m/s，即风力达到8级以上'},
                    {name:'暴雨',icon:baoyu,content:'降雨量>=16mm/1h，或30mm/12h，或50mm/24h'},
                    {name:'大雾',icon:dayu,content:'造成水平能见度<500m的雾'},
				],
                status:2,
                tableConfig: runwayStandardConfig,
                tableData:[],
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
.weatherWarnRunway{
	height: calc(43% - 20px);
	display: flex;
	margin-bottom: 15px;
	.weather,
	.warnRunway{
		height: 100%;
		width: calc(50% - 7px);
	}
	.weather{
		margin-right: 14px;
		background: rgba(25, 37, 60, 0.8);
		padding: 15px;
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


		}
		.weatherItem{
			padding: 10px 0px;
			display: flex;
			border-bottom: 1px #111926 solid;
			display: flex;
			align-items: center;
			img{
				margin-right: 10px;
				width: 36px;
			}
			.content{
				font-family: AlibabaPuHuiTiR!important;
				font-weight: 300!important;
				div{
					font-size: 14px;
					line-height: 22px;
				}
				div:nth-child(2){
					font-size: 12px;
					color:  rgba(255, 255, 255, 0.51);
				}
			}
		}
	}

	.warnRunway {
 		&>div {

			height:calc(50% - 7px);
			width: 100%;
			background: rgba(25, 37, 60, 0.8);
		}
		&>div:nth-child(2){
			margin-top: 14px;
			padding-bottom: 15px;
		}
	}
}




	.txnl {
		height: calc(57% - 10px);
		background: rgba(25, 37, 60, 0.8);
		border-radius: 5px;
		box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.50);
	}

</style>