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
                    <div><span>20</span>架次</div>
                    <div>1小时内落地架次</div>
                </li>
                <li class="moveD">
                    <div><span>20</span>架次</div>
                    <div>1小时内起飞架次</div>
                </li>
                <li class="moveA">
                    <div><span>20</span>分/架次</div>
                    <div>1小时内落地速率</div>
                </li>
                <li class="moveD">
                    <div><span>20</span>分/架次</div>
                    <div>1小时内起飞速率</div>
                </li>
                <li class="moveA">
                    <div><span>20</span>架次</div>
                    <div>预计下小时段落地</div>
                </li>
                <li class="moveD">
                    <div><span>20</span>架次</div>
                    <div>预计下小时段起飞</div>
                </li>
                <li class="moveA nobottom">
                    <div><span>20</span>分</div>
                    <div>落地间隔</div>
                </li>
                <li class="moveD nobottom">
                    <div><span>20</span>分</div>
                    <div>起飞间隔</div>
                </li>
            </ul>
            <div class="lineText">
                <div class="line"></div>
                <div class="text text1">
                    10
                </div>
                <div class="line"></div>
            </div>
            <ul class="ulAD2">
                <div>
                    <div>
                        <span>12</span>
                        分/架
                    </div>
                    <div>起飞速率</div>
                </div>
                <div>
                    <div>
                        <span>12</span>
                        分/架
                    </div>
                    <div>落地速率</div>
                </div>
                <div>
                    <div>
                        <span>12</span>
                        分/架
                    </div>
                    <div>综合速率</div>
                </div>
            </ul>
            <div class="lineText">
                <div class="line"></div>
                <div class="text text2">
                    10
                </div>
                <div class="line"></div>
            </div>
            <ul class="ulAD2">
                <div>
                    <div>
                        <span>12</span>
                        分/架
                    </div>
                    <div>起飞速率</div>
                </div>
                <div>
                    <div>
                        <span>12</span>
                        分/架
                    </div>
                    <div>落地速率</div>
                </div>
                <div>
                    <div>
                        <span>12</span>
                        分/架
                    </div>
                    <div>综合速率</div>
                </div>
            </ul>

        </div>
    </div>
</template>

<script>
export default {
    props: ['data'],
    data() {
        return {
            select: 0,
        }
    },
    created() {},
    mounted() {},
    methods: {},
}
</script>

<style scoped lang='scss'>
.top_flight {
    padding: 4px;
    height: 65%;
    .box_content {
        height: 100%;
        width: 100%;
        background: linear-gradient(
            134deg,
            rgba(26, 39, 64, 0.5) 0,
            rgba(29, 47, 67, 0.5) 30%,
            rgba(29, 47, 67, 0.5) 100%
        ) !important;
        padding: 5px 15px 0;
        .lineText {
            display: flex;
            align-items: center;
            height: 30px;
            .line {
                height: 2px;
                background: #b3bddc;
                opacity: 0.3;
                flex: 1;
            }
            .text {
                color: #fff;
                margin: 0 10px;
                height: 30px;
                width: 30px;
                line-height: 30px;
                text-align: center;
                background-size: 100% 100%;
                background-repeat: no-repeat;
            }
            .text1 {
                background: url(../static/mbg1.png);
            }
            .text2 {
                background: url(../static/mbg2.png);
            }
            .text3 {
                background: url(../static/mbg3.png);
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
                padding: 20px 0 20px 10px;
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
                div:nth-child(1) {
                    color: #44adff;
                }
            }
            .nobottom {
                border-bottom: none;
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
                        margin-right: 5px;
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
