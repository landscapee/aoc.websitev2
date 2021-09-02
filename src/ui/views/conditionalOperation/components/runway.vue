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
        methods: {},
        created() {


        },
        mounted() {


            postalStore.sub('push.runway.Data', (runwayData) => {
                // console.log(111, runwayData);
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
        padding: 15px 15px 15px 10px;
        color: #fff;
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
            height: calc(100% - 34px);
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
        .runwayRightBottom {
            justify-content: center;
            display: flex;
            flex: 1 1 auto;
            align-items: center;
        }
        .runwayLeft {
            margin: 0;
            text-align: center;
            width: 54px;
            height: 70px;
            color: #00d3ff;
            font-size: 16px;
            box-shadow: 0px 0px 8px 0px #649fff inset;
        }
        .runwayRight {
            width: calc(33.3333% - 18px);
            border: 1px solid rgba(100,159,255,.5);
            position: relative;
            .runwayRightTop {
                flex: 0 1 auto;
                color: #649fff;
                width: calc(100% + 2px);
                height: 29px;
                text-align: center;
                /*box-shadow: 0px 0px 8px 0px #649fff inset;*/
                background-image: url(data:image/png;base64,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) ;
                background-size: 100% 100%;
                margin : -2px 0 0 -1px;
            }
            .runwayRightBottom {
                font-size: 18px;
                color: #00d3ff;
            }
        }
    }


</style>