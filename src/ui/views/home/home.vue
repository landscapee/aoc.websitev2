<template>
    <div id="home">
        <div class="home_left">
            <div class="p-0x0 s-12x1 numberBox">
                <number v-for="(item,index) in numbersArr" :key="item.type+index" :options="item" :flight_home="flight_home" />
            </div>
            <number2 v-for="(item,index) in numbers2Arr" :key="item.type+index" :options="item" :flight_home="flight_home" @flight-dialog-handle="flightDialogHandle" />
            <month-delay :options="monthData" :flight_home="flight_home" :flight_monthClearance="flight_monthClearance" :flight_lastestAta="flight_lastestAta" :flight_lastestAtd="flight_lastestAtd" @flight-dialog-handle="flightDialogHandle" />
            <flight-chart :options="chartData" :flight_home="flight_home" :flight_FlightStatistic="flight_FlightStatistic" :flight_delay_backStatus="flight_delay_backStatus" @set-settingcfg="setSettingcfg" />
            <rate :options="rateData" :rate_data="flight_home.rate" />
            <direction :options="directionData" :flight_direction="flight_direction" />
        </div>
        <div class="home_right">
            <top-flight :flight_traffic="flight_traffic" :flight_estimateCtotRelease="flight_estimateCtotRelease" :flight_runwayTraffic="flight_runwayTraffic" />
            <runway :flight_runwayModels="flight_runwayModels" />
        </div>
        <flight-dialog ref="ref_flightDialog" />
    </div>
</template>

<script>
import { postions } from './static/js/postions.js'
import { settings as settingsCfg } from './static/js/settingHome'
import PostalStore from '@ui_lib/postalStore'
let postalStore = new PostalStore()
import Number from './components/number'
import Number2 from './components/number2'
import MonthDelay from './components/monthDelay'
import Topflight from './components/topFlight'
import Runway from './components/runway'
import FlightChart from './components/flightChart'
import Rate from './components/rate'
import Direction from './components/direction'
import flightDialog from './components/flightDialog'

export default {
    data() {
        return {
            numbersArr: [],
            numbers2Arr: [],
            monthData: {},
            dataRowsArr: [],
            chartData: {},
            rateData: {},
            directionData: {},

            flight_home: {},
            flight_monthClearance: {},
            flight_lastestAta: [],
            flight_lastestAtd: [],
            flight_FlightStatistic: {},
            flight_delay_backStatus: {},
            flight_direction: {},
            flight_traffic: {},
            flight_estimateCtotRelease: {},
            flight_runwayTraffic: {},
            flight_runwayModels: [],
        }
    },
    components: {
        number: Number,
        number2: Number2,
        'month-delay': MonthDelay,
        'top-flight': Topflight,
        runway: Runway,
        'flight-chart': FlightChart,
        rate: Rate,
        direction: Direction,
        'flight-dialog': flightDialog,
    },
    created() {
        this.loadSetting()

        postalStore.pub('Worker', 'Page.Home.Start', '')
        postalStore.sub('flight.home', (data) => {
            console.log(data)
            this.flight_home = data
        })
        // ???????????????????????????
        postalStore.sub('flight.monthClearance', (data) => {
            // console.log('???????????????????????????', data)
            this.flight_monthClearance = data
        })
        // ????????????????????????
        postalStore.sub('flight.lastestAta', (data) => {
            // console.log('????????????????????????', data)
            this.flight_lastestAta = data.splice(0, 5)
        })
        // ????????????????????????
        postalStore.sub('flight.lastestAtd', (data) => {
            // console.log('????????????????????????', data)
            this.flight_lastestAtd = data.splice(0, 5)
        })
        //??????
        postalStore.sub('flight.FlightStatistic', (data) => {
            // console.log('??????', data)
            this.flight_FlightStatistic = data
        })
        //????????????????????????
        postalStore.sub('flight.direction', (data) => {
            // console.log('????????????????????????', data)
            this.flight_direction = data
        })
        // ????????????
        postalStore.sub('flight.traffic', (data) => {
            // console.log('????????????', data)
            this.flight_traffic = data
        })
        //?????????????????????
        postalStore.sub('flight.estimateCtotRelease', (data) => {
            // console.log('?????????????????????', data)
            this.flight_estimateCtotRelease = data
        })
        //????????????
        postalStore.sub('flight.runwayTraffic', (data) => {
            // console.log('????????????', data)
            this.flight_runwayTraffic = data
        })
        //??????
        postalStore.sub('flight.runwayModels', (data) => {
            // console.log('??????', data)
            this.flight_runwayModels = data
        })

        postalStore.pub('Worker', 'Page.Delays.Start', '')
        postalStore.sub('flight.delay.backStatus', (data) => {
            // console.log('??????', data)
            this.flight_delay_backStatus = data
        })
    },
    mounted() {},
    destroyed() {
        postalStore.pub('Worker', 'Page.Home.Stop', '')
        postalStore.unsubAll()
    },
    methods: {
        loadSetting() {
            _.each(settingsCfg, (item, k) => {
                if (postions[k]) {
                    if (postions[k]) {
                        if (item.type == 'number') {
                            this.numbersArr.push(_.assign({}, item, postions[k]))
                        }
                        if (item.type == 'number2') {
                            this.numbers2Arr.push(_.assign({}, item, postions[k]))
                        }
                        if (item.type == 'month') {
                            //????????????
                            this.monthData = _.assign({}, item, postions[k])
                        }
                        if (item.type == 'chart') {
                            //??????
                            if (k == 'summary-by-hour-backlog') {
                                this.chartData = _.assign({}, item, postions[k])
                            }
                            if (k == 'takeOffPercent') {
                                //???????????????
                                this.rateData.takeOffPercent = _.assign({}, item, postions[k])
                            }
                            if (k == 'originatedDeparturePercent') {
                                //???????????????
                                this.rateData.originatedDeparturePercent = _.assign(
                                    {},
                                    item,
                                    postions[k]
                                )
                            }
                        }
                        if (item.type == 'rate') {
                            //?????????
                            this.rateData.rate = _.assign({}, item, postions[k])
                        }
                        if (item.type == 'mixinZone') {
                            //?????????
                            this.directionData.direction = _.assign({}, item, postions[k])
                        }
                        if (item.type == 'Map') {
                            //????????????
                            this.directionData.map = _.assign({}, item, postions[k])
                        }
                    }
                }
            })
        },
        setSettingcfg(key) {
            this.chartData = _.get(settingsCfg, key)
        },
        flightDialogHandle(option) {
            this.$refs.ref_flightDialog.initData(option)
        },
    },
}
</script>

<style scoped lang='scss'>
#home {
    display: flex;
    padding: 7.5px;
    .home_left {
        width: calc(100% - 260px);
        height: 100%;
        position: relative;
        & > div {
            overflow: hidden;
        }
    }
    .home_right {
        width: 260px;
    }
    .numberBox {
        position: absolute;
        display: flex;
    }

    $unitWidth: 100%/24;
    $unitHeight: 10%;

    @for $row from 0 through 10 {
        @for $col from 0 through 24 {
            .p-#{$col}x#{$row} {
                left: $col * $unitWidth;
                top: $row * $unitHeight;
            }

            .s-#{$col}x#{$row} {
                width: $unitWidth * $col;
                height: $unitHeight * $row;
            }
        }
    }
}
</style>

<style lang='scss'>
@import 'static/css/chart';
.box_content {
    height: 100%;
    width: 100%;
    background: linear-gradient(
        134deg,
        rgba(26, 39, 64, 0.5) 0,
        rgba(29, 47, 67, 0.5) 30%,
        rgba(29, 47, 67, 0.5) 100%
    ) !important;
    overflow: hidden;
    padding: 5px 10px 0;
}

.homeSelect {
    li {
        height: 20px;
        line-height: 20px;
        padding: 0 5px;

        span {
            font-size: 12px;
        }
    }
}
.home_right {
    .el-select {
        input {
            background-color: #101c2f;
            border: 1px solid #37455c;
            color: #fff;
            height: 30px;
        }
    }
}
.home_rate {
    .el-select {
        width: 80px;
    }
}
.selectGroup {
    .el-select {
        input {
            border-radius: 0 4px 4px 0;
        }
    }
}
</style>
