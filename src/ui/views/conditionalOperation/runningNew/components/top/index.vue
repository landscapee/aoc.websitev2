<template>
    <div class="topIndex">

        <div :class="'item item' +index" v-for="(opt,index) in pageObj" :style="opt.style" :key="index+'q'">
            <template v-if="opt.deal=='item0'">
                <div class="left">应急救援</div>

                <div class="rightItem" v-for="(opt1,index) in emergencyCfg" :key="index+'w'">
                    <!--<icon-svg :iconClass="opt.icon"></icon-svg>-->
                    <img :src="opt1.icon" alt="">
                    <div class="timeText">
                        <div class="first"><span>09:00</span>(23)</div>
                        <div class="second">指令发出时间</div>
                    </div>
                </div>
            </template>
            <template v-else-if="opt.deal=='item4'">
                <div class="rightItem">
                    <icon-svg :iconClass="opt.icon"></icon-svg>

                    <div class="timeText">
                        <div class="first"><span>09:00</span>架次</div>
                        <div class="second">航班指标预测</div>
                    </div>
                    <div class="timeText">
                        <div class="first"><span>09:00</span>架次</div>
                        <div class="second">实时延误航班</div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="rightItem">
                    <icon-svg :iconClass="opt.icon"></icon-svg>

                    <div class="timeText">
                        <div class="first"><span>09:00</span>(23)</div>
                        <div class="second">指令发出时间</div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import ssjd from '../../../../../assets/img/ssjd.png'
import zbjd from '../../../../../assets/img/zbjd.png'
import jsjd from '../../../../../assets/img/jsjd.png'
import moment from 'moment'
import PostalStore from '@ui_lib/postalStore'

let postalStore = new PostalStore()
export default {
    name: 'topIndex',
    components: {},
    data() {
        return {
            pageObj: [
                { name: '', key: '', icon: '', deal: 'item0', style: { background: '#3280e7' } },
                { name: '备降外场', key: '', icon: 'bjwc', style: { background: '#32c8e7' } },
                { name: '取消航班', key: '', icon: 'qxhb', style: { background: '#24ca87' } },
                { name: '预测积压情况', key: '', icon: 'yjjyqk', style: { background: '#5d9d52' } },
                {
                    name: '',
                    key: '',
                    icon: 'hbzbyc',
                    deal: 'item4',
                    style: { background: '#5f3fb0' },
                },
                {
                    name: '最近一次跑道使用间隔',
                    key: '',
                    icon: 'zjycpdsyjg',
                    style: { background: '#8f35aa' },
                },
            ],
            emergencyEventNode: [],
            postalStoreObj: [],
            emergencyCfg: [
                { key: 'ready', icon: zbjd },
                { key: 'doing', icon: ssjd },
                { key: 'finish', icon: jsjd },
            ],
        }
    },
    computed: {
        displayTime() {
            return (v, type, emptyStr) => {
                if (!v || !moment(v).isValid()) {
                    return emptyStr !== undefined ? emptyStr : '--'
                }
                return moment(v).format(type)
            }
        },
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
.topIndex {
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    display: flex;
    color: #fff;
    .item {
        flex: 1 1 auto;
        height: 100%;
        border-radius: 5px;
        box-shadow: 0px 2px 10px 0px rgba(63, 78, 90, 0.05);
        margin-left: 10px;
        padding: 12px 22px;
        .rightItem {
            display: flex;
            align-items: center;

            .timeText {
                margin-left: 12px;
                .first {
                    margin-bottom: 5px;
                    span {
                        font-size: 22px;
                        font-family: FjallaOne;
                        margin-right: 1px;
                    }
                }
                .second {
                    color: rgba(255, 255, 255, 0.51);
                }
            }
        }
        svg {
            width: 45px;
            height: 45px;
        }
    }
    .item0 {
        flex: 0 1 auto;
        width: 570px;
        margin-left: 0;
        display: flex;
        padding: 5px;
        display: flex;
        .left {
            text-align: center;
            writing-mode: vertical-rl;
            padding: 2px 8px 2px 5px;
            font-family: FjallaOne;
            color: #0566ff;
            font-weight: 600;
            border-radius: 5px;
            background: url('../../../../../assets/img/yjjy.png');
            background-size: 100% 100%;
        }
        .rightItem:nth-child(2) {
            margin-left: 25px !important;
        }
        .rightItem {
            margin-left: 35px;

            img {
                width: 43px;
            }
        }
    }
    .item4 {
        flex: 0 1 auto;
        width: 310px;
    }
}
</style>