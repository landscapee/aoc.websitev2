<template>
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
</template>

<script>

    import postal from 'postal';
    import PostalStore from "@ui_lib/postalStore";

    let postalStore = new PostalStore();
    import {map, get} from 'lodash'
     export default {
        name: "bottomLeftIndex",
        components: {},
        data() {
            return {

                runwayData: {},//paodao
            }
        },
        methods: {

        },
        created() {


        },
        mounted() {


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

	.runway {
		height: 100%;
		width: 100%;
		background: rgba(25, 37, 60, 0.8);
		padding: 15px 15px 15px 10px ;
		.runwayTitle {
			background: url("../../../assets/img/pdyxms.png");
			background-size: 100% 100%;
			display: inline-block;
			width: 115px;
			padding: 3px;
		}
		.runwayItem {
			display: flex;
			margin-top: 12px;
			height:calc(100% - 34px);
			& > div {
				margin-left: 10px;
				flex: 1 1 auto;
				height: 100%;
				display: flex;
				flex-direction: column;

			}
		}
		.runwayLeft,
		.runwayRightTop,
		.runwayRightBottom{
			justify-content: center;
 			display: flex;
			flex: 1 1 auto;
 			align-items: center;
 		}
		.runwayLeft {
			margin: 0;
			text-align: center;
			width: 45px;
			height: 70px;
			color: #00d3ff;
			font-size: 16px;
			box-shadow: 0px 0px 8px 0px #649fff inset;
		}
		.runwayRight {
			width: 118px;
			border: 1px solid #649fff;
			.runwayRightTop {
				flex: 0 1 auto;
				color: #649fff;
				width: 118px;
				height: 25px;
				text-align: center;
				box-shadow: 0px 0px 8px 0px #649fff inset;
			}
			.runwayRightBottom {
				font-size: 18px;
				color: #00d3ff;
			}
		}
	}





</style>