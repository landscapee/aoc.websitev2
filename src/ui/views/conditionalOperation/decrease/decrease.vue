<template>
    <div id="decrease">
        <div class="decrease_left">
            <setting :type='type' @change-type="changeType" @change-planno="changePlanno" @add-planno="addPlanno" :currentReduce="currentReduce" :currentReduceLists="currentReduceLists" />
            <recommend :type='type' :currentReduce="currentReduce" />
        </div>
        <div class="decrease_mid">
            <MDRS-warning />
            <flight-decrease ref="ref_flightDecrease" :decreaseFlights="decreaseFlights" />
            <flight-delay />
        </div>
        <div class="decrease_right">
            <sure-decrease />
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

import PostalStore from '/src/ui/lib/postalStore'
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
            type: 1,
            currentReduce: {},
            currentReduceLists: [],
            decreaseFlights: [],
        }
    },
    mounted() {
        this.getCurrentReduce()

        postalStore.pub('Worker', 'AdverseCondition.GetFlight', '')
        postalStore.sub('Web', 'AdverseCondition.GetFlight.Response', (flights) => {
            this.decreaseFlights = flights.splice(0, 30) || []
            this.$nextTick(() => {
                this.$refs.ref_flightDecrease.navHandle(0)
            })
        })
    },
    methods: {
        logg(row) {
            console.log(row)
        },
        changeType(type) {
            this.type = type
            this.getCurrentReduce()
        },
        getCurrentReduce() {
            this.$request
                .get('adverse', 'adjust/getCurrentReduce?type=' + this.type)
                .then((res) => {
                    if (res.data) {
                        console.log(res.data)
                        this.currentReduceLists = _.sortBy(res.data, 'reduceInfo.reduceplanNo')
                        this.changePlanno(0)
                    }
                })
        },
        changePlanno(idx) {
            console.log(idx)
            this.currentReduce = this.currentReduceLists[idx]
        },
        addPlanno() {
            this.currentReduceLists.push({
                reduceInfo: {
                    reduceplanNo: this.currentReduceLists.length,
                },
            })
            this.changePlanno(this.currentReduceLists.length - 1)
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