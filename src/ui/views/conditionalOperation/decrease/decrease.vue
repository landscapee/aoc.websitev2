<template>
    <div id="decrease">
        <div class="decrease_left">
            <setting :currentType='currentType' @restart="restart" @change-type="changeType" @change-planno="changePlanno" @updateNowCur="getCurrentReduce" @add-planno="addPlanno" :currentReduce="currentReduce" :currentReduceLists="currentReduceLists" :postalStore="postalStore" />
            <recommend :currentReduce="currentReduce" :airLinesGroup="airLinesGroup" @updateNowCur="getCurrentReduce" />
        </div>
        <div class="decrease_mid">
            <MDRS-warning />
            <flight-decrease ref="ref_flightDecrease" :currentReduce='currentReduce' :airLinesGroup="airLinesGroup" :postalStore="postalStore" />
            <flight-delay :currentReduce="currentReduce" />
        </div>
        <div class="decrease_right">
            <sure-decrease :currentReduce="currentReduce" :reduceFlight="reduceFlight" :airLinesGroup="airLinesGroup" @updateNowCur="getCurrentReduce" :postalStore="postalStore" />
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
import { memoryStore } from '@/worker/lib/memoryStore'
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
            current: '',
            postalStore: postalStore,
        }
    },
    destroyed() {
        postalStore.pub('Worker', 'Page.Decrease.Stop', '')
        postalStore.unsubAll()
    },
    mounted() {
        this.getCurrentDelayType()

        postalStore.sub('Web', 'AdverseCondition.Decrease.SetReduce', (data) => {
            if (data.length == 0) {
                this.restart()
            } else {
                this.currentReduceLists = _.sortBy(data, 'reduceInfo.reduceplanNo')
                if (this.current) {
                    let index = _.findIndex(this.currentReduceLists, (list) => {
                        return list.reduceId === this.current.reduceId
                    })
                    this.changePlanno(index)
                } else {
                    let index = _.findIndex(this.currentReduceLists, (list) => {
                        return list.reduceInfo.status === 0
                    })
                    this.changePlanno(index >= 0 ? index : this.currentReduceLists.length - 1)
                }
            }
        })
    },
    methods: {
        restart() {
            this.currentReduceLists = []
            this.addPlanno()
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
        getCurrentReduce(current) {
            postalStore.pub('Worker', 'Decrease.GetCurrentReduce', this.currentType)

            // this.$request
            //     .get('adverse', 'adjust/getCurrentReduce?type=' + this.currentType)
            //     .then((res) => {
            //         if (res.data) {
            //             this.current = current
            //             memoryStore.setItem('AdverseCondition', { reduceData: res.data })
            //             postalStore.pub('Web', 'AdverseCondition.Decrease.SetReduce', null)
            //         }
            //     })
        },
        changePlanno(idx) {
            console.log(idx)
            this.currentReduce = this.currentReduceLists[idx]
        },
        addPlanno() {
            this.currentReduceLists.push({
                plan: {},
                planDetail: {},
                reduceId: '',
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
    },
}
</script>
<style scoped lang="scss">
#decrease {
    display: flex;
    .decrease_left {
        width: 520px;
    }
    .decrease_mid {
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