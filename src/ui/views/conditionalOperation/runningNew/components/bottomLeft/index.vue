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
                    烟台预计17:15-18:15受雷雨天气影响，通行能力下降32%，发布烟台航班延误橙色预警。
                </div>
            </div>
            <div class="runway">
                <span class="title">跑道运行模式</span>
                <div class="runwayItem">
                    <div class="left">北</div>
                    <div class="right" v-for="opt in 3" :key="opt+'right'">
                        <div class="rightTop">01</div>
                        <div class="rightBottom">落地+起飞</div>
                    </div>
                </div>
            </div>
        </div>
        <!--预警下面的表格-->
        <div class="tableBox item"></div>
        <!--通行能力-->
        <div class="txnl item"></div>
    </div>
</template>

<script>
import PostalStore from '@ui_lib/postalStore'

let postalStore = new PostalStore()
export default {
    name: 'bottomLeftIndex',
    components: {},
    data() {
        return {
            statusObj: {
                0: '#24ca87', //sx
                1: '#3280e7', //dsx
                2: '#888888', //sx
            },
        }
    },
    methods: {},
    created() {},
    mounted() {
        postalStore.sub('emergencyEventNode', (data) => {
            this.emergencyEventNode = data
        })
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
    .runway,
    .warn {
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
        .title {
            background: url('../../../../../assets/img/pdyxms.png');
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

        .left {
            margin: 0;
            line-height: 70px;
            text-align: center;
            width: 45px;
            height: 70px;
            color: #00d3ff;
            font-size: 16px;
            box-shadow: 0px 0px 8px 0px #649fff inset;
        }
        .right {
            width: 110px;
            height: 70px;
            border: 1px solid #649fff;
            .rightTop {
                width: 110px;
                height: 25px;
                line-height: 25px;
                text-align: center;
                box-shadow: 0px 0px 8px 0px #649fff inset;
            }
            .rightBottom {
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
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
}
</style>