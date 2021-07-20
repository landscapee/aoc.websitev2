<template>
    <div id="adjustmentReduction">
        <div class="adjustmentReduction_top">
            <div class="top_left">
                <i class="iconfont icon-shezhi"></i>
                调整调减
            </div>
            <div class="top_right">
                <div>恢复时间：{{reduceInfo.recoverBeginTime?$moment(reduceInfo.recoverBeginTime).format('YYYY-MM-DD HH:mm'):'--'}}</div>
                <div>最后调整时间：{{reduceInfo.recoverEndTime?$moment(reduceInfo.recoverEndTime).format('YYYY-MM-DD HH:mm'):'--'}}</div>
                <div>反馈时长：{{reduceInfo.feedbackTime?reduceInfo.feedbackTime:'-'}}分钟</div>
                <div class="top_right_time">
                    倒计时：
                    <div class="fo">{{countDownM}}</div>
                    分
                    <div class="fo">{{countDownS}}</div>
                    秒
                </div>
            </div>
        </div>
        <div class="adjustmentReduction_content">
            <div class="adjustmentReduction_content_left">
                <flight-decrease-lists :currentPlan="currentPlan" :flights="flights" :statistics="statistics" @filter-change="filterChange" @airlineDetails="airlineDetails" />
            </div>
            <div class="adjustmentReduction_content_right">
                <flight-delay :currentReduce="currentReduce" />
                <reduce-flight-lists :currentPlan="currentPlan" :reduceFlight="reduceFlight" @update="getCurrentReduce" @airlineDetails="airlineDetails" />
            </div>
        </div>
    </div>
</template>
<script>
import FlightDecreaseLists from './components/flightDecreaseLists.vue'
import ReduceFlightLists from './components/reduceFlightLists.vue'

import FlightDelay from '@/ui/views/conditionalOperation/decrease/components/flightDelay.vue'
import { mapGetters } from 'vuex'
import PostalStore from '@/ui/lib/postalStore'
let postalStore = new PostalStore()
export default {
    computed: {
        ...mapGetters({ user: 'getUserMsg' }),
    },
    components: {
        'flight-decrease-lists': FlightDecreaseLists,
        // 'decrease-recommend': DecreaseRecommend,
        'reduce-flight-lists': ReduceFlightLists,
        'flight-delay': FlightDelay,
    },
    data() {
        return {
            currentReduce: {},
            reduceInfo: {},
            airlineCode: '',
            path: '',
            currentPlan: {},
            city20: '',
            showAllFlights: false,
            flightNo: '',
            statistics: {},
            flights: [],
            countDownS: 0,
            countDownM: 0,
            reduceFlight: [],
            currentType: 1,
        }
    },
    created() {},
    mounted() {
        let TZZY = _.find(this.user.roles, (item) => item.code.indexOf('TZZY') > -1)
        let role = _.get(TZZY, 'menus.0', {})
        this.path = role.path ? JSON.parse(role.path)[0] : [] // [{"reversal":false,"data":["3U"]}]
        this.airlineCode = role.code ? role.code.split('-')[1] : ''

        this.getCurrentDelayType()
        postalStore.sub(
            'Web',
            'AdjustReduction.QueryFlight.Response',
            ({ flights, statistics }) => {
                let planDetailArrs =
                    this.currentReduce.planDetail[this.airlineCode] ||
                    this.currentReduce.planDetail['other'] ||
                    []

                planDetailArrs.map((arr) => {
                    let flight = _.find(flights, { flightId: arr.flightId })
                    if (flight) {
                        flight.level = arr.type == 'R' ? 'reduce' : 'exchange'
                    }
                })
                this.flights = flights
                this.statistics = statistics
            }
        )

        postalStore.pub('Worker', 'Delay.GetCity20', null)
        postalStore.sub('Delay.GetCity20', (data) => {
            this.city20 = data
        })
    },
    methods: {
        airlineDetails(data) {
            this.$request.post('adverse', 'update/airlineDetails', data).then(() => {
                this.getCurrentReduce()
            })
        },
        filterChange(data) {
            this.showAllFlights = data.showAllFlights
            this.flightNo = data.flightNo

            this.changeFilter()
        },
        changeFilter() {
            let { directions, airports, beginTime, endTime } = this.currentReduce.reduceInfo || {}
            let airport = _.get(this.city20, airports)

            let backEndFilter = [
                { direction: directions },
                { preOrNxtAirportCn: { $regex: airport } },
                { scheduleTime: { $gte: this.$moment(beginTime).format('x') } },
                { scheduleTime: { $lt: this.$moment(endTime).format('x') } },
            ]
            if (this.showAllFlights) {
                postalStore.pub('Worker', 'AdjustReduction.SetFilterOption', {
                    rolePath: this.path,
                    flightNo: this.flightNo,
                })
                return
            }
            postalStore.pub('Worker', 'AdjustReduction.SetFilterOption', {
                flightNo: this.flightNo,
                airlineCode: this.airlineCode,
                backEndFilter,
                rolePath: this.path,
            })
        },
        getCurrentDelayType() {
            this.$request.get('adverse', 'adjust/getCurrentDelayType').then((res) => {
                this.currentType = res.data.type
                this.getCurrentReduce()
            })
        },
        getCurrentReduce() {
            this.$request
                .get('adverse', 'adjust/getCurrentReduce?type=' + this.currentType)
                .then((res) => {
                    if (res.data && res.data.length > 0) {
                        let current = _.orderBy(
                            res.data,
                            (item) => parseInt(item.reduceInfo.reduceplanNo),
                            ['desc']
                        )[0]
                        console.log(current)

                        this.currentReduce = current
                        this.reduceInfo = current.reduceInfo || {}
                        this.movement = current.reduceInfo.movement

                        this.changeFilter()

                        let plan = current.plan || {}
                        this.currentPlan = plan[this.airlineCode] || plan['other'] || {}
                        // 调整调减数量
                        this.getReduceFlight(current)

                        let timer = setInterval(() => {
                            let now = new Date()
                            let countdown = this.$moment(this.currentPlan.sendTime)
                                .add(_.get(current, 'reduceInfo.feedbackTime'), 'm')
                                .diff(this.$moment(now))
                            if (countdown > 0) {
                                this.countDownM = parseInt(countdown / 1000 / 60)
                                this.countDownS = parseInt((countdown % 60000) / 1000)
                            } else {
                                countdown = 0
                                this.countDownM = 0
                                this.countDownS = 0
                                clearInterval(timer)
                            }
                        }, 500)
                    }
                })
        },
        getReduceFlight(current) {
            let flights = current.planDetail[this.airlineCode] || current.planDetail['other']
            postalStore.pub('Worker', 'AdjustReduction.GetFlights', flights)
            // let planDetailById = planDetail[current.red];

            postalStore.sub('Web', 'AdjustReduction.GetFlights.Res', (data) => {
                this.reduceFlight = data
            })
        },
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
            width: 70%;
        }
        .adjustmentReduction_content_right {
            width: 30%;
            margin-left: 15px;
        }
    }
}
</style>