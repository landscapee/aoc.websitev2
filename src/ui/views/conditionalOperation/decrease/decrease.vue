<template>
    <div id="decrease">
        <div class="decrease_left">
            <setting :currentType='currentType' @change-type="changeType" @change-planno="changePlanno" @add-planno="addPlanno" :currentReduce="currentReduce" :currentReduceLists="currentReduceLists" />
            <recommend :currentReduce="currentReduce" :airLinesGroup="airLinesGroup" />
        </div>
        <div class="decrease_mid">
            <MDRS-warning />
            <flight-decrease ref="ref_flightDecrease" :decreaseFlights="decreaseFlights" :airLinesGroup="airLinesGroup" />
            <flight-delay :currentReduce="currentReduce" />
        </div>
        <div class="decrease_right">
            <sure-decrease :currentReduce="currentReduce" :reduceFlight="reduceFlight" :airLinesGroup="airLinesGroup" />
        </div>

    </div>
</template>

<script>
import Setting from './components/setting.vue'
import Recommend from './components/recommend.vue'
import MDRSWarning from './components/MDRSWarning.vue'
import FlightDecrease from './components/flightDecrease.vue'
import FlightDelay from './components/flightDelay.vue'
import SureDecrease from './components/sureDecrease.vue'

import PostalStore from '@/ui/lib/postalStore'
let postalStore = new PostalStore()
export default {
    components: {
        setting: Setting,
        recommend: Recommend,
        'MDRS-warning': MDRSWarning,
        'flight-decrease': FlightDecrease,
        'flight-delay': FlightDelay,
        'sure-decrease': SureDecrease,
    },
    data() {
        return {
            currentReduce: {},
            reduceFlight: {},
            currentReduceLists: [],
            decreaseFlights: [],
            currentType: 1,
            airLinesGroup: {
                all: '全部',
                CA: '国航',
                '3U': '川航',
                MU: '东航',
                CZ: '南航',
                EU: '成航',
                '8L': '祥航',
                other: '其他',
            },
        }
    },
    mounted() {
        this.getCurrentDelayType()

        // //173.101.1.30:6075/api/adverse-condition/adjust/getCurrentDelayType
        // http: this.getCurrentReduce()

        // let tempAirport = airport;
        // direction = direction.value === 'All' || !direction.value ? '' : direction.value;
        // movement = movement.value === 'All' || !movement.value ? '' : movement.value;
        // airport = get(airport, 'value') === 'All' || !get(airport, 'value') ? '' : get(airport, 'label');
        // let filter = [{ scheduleTime: { $gt: moment(effectRangeS).format('x') } }, { scheduleTime: { $lte: moment(effectRangeE).format('x') } }];
        // movement && filter.push({ movement });
        // airport && filter.push({ preOrNxtAirportCn: airport });
        // direction && filter.push({ direction });

        // postalStore.pub('Worker', 'AdverseCondition.GetFlight', '')
        // postalStore.sub('Web', 'AdverseCondition.GetFlight.Response', (flights) => {
        //     this.decreaseFlights = flights.splice(0, 30) || []
        //     this.$nextTick(() => {
        //         this.$refs.ref_flightDecrease.navHandle(0)
        //     })
        // })
    },
    methods: {
        logg(row) {
            console.log(row)
        },
        changeType(currentType) {
            this.currentType = currentType
            this.getCurrentReduce()
        },
        getCurrentDelayType() {
            this.$request.get('adverse', 'adjust/getCurrentDelayType').then((res) => {
                this.currentType = res.data && res.data.type > 0 ? res.data.type : 1
                this.getCurrentReduce()
            })
        },
        getCurrentReduce() {
            this.$request
                .get('adverse', 'adjust/getCurrentReduce?type=' + this.currentType)
                .then((res) => {
                    if (res.data) {
                        this.currentReduceLists = _.sortBy(res.data, 'reduceInfo.reduceplanNo')

                        let index = _.findIndex(this.currentReduceLists, (list) => {
                            return list.reduceInfo.status === 0
                        })
                        this.changePlanno(index >= 0 ? index : 0)
                    }
                })
        },
        changePlanno(idx) {
            this.currentReduce = this.currentReduceLists[idx]
            this.getAirlineFromDb()
            this.getReduceFlights()
        },
        addPlanno() {
            this.currentReduceLists.push({
                plan: {},
                planDetail: {},
                reduceInfo: {
                    reduceplanNo: this.currentReduceLists.length + 1,
                    airports: '',
                    directions: '',
                    movement: '',
                    declineRatio: '',
                    recoverBeginTime: new Date().getTime(),
                    recoverEndTime: new Date().getTime(),
                    beginTime: new Date().getTime(),
                    endTime: new Date().getTime(),
                    status: 1,
                },
                suggest: {},
                suggestTime: {},
            })
            this.changePlanno(this.currentReduceLists.length - 1)
        },
        getReduceFlights() {
            // 发送状态 0:未发送 1:已发送给航司 2:航司已发给指挥室
            let planDetail = _.get(this.currentReduce, 'planDetail', {})
            let plan = _.get(this.currentReduce, 'plan', {})
            let reduceShouldShow = _.mapValues(planDetail, (item, key) => {
                if (plan[key].sendType == 2) {
                    return item
                }
                return []
            })
            console.log(reduceShouldShow)
            postalStore.pub('Worker', 'Decrease.GetReduceFlights', reduceShouldShow)
            postalStore.sub('Web', 'Decrease.GetReduceFlights.Response', (flightWithAirline) => {
                console.log(flightWithAirline)
                // this.setState({ reduceFlight: flightWithAirline });
                this.reduceFlight = flightWithAirline
            })
        },
        getAirlineFromDb() {
            let reduceInfo = this.currentReduce.reduceInfo

            let direction = reduceInfo.directions
            let movement = reduceInfo.movement
            let airport = reduceInfo.airports
            let filter = [
                { scheduleTime: { $gt: this.$moment(reduceInfo.beginTime).format('x') } },
                { scheduleTime: { $lte: this.$moment(reduceInfo.endTime).format('x') } },
                { cancel: { $nin: [true] } },
            ]
            movement && filter.push({ movement })
            airport && filter.push({ preOrNxtAirportCn: { $regex: airport } })
            direction && filter.push({ direction })

            //最右边列表
            //     this.sub('Web', 'Decrease.GetReduceFlights.Response', (flightWithAirline) => {
            // 	this.setState({ reduceFlight: flightWithAirline });
            // });
            // 获取航司航班列表
            postalStore.pub('Worker', 'AdverseCondition.GetFlight', [...filter])
            postalStore.sub('Web', 'AdverseCondition.GetFlight.Response', (flights) => {
                // map(flights, (item, index) => {
                //     if (map(allReduceFlightByType.R, (item) => item.flightId).indexOf(parseInt(item.flightId)) > -1) {
                //         item.level = 'reduce';
                //     }
                //     if (map(allReduceFlightByType.A, (item) => item.flightId).indexOf(parseInt(item.flightId)) > -1) {
                //         item.level = 'exchange';
                //     }
                // });

                this.decreaseFlights = flights
                this.$nextTick(() => {
                    this.$refs.ref_flightDecrease.navHandle(0)
                })
            })
        },
    },
}
</script>
<style scoped lang="scss">
#decrease {
    display: flex;
    .decrease_left {
        width: 520px;
        display: flex;
        flex-direction: column;
    }
    .decrease_mid {
        display: flex;
        flex-direction: column;
        width: 930px;
        margin: 0 15px;
    }
    .decrease_right {
        display: flex;
        flex-direction: column;
        width: 360px;
        flex: 1;
    }
    .showBox {
        background: rgba(25, 37, 60, 0.8);
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
        border-radius: 5px;
    }
}
</style>