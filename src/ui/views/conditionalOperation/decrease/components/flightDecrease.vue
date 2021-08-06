<template>
    <div class="flightDecrease showBox">
        <div class="title">
            <ul>
                <li v-for="(nav,idx) in navLists" :key="idx" :class="navFalg==idx?'active':''" @click="navHandle(idx)">{{nav.name}}({{nav.count}})</li>
            </ul>
            <div class="right">
                <el-input placeholder="请输入航班号" style="width:130px" size="mini" v-model="searchFlightNo" @change="searchFlight">
                    <el-button slot="append" icon="el-icon-search" @click="searchFlight"></el-button>
                </el-input>
                <div class="div1">
                    <div></div>
                    调减
                </div>
                <div class="div2">
                    <div></div>
                    调整
                </div>
            </div>
        </div>
        <div class="tableBox">
            <ele-table :columnConfig="columnConfig" :tableData="tableData" :setRowClassName="setRowClassName"></ele-table>
        </div>
    </div>
</template>
<script>
import { flightDecrease_columnConfig } from '../config'
import { mapGetters } from 'vuex'
export default {
    props: ['airLinesGroup', 'currentReduce', 'reduceFlight', 'postalStore'],
    computed: {
        ...mapGetters(['getFlightIndicator']),
    },
    data() {
        return {
            navLists: [
                { name: '全部', code: 'all', count: 0 },
                { name: '国航', code: 'CA', count: 0 },
                { name: '川航', code: '3U', count: 0 },
                { name: '东航', code: 'MU', count: 0 },
                { name: '成航', code: 'EU', count: 0 },
                { name: '南航', code: 'CZ', count: 0 },
                { name: '祥鹏', code: '8L', count: 0 },
                { name: '其他', code: 'other', count: 0 },
            ],
            navFalg: 0,
            columnConfig: flightDecrease_columnConfig,
            flightsGroup: {},
            tableData: [],
            searchFlightNo: '',
            decreaseFlights: [],
        }
    },
    watch: {
        currentReduce: function (val) {
            this.getAirlineFromDb()
        },
    },
    mounted() {},

    methods: {
        navHandle(idx) {
            this.searchFlightNo = ''
            this.navFalg = idx
            if (idx == 0) {
                this.tableData = this.decreaseFlights
            } else {
                this.tableData = this.flightsGroup[this.navLists[idx].code] || []
            }
        },
        setRowClassName({ row }) {
            if (row.level === 'reduce') {
                return 'reduce'
            }
            if (row.level === 'exchange') {
                return 'exchange'
            }
        },
        resetNav() {
            this.navLists.map((list) => {
                if (list.code == 'all') {
                    list.count = this.decreaseFlights.length
                } else {
                    list.count = this.flightsGroup[list.code]
                        ? this.flightsGroup[list.code].length
                        : 0
                }
            })
        },
        searchFlight() {
            let datas =
                this.navFalg == 0
                    ? this.decreaseFlights
                    : this.flightsGroup[this.navLists[this.navFalg].code]

            this.tableData = datas.filter((data) => {
                return _.includes(data.flightNo, this.searchFlightNo)
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

            // 获取航司航班列表
            this.postalStore.pub('Worker', 'AdverseCondition.GetFlight', [...filter])
            this.postalStore.sub('Web', 'AdverseCondition.GetFlight.Response', (flights) => {
                let planDetail = this.currentReduce.planDetail

                _.map(flights, (flight) => {
                    _.map(planDetail, (value) => {
                        _.map(value, (list) => {
                            if (list.flightId == flight.flightId) {
                                if (list.type == 'R') {
                                    flight.level = 'reduce'
                                }
                                if (list.type == 'A') {
                                    flight.level = 'exchange'
                                }
                            }
                        })
                    })
                })

                this.decreaseFlights = flights

                this.flightsGroup = _.groupBy(flights, (list) => {
                    if (this.airLinesGroup[list.airlineCode]) {
                        return list.airlineCode
                    } else {
                        return 'other'
                    }
                })
                this.resetNav()

                this.$nextTick(() => {
                    this.navHandle(this.navFalg)
                })
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.flightDecrease {
    padding: 10px 15px;
    color: #fff;
    margin-bottom: 15px;
    height: calc(70% - 145px);
    .title {
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        ul {
            height: 30px;
            li {
                color: rgba(255, 255, 255, 0.5);
                border-bottom: 2px solid transparent;
                display: inline-block;
                margin-right: 15px;
                height: 100%;
                line-height: 30px;
                cursor: pointer;
            }
            li.active {
                border-color: #0566ff;
                color: #0566ff;
            }
        }
        .right {
            display: flex;
            height: 30px;
            align-items: center;
            .div1 {
                margin: 0 10px;
                display: flex;
                div {
                    width: 14px;
                    height: 14px;
                    opacity: 1;
                    background: #2c3f6d;
                    margin-right: 5px;
                }
            }
            .div2 {
                display: flex;
                div {
                    width: 14px;
                    height: 14px;
                    opacity: 1;
                    background: #194955;
                    margin-right: 5px;
                }
            }
        }
    }
    .tableBox {
        height: calc(100% - 40px);
        margin-top: 10px;
    }
}
</style>
<style lang="scss">
.reduce {
    td {
        background-color: #2c3f6d !important;
    }
}
.exchange {
    td {
        background-color: #194955 !important;
    }
}
</style>