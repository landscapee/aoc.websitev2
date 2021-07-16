<template>
    <div id="adjustmentReduction">
        <div class="adjustmentReduction_top">
            <div class="top_left">
                <i class="iconfont icon-shezhi"></i>
                调时调减
            </div>
            <div class="top_right">
                <div>恢复时间：2021-10-20 20:00</div>
                <div>最后调整时间：2021-10-20 20:00</div>
                <div>反馈时常：长30分钟</div>
                <div class="top_right_time">
                    倒计时：
                    <div class="fo">1</div>
                    <div class="fo">8</div>
                    分
                    <div class="fo">1</div>
                    <div class="fo">8</div>
                    秒
                </div>
            </div>
        </div>
        <div class="adjustmentReduction_content">
            <div class="adjustmentReduction_content_left">
                <flight-decrease-lists />
            </div>
            <div class="adjustmentReduction_content_right">
                <decrease-recommend />
                <reduce-flight-lists />
            </div>
        </div>
    </div>
</template>
<script>
import FlightDecreaseLists from './components/flightDecreaseLists.vue'
import DecreaseRecommend from './components/decreaseRecommend.vue'
import ReduceFlightLists from './components/reduceFlightLists.vue'
import { mapGetters } from 'vuex'
import PostalStore from '@/ui/lib/postalStore'
let postalStore = new PostalStore()
export default {
    computed: {
        ...mapGetters({ user: 'getUserMsg' }),
    },
    components: {
        'flight-decrease-lists': FlightDecreaseLists,
        'decrease-recommend': DecreaseRecommend,
        'reduce-flight-lists': ReduceFlightLists,
    },
    data() {
        return {}
    },
    mounted() {
        console.log(this.userData)

        let TZZY = _.find(this.user.roles, (item) => item.code.indexOf('TZZY') > -1)
        let role = _.get(TZZY, 'menus.0', {})
        let path = role.path || '[]' // [{"reversal":false,"data":["3U"]}]
        let airlineCode = role.code ? role.code.split('-')[1] : ''

        // console.log(airlineCode)

        postalStore.pub('Worker', 'AdjustReduction.SetFilterOption', { airlineCode: airlineCode })
        postalStore.sub(
            'Web',
            'AdjustReduction.QueryFlight.Response',
            ({ flights, statistics }) => {
                console.log(flights, statistics)
            }
        )
    },
}
</script>
<style lang="scss" scoped>
#adjustmentReduction {
    padding: 15px;
    .adjustmentReduction_top {
        background: rgba(47, 90, 160, 0.3);
        border: 1px solid #2f5aa0;
        border-radius: 6px;
        padding: 10px 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        .top_left {
            color: #fff;
            i {
                color: #4181e9;
                margin-right: 5px;
            }
        }
        .top_right {
            display: flex;
            color: #fff;
            & > div {
                margin-left: 20px;
            }
        }
        .top_right_time {
            display: flex;
            align-items: center;
            div {
                width: 20px;
                height: 20px;
                color: #feb502;
                background: rgb(216, 216, 216, 0.15);
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0 2px;
            }
        }
    }
    .showBox {
        background: rgba(25, 37, 60, 0.8);
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
        border-radius: 5px;
        padding: 15px;
    }
    .adjustmentReduction_content {
        height: calc(100% - 57px);
        display: flex;
        .adjustmentReduction_content_left {
            width: 1265px;
        }
        .adjustmentReduction_content_right {
            flex: 1;
            margin-left: 15px;
        }
    }
}
</style>