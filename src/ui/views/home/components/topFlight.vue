<template>
    <div class="top_flight">
        <div class="box_content">
            <div class="lineText">
                <div class="line"></div>
                <div class="text">全场</div>
                <div class="line"></div>
            </div>
            <ul class="ulAD1">
                <li class="moveA">
                    <div><span class="fo">{{get(flight_traffic, [ 'A', 'numeric'])}}</span>架次</div>
                    <div>1小时内落地架次</div>
                </li>
                <li class="moveD">
                    <div><span class="fo">{{get(flight_traffic, [ 'D', 'numeric'])}}</span>架次</div>
                    <div>1小时内起飞架次</div>
                </li>
                <li class="moveA">
                    <div><span class="fo">{{get(flight_traffic, [ 'A', 'rate'])}}</span>分/架次</div>
                    <div>1小时内落地速率</div>
                </li>
                <li class="moveD">
                    <div><span class="fo">{{get(flight_traffic, [ 'D', 'rate'])}}</span>分/架次</div>
                    <div>1小时内起飞速率</div>
                </li>
                <li class="moveA">
                    <div><span class="fo">{{flight_estimateCtotRelease.estimateInFlight}}</span>架次</div>
                    <div>预计下小时段落地</div>
                </li>
                <li class="moveD">
                    <div><span class="fo">{{flight_estimateCtotRelease.estimateReleaseFlight}}</span>架次</div>
                    <div>预计下小时段起飞</div>
                </li>
                <li class="moveA nobottom">
                    <div><span class="fo">{{get(flight_traffic, [ 'A', 'spacing'])}}</span>分</div>
                    <div>落地间隔</div>
                </li>
                <li class="moveD nobottom">
                    <div><span class="fo">{{get(flight_traffic, [ 'D', 'spacing'])}}</span>分</div>
                    <div>起飞间隔</div>
                </li>
            </ul>
            <div v-for="(value,key) in flight_runwayTraffic" :key="key" class="trafficBox">
                <div class="lineText">
                    <div class="line"></div>
                    <div class="text text1">
                        {{key}}
                    </div>
                    <div class="line"></div>
                </div>
                <ul class="ulAD2">
                    <div>
                        <div>
                            <span class="fo">{{value.departure?value.departure:'--'}}</span>
                            分/架
                        </div>
                        <div>起飞速率</div>
                    </div>
                    <div>
                        <div>
                            <span class="fo">{{value.arrive?value.arrive:'--'}}</span>
                            分/架
                        </div>
                        <div>落地速率</div>
                    </div>
                    <div>
                        <div>
                            <span class="fo">{{value.arriveAndDeparture?value.arriveAndDeparture:'--'}}</span>
                            分/架
                        </div>
                        <div>综合速率</div>
                    </div>
                </ul>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    props: ['flight_traffic', 'flight_estimateCtotRelease', 'flight_runwayTraffic'],
    data() {
        return {
            select: 0,
            get: _.get,
        }
    },
    created() {},
    mounted() {},
    methods: {},
}
</script>

<style scoped lang='scss'>
.top_flight {
    padding: 8px;
    height: calc(100% - 275px);
    .box_content {
        padding: 5px 15px 0;
        .lineText {
            display: flex;
            align-items: center;
            .line {
                height: 2px;
                background: #b3bddc;
                opacity: 0.3;
                flex: 1;
            }
            .text {
                color: #fff;
                margin: 0 10px;
                height: 28px;
                width: 36px;
                font-size: 16px;
                background-size: 100% 100%;
                background-repeat: no-repeat;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .text1 {
                height: 32px;
                width: 32px;
            }

            .rus {
            }
        }
        .ulAD1 {
            display: flex;
            flex-wrap: wrap;
            li {
                width: 50%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                height: 65px;
                div {
                    color: #fff;
                    font-size: 12px;
                    span {
                        font-size: 20px;
                        margin-right: 5px;
                    }
                }
                div:nth-child(2) {
                    margin-top: 5px;
                    color: rgba(255, 255, 255, 0.5);
                }
            }
            .moveA {
                border-right: 2px dashed rgba(179, 189, 220, 0.2);
                border-bottom: 2px dashed rgba(179, 189, 220, 0.2);
                div:nth-child(1) {
                    color: #44ff78;
                }
            }
            .moveD {
                border-bottom: 2px dashed rgba(179, 189, 220, 0.2);
                padding-left: 10px;
                div:nth-child(1) {
                    color: #44adff;
                }
            }
            .nobottom {
                border-bottom: none;
            }
        }
        .trafficBox {
            margin-top: 10px;
        }
        .trafficBox:nth-child(3) {
            .text {
                background-image: url(../static/imgs/mbg1.png);
            }
        }
        .trafficBox:nth-child(4) {
            .text {
                background-image: url(../static/imgs/mbg2.png);
            }
        }
        .trafficBox:nth-child(5) {
            .text {
                background-image: url(../static/imgs/mbg3.png);
            }
        }
        .ulAD2 {
            display: flex;
            justify-content: space-between;
            & > div {
                display: flex;
                flex-direction: column;
                div {
                    font-size: 12px;
                    color: #fff;
                    span {
                        font-size: 20px;
                        margin-right: 2px;
                    }
                }
                div:nth-child(2) {
                    margin-top: 5px;
                    color: rgba(255, 255, 255, 0.5);
                }
            }
        }
    }
}
</style>
